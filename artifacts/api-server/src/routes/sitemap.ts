import { Router } from "express";
import { desc } from "drizzle-orm";
import { db, generatedPostsTable } from "@workspace/db";
import { getSiteBaseUrl } from "../lib/newsletter-emails";

const router = Router();

type StaticUrl = { loc: string; changefreq: string; priority: string };

const STATIC_URLS: StaticUrl[] = [
  { loc: "/", changefreq: "monthly", priority: "1.0" },
  { loc: "/bio", changefreq: "monthly", priority: "0.8" },
  { loc: "/modalities", changefreq: "monthly", priority: "0.9" },
  { loc: "/gallery", changefreq: "monthly", priority: "0.6" },
  { loc: "/partners", changefreq: "monthly", priority: "0.6" },
  { loc: "/news", changefreq: "weekly", priority: "0.7" },
  { loc: "/survey", changefreq: "monthly", priority: "0.5" },
];

router.get("/sitemap.xml", async (req, res) => {
  const siteUrl = getSiteBaseUrl();

  let posts: Array<{ slug: string; date: string }> = [];
  try {
    posts = await db
      .select({ slug: generatedPostsTable.slug, date: generatedPostsTable.date })
      .from(generatedPostsTable)
      .orderBy(desc(generatedPostsTable.date));
  } catch (err) {
    req.log?.error({ err }, "sitemap: failed to fetch generated posts");
  }

  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  for (const u of STATIC_URLS) {
    lines.push("  <url>");
    lines.push(`    <loc>${siteUrl}${u.loc}</loc>`);
    lines.push(`    <changefreq>${u.changefreq}</changefreq>`);
    lines.push(`    <priority>${u.priority}</priority>`);
    lines.push("  </url>");
  }
  for (const p of posts) {
    lines.push("  <url>");
    lines.push(`    <loc>${siteUrl}/news/${p.slug}</loc>`);
    lines.push(`    <lastmod>${p.date}</lastmod>`);
    lines.push("    <changefreq>yearly</changefreq>");
    lines.push("    <priority>0.6</priority>");
    lines.push("  </url>");
  }
  lines.push("</urlset>");
  const xml = lines.join("\n") + "\n";

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(xml);
});

router.get("/robots.txt", (_req, res) => {
  const siteUrl = getSiteBaseUrl();
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
});

export default router;
