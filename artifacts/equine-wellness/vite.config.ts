import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { imagetools } from "vite-imagetools";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

const SITE_URL = (process.env.VITE_SITE_URL ?? "https://equinebodywork.com").replace(/\/$/, "");
const GSC_VERIFICATION = process.env.VITE_GSC_VERIFICATION ?? "";
const GA4_MEASUREMENT_ID = process.env.VITE_GA4_MEASUREMENT_ID ?? "";

type StaticUrl = { loc: string; changefreq: string; priority: string };

const STATIC_URLS: StaticUrl[] = [
  { loc: "/", changefreq: "monthly", priority: "1.0" },
  { loc: "/bio", changefreq: "monthly", priority: "0.8" },
  { loc: "/modalities", changefreq: "monthly", priority: "0.9" },
  { loc: "/gallery", changefreq: "monthly", priority: "0.6" },
  { loc: "/partners", changefreq: "monthly", priority: "0.6" },
  { loc: "/news", changefreq: "weekly", priority: "0.7" },
];

function readNewsletterPosts(): Array<{ slug: string; date: string }> {
  const file = path.resolve(import.meta.dirname, "src/content/newsletter-posts.ts");
  const text = fs.readFileSync(file, "utf8");
  const out: Array<{ slug: string; date: string }> = [];
  // Match each post object: capture slug, then the date that follows.
  const re = /slug:\s*"([^"]+)"[\s\S]*?date:\s*"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push({ slug: m[1]!, date: m[2]! });
  }
  return out;
}

function buildSitemap(): string {
  const posts = readNewsletterPosts();
  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  for (const u of STATIC_URLS) {
    lines.push("  <url>");
    lines.push(`    <loc>${SITE_URL}${u.loc}</loc>`);
    lines.push(`    <changefreq>${u.changefreq}</changefreq>`);
    lines.push(`    <priority>${u.priority}</priority>`);
    lines.push("  </url>");
  }
  for (const p of posts) {
    lines.push("  <url>");
    lines.push(`    <loc>${SITE_URL}/news/${p.slug}</loc>`);
    lines.push(`    <lastmod>${p.date}</lastmod>`);
    lines.push("    <changefreq>yearly</changefreq>");
    lines.push("    <priority>0.6</priority>");
    lines.push("  </url>");
  }
  lines.push("</urlset>");
  return lines.join("\n") + "\n";
}

function buildRobots(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

function siteSeoPlugin(): Plugin {
  return {
    name: "site-seo",
    transformIndexHtml(html) {
      const tags: string[] = [];
      if (GSC_VERIFICATION) {
        tags.push(
          `    <meta name="google-site-verification" content="${GSC_VERIFICATION}" />`,
        );
      }
      if (GA4_MEASUREMENT_ID) {
        tags.push(
          `    <script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}"></script>`,
        );
        tags.push(
          `    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{'analytics_storage':'denied'});gtag('js',new Date());gtag('config','${GA4_MEASUREMENT_ID}',{send_page_view:false});</script>`,
        );
      }
      if (tags.length === 0) return html;
      return html.replace("</head>", `${tags.join("\n")}\n  </head>`);
    },
  };
}

function imagetoolsGuardPlugin(): Plugin {
  const cacheDir = path.resolve(
    import.meta.dirname,
    "node_modules/.cache/imagetools",
  );
  return {
    name: "imagetools-guard",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        const idx = url.indexOf("/@imagetools/");
        if (idx === -1) {
          next();
          return;
        }
        const id = url.slice(idx + "/@imagetools/".length).split("?")[0];
        if (!id || !/^[a-f0-9]+$/.test(id)) {
          res.statusCode = 404;
          res.setHeader("content-type", "text/plain");
          res.end("not found");
          return;
        }
        const filePath = `${cacheDir}/${id}`;
        try {
          const buf = await fs.promises.readFile(filePath);
          let mime = "image/jpeg";
          if (buf.length >= 12) {
            const hex = buf.subarray(0, 12).toString("hex");
            if (hex.startsWith("89504e47")) mime = "image/png";
            else if (hex.startsWith("52494646") && buf.subarray(8, 12).toString() === "WEBP")
              mime = "image/webp";
            else if (buf.subarray(4, 8).toString() === "ftyp") mime = "image/avif";
          }
          res.setHeader("content-type", mime);
          res.setHeader("cache-control", "no-cache");
          res.end(buf);
          return;
        } catch {
          next();
        }
      });
    },
  };
}

function sitemapPlugin(): Plugin {
  let outDir = "";
  return {
    name: "site-sitemap",
    configResolved(cfg) {
      outDir = cfg.build.outDir;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0];
        if (url === "/sitemap.xml") {
          res.setHeader("content-type", "application/xml; charset=utf-8");
          res.end(buildSitemap());
          return;
        }
        if (url === "/robots.txt") {
          res.setHeader("content-type", "text/plain; charset=utf-8");
          res.end(buildRobots());
          return;
        }
        next();
      });
    },
    closeBundle() {
      if (!outDir) return;
      const dir = path.isAbsolute(outDir)
        ? outDir
        : path.resolve(import.meta.dirname, outDir);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "sitemap.xml"), buildSitemap(), "utf8");
      fs.writeFileSync(path.join(dir, "robots.txt"), buildRobots(), "utf8");
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    imagetoolsGuardPlugin(),
    imagetools({
      defaultDirectives: (url) => {
        if (!url.searchParams.has("picture")) return new URLSearchParams();
        const params = new URLSearchParams();
        params.set("format", url.searchParams.get("format") ?? "avif;webp;jpg");
        params.set("w", url.searchParams.get("w") ?? "400;800;1200");
        params.set("as", "picture");
        const quality = url.searchParams.get("quality");
        if (quality) params.set("quality", quality);
        return params;
      },
    }),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    siteSeoPlugin(),
    sitemapPlugin(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
