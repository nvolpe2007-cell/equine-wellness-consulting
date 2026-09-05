// Lightweight, dependency-free SEO audit against the LIVE deployed site.
// Checks the stuff that silently rots: title/meta description presence and
// length, canonical tag, OG/Twitter tag completeness, whether og:image /
// twitter:image actually resolve to an image (not a stale domain serving
// HTML), and that robots.txt / sitemap.xml exist.
//
// Usage: tsx scripts/src/seo-check.ts [url]  (defaults to SITE_URL below)

const SITE_URL = process.argv[2] ?? "https://theworthyhorse.org";

type Check = { label: string; ok: boolean; detail?: string };

function extractMeta(html: string, attr: "name" | "property", key: string): string | null {
  const re = new RegExp(`<meta[^>]*${attr}=["']${key}["'][^>]*content=["']([^"']*)["']`, "i");
  const alt = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${key}["']`, "i");
  return html.match(re)?.[1] ?? html.match(alt)?.[1] ?? null;
}

function extractTag(html: string, tag: string): string | null {
  const m = html.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "i"));
  return m?.[1] ?? null;
}

async function imageResolves(url: string): Promise<{ ok: boolean; detail: string }> {
  try {
    const res = await fetch(url, { method: "GET" });
    const ct = res.headers.get("content-type") ?? "";
    if (!res.ok) return { ok: false, detail: `HTTP ${res.status}` };
    if (!ct.startsWith("image/")) return { ok: false, detail: `content-type is "${ct}", not an image` };
    return { ok: true, detail: ct };
  } catch (err) {
    return { ok: false, detail: String(err) };
  }
}

async function pathExists(base: string, path: string): Promise<{ ok: boolean; status: number }> {
  try {
    const res = await fetch(new URL(path, base));
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

async function main() {
  const checks: Check[] = [];
  const res = await fetch(SITE_URL);
  const html = await res.text();

  const title = extractTag(html, "title");
  checks.push({
    label: "title",
    ok: !!title && title.length >= 15 && title.length <= 65,
    detail: title ? `"${title}" (${title.length} chars)` : "MISSING",
  });

  const desc = extractMeta(html, "name", "description");
  checks.push({
    label: "meta description",
    ok: !!desc && desc.length >= 50 && desc.length <= 160,
    detail: desc ? `${desc.length} chars` : "MISSING",
  });

  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  checks.push({
    label: "canonical link (static HTML)",
    ok: !!canonicalMatch,
    detail: canonicalMatch
      ? canonicalMatch[1]
      : "not in raw HTML — OK if this app sets it client-side (verify in a real browser)",
  });

  const ogTitle = extractMeta(html, "property", "og:title");
  const ogDesc = extractMeta(html, "property", "og:description");
  const ogImage = extractMeta(html, "property", "og:image");
  const twImage = extractMeta(html, "name", "twitter:image");
  checks.push({ label: "og:title", ok: !!ogTitle, detail: ogTitle ?? "MISSING" });
  checks.push({ label: "og:description", ok: !!ogDesc, detail: ogDesc ?? "MISSING" });

  for (const [label, url] of [
    ["og:image resolves to an image", ogImage],
    ["twitter:image resolves to an image", twImage],
  ] as const) {
    if (!url) {
      checks.push({ label, ok: false, detail: "tag MISSING" });
      continue;
    }
    const abs = url.startsWith("http") ? url : new URL(url, SITE_URL).toString();
    const r = await imageResolves(abs);
    checks.push({ label, ok: r.ok, detail: `${abs} -> ${r.detail}` });
  }

  const robots = await pathExists(SITE_URL, "/robots.txt");
  checks.push({ label: "robots.txt", ok: robots.ok, detail: `HTTP ${robots.status}` });

  const sitemap = await pathExists(SITE_URL, "/sitemap.xml");
  checks.push({ label: "sitemap.xml", ok: sitemap.ok, detail: `HTTP ${sitemap.status}` });

  const twCard = extractMeta(html, "name", "twitter:card");
  checks.push({ label: "twitter:card", ok: !!twCard, detail: twCard ?? "MISSING" });

  console.log(`SEO check: ${SITE_URL}\n`);
  let failed = 0;
  for (const c of checks) {
    console.log(`${c.ok ? "PASS" : "FAIL"}  ${c.label}${c.detail ? ` — ${c.detail}` : ""}`);
    if (!c.ok) failed++;
  }
  console.log(`\n${checks.length - failed}/${checks.length} checks passed.`);
  if (failed > 0) process.exitCode = 1;
}

main();
