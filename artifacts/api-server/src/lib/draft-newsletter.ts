import type { TextBlock } from "@anthropic-ai/sdk/resources/messages/messages";
import { getAnthropicClient } from "./anthropic";
import { webSearchTool } from "./anthropic-tools";

export type DraftedNewsletter = {
  subject: string;
  preheader: string;
  body: string;
  sources: { title: string; url: string }[];
};

const SYSTEM_PROMPT = `You are the editor of "The Worthy Horse News", a thoughtful monthly email newsletter for horse owners in the United States. The voice is calm, warm, well-informed, and genuinely useful — like a trusted barn friend who reads the industry press so the reader doesn't have to. No marketing-speak, no breathless hype, no emoji.

Your job is to compile this month's dispatch from current information you find on the web. Cover, in this order, only the sections that have real, current material:

1. **Industry & legislation** — federal or notable state-level developments affecting horse owners (welfare laws, transport, slaughter, racing safety, EHV/disease updates, USDA/APHIS rules).
2. **State-by-state** — 2-4 short notes on specific state developments (regulation, funding, programs).
3. **Petitions worth following** — only if there are credible, active ones; link to them.
4. **Seasonal care reminders** — practical, evidence-aligned reminders appropriate to the current season for owners across the US.

Rules:
- Use the web_search tool. Prefer reputable sources: TheHorse.com, US Equestrian, AAEP, AVMA, USDA APHIS, state ag departments, EquiManagement, Paulick Report, Horse Illustrated, state extension services.
- Only include items you actually found via search. Do not invent legislation, petitions, organizations, or quotes.
- Keep the whole body under ~600 words. Use short paragraphs. Use plain prose with section headings as their own line followed by a blank line. No HTML, no Markdown links, no asterisks, no bullet characters — write inline (e.g. "see thehorse.com/12345").
- Reference specific sources inline by publication name when relevant.
- Do NOT include any signoff line — the email template adds "— Susie" automatically.

Return your final answer ONLY as a single JSON object inside a fenced code block like this:

\`\`\`json
{
  "subject": "...",
  "preheader": "...",
  "body": "...",
  "sources": [{"title": "...", "url": "https://..."}]
}
\`\`\`

The "subject" must be specific to the month and content (e.g. "April: EHV updates, three state bills, and spring turnout"), max 90 characters. The "preheader" is the inbox preview line, max 140 characters. The "body" is the email text described above. "sources" lists 3-8 of the URLs you actually used.`;

function extractJsonBlock(text: string): unknown | null {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text.match(/\{[\s\S]*\}/)?.[0];
  if (!candidate) return null;
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}

export async function draftNewsletter(): Promise<DraftedNewsletter> {
  const client = getAnthropicClient();
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    tools: [webSearchTool(8)],
    messages: [
      {
        role: "user",
        content: `Today is ${today}. Please research and write this month's dispatch of The Worthy Horse News for US horse owners. Use the web_search tool to find recent (within the last ~30 days where possible) news on equine industry, legislation, state-level developments, and active petitions. Then write the dispatch and return it as the JSON object specified.`,
      },
    ],
  });

  // Concatenate all text blocks from the final assistant message.
  const textBlocks = response.content
    .filter((b): b is TextBlock => b.type === "text")
    .map((b) => b.text);
  const fullText = textBlocks.join("\n\n");
  const parsed = extractJsonBlock(fullText);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("AI did not return a valid newsletter JSON");
  }
  const obj = parsed as Record<string, unknown>;
  const subject = typeof obj["subject"] === "string" ? obj["subject"].trim() : "";
  const preheader = typeof obj["preheader"] === "string" ? obj["preheader"].trim() : "";
  const body = typeof obj["body"] === "string" ? obj["body"].trim() : "";
  const sourcesRaw = Array.isArray(obj["sources"]) ? obj["sources"] : [];
  const sources = sourcesRaw
    .map((s) => {
      if (s && typeof s === "object") {
        const o = s as Record<string, unknown>;
        const title = typeof o["title"] === "string" ? o["title"] : "";
        const url = typeof o["url"] === "string" ? o["url"] : "";
        if (url) return { title: title || url, url };
      }
      return null;
    })
    .filter((x): x is { title: string; url: string } => x !== null);

  if (!subject || !body) {
    throw new Error("AI returned an incomplete newsletter (missing subject or body)");
  }

  return { subject, preheader, body, sources };
}
