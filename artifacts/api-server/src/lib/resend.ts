// Replit Resend integration. Do not cache the client — credentials may rotate.
import { Resend } from "resend";

type ResendConnectionSettings = {
  api_key?: string;
  from_email?: string;
};

type ResendConnection = {
  settings: ResendConnectionSettings;
};

async function fetchConnection(): Promise<ResendConnection> {
  const hostname = process.env["REPLIT_CONNECTORS_HOSTNAME"];
  const xReplitToken = process.env["REPL_IDENTITY"]
    ? "repl " + process.env["REPL_IDENTITY"]
    : process.env["WEB_REPL_RENEWAL"]
      ? "depl " + process.env["WEB_REPL_RENEWAL"]
      : null;

  if (!hostname || !xReplitToken) {
    throw new Error("Replit connector hostname or token not available");
  }

  const res = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=resend`,
    {
      headers: {
        Accept: "application/json",
        "X-Replit-Token": xReplitToken,
      },
    },
  );
  const data = (await res.json()) as { items?: ResendConnection[] };
  const conn = data.items?.[0];
  if (!conn || !conn.settings.api_key) {
    throw new Error("Resend not connected");
  }
  return conn;
}

export type ResendClientHandle = {
  client: Resend;
  fromEmail: string;
};

export async function getUncachableResendClient(): Promise<ResendClientHandle> {
  const conn = await fetchConnection();
  const apiKey = conn.settings.api_key!;
  const fromEmail =
    process.env["NEWSLETTER_FROM_EMAIL"] ??
    conn.settings.from_email ??
    "onboarding@resend.dev";
  return { client: new Resend(apiKey), fromEmail };
}
