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

function siteSeoPlugin(): Plugin {
  return {
    name: "site-seo",
    transformIndexHtml(html) {
      // Rewrite og:image and twitter:image to the correct deployment domain
      html = html.replace(
        /content="https:\/\/equinebodywork\.com\/opengraph\.jpg"/g,
        `content="${SITE_URL}/opengraph.jpg"`,
      );

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
