import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import type { TextBlock } from "@anthropic-ai/sdk/resources/messages/messages";
import { db, dispatchesTable, generatedPostsTable } from "@workspace/db";
import { getAnthropicClient } from "./anthropic";
import { webSearchTool } from "./anthropic-tools";
import { draftNewsletter } from "./draft-newsletter";
import { sendDispatch } from "./send-dispatch";
import { logger } from "./logger";

const NEWSLETTER_POSTS_PATH = fileURLToPath(
  new URL(
    "../../../../artifacts/equine-wellness/src/content/newsletter-posts.ts",
    import.meta.url,
  ),
);

type NewsletterCategory =
  | "Legislation"
  | "Seasonal Care"
  | "Industry"
  | "Session Guide"
  | "Wellness";

type RawPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  metaDescription: string;
  body: string[];
};

const VALID_CATEGORIES: NewsletterCategory[] = [
  "Legislation",
  "Seasonal Care",
  "Industry",
  "Session Guide",
  "Wellness",
];

const POSTS_SYSTEM_PROMPT = `You are a ghostwriter for Susie H. Lytal, MS, an equine biomechanist who runs a bodywork and wellness practice. You write for "The Worthy Horse News" website. Your job is to rewrite five standing articles on the site with fresh, current, well-researched content. Use the web_search tool to find current information to incorporate naturally.

Voice: calm, warm, authoritative, like a trusted barn friend who has done the reading. No marketing speak, no bullet points in body text, no emoji. Body paragraphs are flowing prose. Each article body should be 4–5 paragraphs, each 60–120 words.

You must produce exactly five articles covering these topics and categories:
1. Subtle signs a horse is carrying tension that owners commonly miss (category: "Seasonal Care")
2. What to expect during a first equine bodywork session (category: "Session Guide")
3. Managing heat and recovery for working horses through warm seasons (category: "Seasonal Care")
4. PEMF therapy — what horse owners actually need to understand (category: "Industry")
5. How equine bodywork fits alongside veterinary care (category: "Wellness")

Return ONLY a JSON array inside a fenced code block:

\`\`\`json
[
  {
    "id": "YYYY-MM-short-slug",
    "slug": "full-url-slug",
    "title": "Article title here",
    "date": "YYYY-MM-DD",
    "category": "Seasonal Care",
    "excerpt": "One compelling sentence teaser under 180 chars.",
    "metaDescription": "SEO meta description under 160 chars.",
    "body": [
      "First paragraph text.",
      "Second paragraph text.",
      "Third paragraph text.",
      "Fourth paragraph text."
    ]
  }
]
\`\`\`

Make all dates within the last 90 days. Incorporate any current relevant information you find, but keep the writing grounded in Susie's practice perspective. Do not invent facts, organizations, or statistics.`;

function extractJsonArray(text: string): unknown | null {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text.match(/\[[\s\S]*\]/)?.[0];
  if (!candidate) return null;
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}

function validatePosts(raw: unknown): RawPost[] {
  if (!Array.isArray(raw)) throw new Error("Expected a JSON array of posts");
  return raw.map((item, i) => {
    if (!item || typeof item !== "object") throw new Error(`Post ${i} is not an object`);
    const o = item as Record<string, unknown>;
    const id = typeof o["id"] === "string" ? o["id"].trim() : "";
    const slug = typeof o["slug"] === "string" ? o["slug"].trim() : "";
    const title = typeof o["title"] === "string" ? o["title"].trim() : "";
    const date = typeof o["date"] === "string" ? o["date"].trim() : "";
    const category = typeof o["category"] === "string" ? o["category"].trim() : "";
    const excerpt = typeof o["excerpt"] === "string" ? o["excerpt"].trim() : "";
    const metaDescription =
      typeof o["metaDescription"] === "string" ? o["metaDescription"].trim() : "";
    const bodyRaw = Array.isArray(o["body"]) ? o["body"] : [];
    const body = bodyRaw.filter((b): b is string => typeof b === "string");

    if (!id || !slug || !title || !date || !body.length) {
      throw new Error(`Post ${i} is missing required fields`);
    }
    if (!VALID_CATEGORIES.includes(category as NewsletterCategory)) {
      throw new Error(`Post ${i} has invalid category: ${category}`);
    }
    return { id, slug, title, date, category, excerpt, metaDescription, body };
  });
}

function generateNewsletterPostsTS(posts: RawPost[]): string {
  const postsCode = posts
    .map((p) => {
      const bodyLines = p.body.map((b) => `    ${JSON.stringify(b)},`).join("\n");
      return `  {
    id: ${JSON.stringify(p.id)},
    slug: ${JSON.stringify(p.slug)},
    title: ${JSON.stringify(p.title)},
    date: ${JSON.stringify(p.date)},
    category: ${JSON.stringify(p.category)} as NewsletterCategory,
    excerpt: ${JSON.stringify(p.excerpt)},
    metaDescription: ${JSON.stringify(p.metaDescription)},
    body: [
${bodyLines}
    ],
  }`;
    })
    .join(",\n");

  return `export type NewsletterCategory =
  | "Legislation"
  | "Seasonal Care"
  | "Industry"
  | "Session Guide"
  | "Wellness";

export type NewsletterPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: NewsletterCategory;
  excerpt: string;
  metaDescription: string;
  body: string[];
};

export const newsletterPosts: NewsletterPost[] = [
${postsCode}
];

export function getPostBySlug(slug: string): NewsletterPost | undefined {
  return newsletterPosts.find((p) => p.slug === slug);
}

export function formatPostDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
`;
}

export async function refreshNewsletterPosts(): Promise<RawPost[]> {
  logger.info("refreshNewsletterPosts: starting AI post rewrite");
  const client = getAnthropicClient();
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: POSTS_SYSTEM_PROMPT,
    tools: [webSearchTool(6)],
    messages: [
      {
        role: "user",
        content: `Today is ${today}. Please research and rewrite the five standing newsletter posts for the Equine Bodywork and Wellness Consulting website. Use web_search to find current equine wellness information to make the content fresh and current. Return the five posts as the JSON array specified.`,
      },
    ],
  });

  const textBlocks = response.content
    .filter((b): b is TextBlock => b.type === "text")
    .map((b) => b.text);
  const fullText = textBlocks.join("\n\n");
  const parsed = extractJsonArray(fullText);
  if (!parsed) {
    throw new Error("AI did not return a valid JSON array of posts");
  }

  const posts = validatePosts(parsed);
  if (posts.length !== 5) {
    throw new Error(`Expected 5 posts, got ${posts.length}`);
  }

  logger.info({ count: posts.length }, "refreshNewsletterPosts: replacing all posts in DB (transaction)");

  const now = new Date();
  await db.transaction(async (tx) => {
    await tx.delete(generatedPostsTable);
    await tx.insert(generatedPostsTable).values(
      posts.map((post) => ({
        postId: post.id,
        slug: post.slug,
        title: post.title,
        date: post.date,
        category: post.category,
        excerpt: post.excerpt,
        metaDescription: post.metaDescription,
        body: post.body,
        createdAt: now,
        updatedAt: now,
      })),
    );
  });

  try {
    const tsContent = generateNewsletterPostsTS(posts);
    await fs.writeFile(NEWSLETTER_POSTS_PATH, tsContent, "utf8");
    logger.info({ path: NEWSLETTER_POSTS_PATH }, "refreshNewsletterPosts: static file updated");
  } catch (err) {
    logger.warn({ err }, "refreshNewsletterPosts: could not write static file (non-fatal)");
  }

  logger.info({ count: posts.length }, "refreshNewsletterPosts: complete");
  return posts;
}

export type WeeklyNewsletterResult = {
  ok: boolean;
  dispatchId?: number;
  sent?: number;
  failed?: number;
  postsRefreshed?: boolean;
  error?: string;
};

export async function runWeeklyNewsletter(): Promise<WeeklyNewsletterResult> {
  logger.info("runWeeklyNewsletter: starting weekly run");

  let dispatchId: number | undefined;
  let sendResult: { sent: number; failed: number } | undefined;

  try {
    logger.info("runWeeklyNewsletter: drafting newsletter");
    const draft = await draftNewsletter();

    const inserted = await db
      .insert(dispatchesTable)
      .values({
        subject: draft.subject,
        body: draft.body,
        preheader: draft.preheader || null,
        status: "draft",
        scheduledFor: null,
      })
      .returning({ id: dispatchesTable.id });

    dispatchId = inserted[0]?.id;
    if (!dispatchId) throw new Error("Failed to insert dispatch row");

    logger.info({ dispatchId }, "runWeeklyNewsletter: dispatch saved, sending now");
    const result = await sendDispatch(dispatchId);
    sendResult = { sent: result.sent, failed: result.failed };

    if (!result.ok) {
      logger.error(
        { dispatchId, ...result },
        "runWeeklyNewsletter: dispatch send failed — skipping post refresh to preserve prior content",
      );
      return {
        ok: false,
        dispatchId,
        sent: result.sent,
        failed: result.failed,
        postsRefreshed: false,
        error: result.error ?? "Dispatch send failed",
      };
    }

    logger.info({ dispatchId, ...result }, "runWeeklyNewsletter: dispatch sent");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error({ err, dispatchId }, "runWeeklyNewsletter: dispatch phase failed");
    return { ok: false, dispatchId, error: `Dispatch failed: ${message}` };
  }

  let postsRefreshed = false;
  let postsError: string | undefined;
  try {
    await refreshNewsletterPosts();
    postsRefreshed = true;
  } catch (err) {
    postsError = err instanceof Error ? err.message : "Post refresh failed";
    logger.error({ err }, "runWeeklyNewsletter: post refresh failed after successful send");
  }

  const ok = postsRefreshed;
  logger.info(
    { dispatchId, ...sendResult, postsRefreshed, ok },
    "runWeeklyNewsletter: weekly run complete",
  );

  return {
    ok,
    dispatchId,
    sent: sendResult?.sent,
    failed: sendResult?.failed,
    postsRefreshed,
    ...(postsError ? { error: `Dispatch sent, but post refresh failed: ${postsError}` } : {}),
  };
}
