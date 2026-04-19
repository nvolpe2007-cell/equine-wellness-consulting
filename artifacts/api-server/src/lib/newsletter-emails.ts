function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function getSiteBaseUrl(): string {
  const explicit = process.env["PUBLIC_SITE_URL"];
  if (explicit) return explicit.replace(/\/$/, "");
  const dev = process.env["REPLIT_DEV_DOMAIN"];
  if (dev) return `https://${dev}`;
  return "http://localhost";
}

export function unsubscribeUrl(token: string): string {
  return `${getSiteBaseUrl()}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
}

const BRAND_COLOR = "#5b3a29";
const ACCENT = "#8a6a4f";

function shellHtml(opts: {
  title: string;
  bodyHtml: string;
  unsubscribeHref: string;
  preheader?: string;
}): string {
  const preheader = opts.preheader ? escapeHtml(opts.preheader) : "";
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(opts.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f1ea;font-family:Georgia,'Times New Roman',serif;color:#2b2522;">
    ${preheader ? `<div style="display:none;font-size:1px;color:#f6f1ea;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1ea;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
            <tr>
              <td style="padding:28px 32px;background:${BRAND_COLOR};color:#fff;">
                <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;opacity:0.85;">The Worthy Horse News</div>
                <div style="font-size:22px;margin-top:6px;font-style:italic;">A monthly dispatch for thoughtful horse owners</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;font-size:16px;line-height:1.65;color:#2b2522;">
                ${opts.bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 28px;border-top:1px solid #ece4d9;font-size:12px;color:#6e6359;text-align:center;line-height:1.6;">
                You're receiving this because you subscribed to The Worthy Horse News.<br />
                <a href="${opts.unsubscribeHref}" style="color:${ACCENT};text-decoration:underline;">Unsubscribe</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildWelcomeEmail(name: string, token: string): {
  subject: string;
  html: string;
  text: string;
} {
  const safeName = escapeHtml(name.split(/\s+/)[0] ?? name);
  const unsub = unsubscribeUrl(token);
  const bodyHtml = `
    <p>Hi ${safeName},</p>
    <p>Welcome to <em>The Worthy Horse News</em>. Once a month, you'll receive a thoughtful dispatch with industry notes, state-by-state legislative updates, petitions worth following, and seasonal care reminders — written for owners who want to be informed partners in their horse's wellness.</p>
    <p>No fluff, no spam. Just one quiet email a month.</p>
    <p>Warmly,<br/>Susie H. Lytal, MS<br/><span style="color:#6e6359;font-size:13px;">Equine Biomechanist</span></p>
  `;
  const text = `Hi ${name.split(/\s+/)[0] ?? name},\n\nWelcome to The Worthy Horse News. Once a month you'll receive a thoughtful dispatch with industry notes, state-by-state legislative updates, petitions worth following, and seasonal care reminders.\n\nNo fluff, no spam. Just one quiet email a month.\n\nWarmly,\nSusie H. Lytal, MS — Equine Biomechanist\n\nUnsubscribe: ${unsub}\n`;
  return {
    subject: "Welcome to The Worthy Horse News",
    html: shellHtml({
      title: "Welcome to The Worthy Horse News",
      bodyHtml,
      unsubscribeHref: unsub,
      preheader: "Thanks for subscribing — here's what to expect.",
    }),
    text,
  };
}

export function buildDispatchEmail(opts: {
  subject: string;
  bodyMarkdown: string;
  recipientName: string;
  token: string;
  preheader?: string;
}): { subject: string; html: string; text: string } {
  const unsub = unsubscribeUrl(opts.token);
  const safeName = escapeHtml(opts.recipientName.split(/\s+/)[0] ?? opts.recipientName);
  const paragraphs = opts.bodyMarkdown
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const renderedParas = paragraphs
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
    .join("\n");
  const bodyHtml = `
    <p>Hi ${safeName},</p>
    ${renderedParas}
    <p style="margin-top:28px;color:#6e6359;font-size:13px;">— Susie</p>
  `;
  const text = `Hi ${opts.recipientName.split(/\s+/)[0] ?? opts.recipientName},\n\n${opts.bodyMarkdown}\n\n— Susie\n\nUnsubscribe: ${unsub}\n`;
  return {
    subject: opts.subject,
    html: shellHtml({
      title: opts.subject,
      bodyHtml,
      unsubscribeHref: unsub,
      preheader: opts.preheader ?? opts.subject,
    }),
    text,
  };
}

export function buildUnsubscribeConfirmationPage(success: boolean): string {
  const title = success ? "Unsubscribed" : "Already unsubscribed";
  const message = success
    ? "You've been removed from The Worthy Horse News. We're sorry to see you go."
    : "This email is not currently subscribed (or the link has already been used).";
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(title)} — The Worthy Horse News</title>
    <style>
      body{margin:0;font-family:Georgia,'Times New Roman',serif;background:#f6f1ea;color:#2b2522;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px;}
      .card{background:#fff;max-width:520px;padding:40px;border-radius:14px;box-shadow:0 2px 8px rgba(0,0,0,0.05);text-align:center;}
      h1{font-size:24px;margin:0 0 12px;color:${BRAND_COLOR};}
      p{font-size:16px;line-height:1.6;color:#3d342f;margin:0 0 20px;}
      a{color:${ACCENT};}
      .meta{font-size:12px;color:#6e6359;letter-spacing:.18em;text-transform:uppercase;margin-bottom:18px;}
    </style>
  </head>
  <body>
    <main class="card">
      <div class="meta">The Worthy Horse News</div>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
      <p style="font-size:14px;color:#6e6359;">Changed your mind? You can resubscribe anytime from the website.</p>
    </main>
  </body>
</html>`;
}
