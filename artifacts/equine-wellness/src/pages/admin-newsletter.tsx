import { useEffect, useState } from "react";
import { Loader2, Send, Lock, Mail, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const TOKEN_KEY = "twh_admin_token";

type Stats = { total: number; active: number; unsubscribed: number };

type SendResult = {
  ok: boolean;
  mode?: "test" | "broadcast";
  sent?: number;
  failed?: number;
  total?: number;
  error?: string;
};

function authHeaders(token: string): HeadersInit {
  return {
    "content-type": "application/json",
    authorization: `Bearer ${token}`,
  };
}

async function fetchStats(token: string): Promise<Stats | null> {
  const res = await fetch("/api/newsletter/admin/stats", {
    headers: authHeaders(token),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { ok: boolean } & Stats;
  if (!data.ok) return null;
  return { total: data.total, active: data.active, unsubscribed: data.unsubscribed };
}

export default function AdminNewsletter() {
  const [token, setToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem(TOKEN_KEY) ?? "";
  });
  const [tokenInput, setTokenInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [body, setBody] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [busy, setBusy] = useState<"idle" | "test" | "broadcast">("idle");
  const [result, setResult] = useState<SendResult | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [draftSources, setDraftSources] = useState<{ title: string; url: string }[]>([]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setStatsLoading(true);
      const s = await fetchStats(token);
      if (cancelled) return;
      if (s) {
        setStats(s);
        setAuthError(null);
      } else {
        setStats(null);
        setAuthError("That password didn't work. Try again.");
        setToken("");
        sessionStorage.removeItem(TOKEN_KEY);
      }
      setStatsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function refreshStats() {
    if (!token) return;
    setStatsLoading(true);
    const s = await fetchStats(token);
    if (s) setStats(s);
    setStatsLoading(false);
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    if (!tokenInput.trim()) return;
    sessionStorage.setItem(TOKEN_KEY, tokenInput.trim());
    setToken(tokenInput.trim());
    setTokenInput("");
  }

  async function generateDraft() {
    if (!token) return;
    setDrafting(true);
    setDraftError(null);
    setResult(null);
    try {
      const res = await fetch("/api/newsletter/admin/draft", {
        method: "POST",
        headers: authHeaders(token),
      });
      const data = (await res.json().catch(() => null)) as
        | {
            ok: boolean;
            error?: string;
            draft?: {
              subject: string;
              preheader: string;
              body: string;
              sources: { title: string; url: string }[];
            };
          }
        | null;
      if (!res.ok || !data?.ok || !data.draft) {
        setDraftError(data?.error ?? "Couldn't generate a draft. Try again in a minute.");
        return;
      }
      setSubject(data.draft.subject);
      setPreheader(data.draft.preheader);
      setBody(data.draft.body);
      setDraftSources(data.draft.sources ?? []);
    } catch {
      setDraftError("Network error while generating the draft.");
    } finally {
      setDrafting(false);
    }
  }

  async function send(mode: "test" | "broadcast") {
    if (!token) return;
    if (!subject.trim() || !body.trim()) {
      setResult({ ok: false, error: "Subject and body are required." });
      return;
    }
    if (mode === "test" && !testEmail.trim()) {
      setResult({ ok: false, error: "Enter a test email address first." });
      return;
    }
    setResult(null);
    setBusy(mode);
    try {
      const res = await fetch("/api/newsletter/admin/dispatch", {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({
          subject: subject.trim(),
          body,
          preheader: preheader.trim() || undefined,
          testEmail: mode === "test" ? testEmail.trim() : undefined,
        }),
      });
      const data = (await res.json().catch(() => null)) as SendResult | null;
      if (!res.ok || !data?.ok) {
        setResult({ ok: false, error: data?.error ?? "Send failed." });
      } else {
        setResult(data);
        if (mode === "broadcast") {
          await refreshStats();
        }
      }
    } catch {
      setResult({ ok: false, error: "Network error." });
    } finally {
      setBusy("idle");
      setConfirmOpen(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-background">
        <form
          onSubmit={handleAuth}
          className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm space-y-5"
          data-testid="admin-auth-form"
        >
          <div className="flex items-center gap-3 text-foreground">
            <Lock className="h-5 w-5 text-primary" />
            <h1 className="font-serif text-2xl">Newsletter admin</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Enter the admin password to compose and send The Worthy Horse News.
          </p>
          <input
            type="password"
            autoFocus
            placeholder="Admin password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="w-full h-11 px-4 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            data-testid="input-admin-token"
          />
          {authError && (
            <p className="text-sm text-destructive" data-testid="admin-auth-error">
              {authError}
            </p>
          )}
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90"
            data-testid="button-admin-signin"
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  const broadcastDisabled =
    busy !== "idle" || !subject.trim() || !body.trim() || (stats?.active ?? 0) === 0;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2 font-medium">
              Newsletter admin
            </p>
            <h1 className="font-serif text-3xl text-foreground">
              Compose The Worthy Horse News
            </h1>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem(TOKEN_KEY);
              setToken("");
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
            data-testid="button-signout"
          >
            Sign out
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Total" value={stats?.total ?? "—"} loading={statsLoading} />
          <StatCard
            label="Active"
            value={stats?.active ?? "—"}
            loading={statsLoading}
            highlight
          />
          <StatCard
            label="Unsubscribed"
            value={stats?.unsubscribed ?? "—"}
            loading={statsLoading}
          />
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 -mt-1 mb-1">
            <div>
              <h2 className="font-serif text-lg text-foreground">Compose this month's dispatch</h2>
              <p className="text-sm text-muted-foreground">
                Let the assistant pull together recent industry news, or write it yourself.
              </p>
            </div>
            <button
              onClick={generateDraft}
              disabled={drafting || busy !== "idle"}
              className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium",
                "bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              )}
              data-testid="button-ai-draft"
            >
              {drafting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {drafting ? "Researching news…" : "Draft with AI"}
            </button>
          </div>

          {draftError && (
            <div
              className="rounded-lg p-3 text-sm bg-destructive/10 text-destructive"
              role="alert"
              data-testid="draft-error"
            >
              {draftError}
            </div>
          )}

          {draftSources.length > 0 && (
            <div
              className="rounded-lg p-3 text-xs bg-muted/50 text-muted-foreground"
              data-testid="draft-sources"
            >
              <div className="font-medium mb-1 text-foreground">Sources used by the assistant:</div>
              <ul className="space-y-1">
                {draftSources.map((s, i) => (
                  <li key={i}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-2 italic">
                Please skim the draft and verify anything before sending.
              </p>
            </div>
          )}

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1.5">
              Subject
            </label>
            <input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={180}
              placeholder="May dispatch — what's worth watching this month"
              className="w-full h-11 px-4 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              data-testid="input-subject"
            />
          </div>
          <div>
            <label htmlFor="preheader" className="block text-sm font-medium mb-1.5">
              Preheader <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              id="preheader"
              value={preheader}
              onChange={(e) => setPreheader(e.target.value)}
              maxLength={180}
              placeholder="The little gray text that shows in inbox previews"
              className="w-full h-11 px-4 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              data-testid="input-preheader"
            />
          </div>
          <div>
            <label htmlFor="body" className="block text-sm font-medium mb-1.5">
              Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={14}
              placeholder={
                "Write the dispatch as plain text. Separate paragraphs with a blank line.\n\nLine breaks within a paragraph become <br/>."
              }
              className="w-full px-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm leading-relaxed"
              data-testid="input-body"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Each subscriber's email will include their own unsubscribe link.
            </p>
          </div>

          <div className="border-t border-border pt-5 space-y-4">
            <div>
              <label htmlFor="test" className="block text-sm font-medium mb-1.5">
                Send a test
              </label>
              <div className="flex gap-2">
                <input
                  id="test"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 h-11 px-4 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="input-test-email"
                />
                <button
                  onClick={() => send("test")}
                  disabled={busy !== "idle" || !subject.trim() || !body.trim()}
                  className={cn(
                    "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium",
                    "hover:bg-muted disabled:opacity-60 disabled:cursor-not-allowed",
                  )}
                  data-testid="button-send-test"
                >
                  {busy === "test" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  Test send
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={() => setConfirmOpen(true)}
                disabled={broadcastDisabled}
                className={cn(
                  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-medium",
                  "hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed",
                )}
                data-testid="button-send-broadcast"
              >
                <Send className="h-4 w-4" />
                Send to {stats?.active ?? 0} subscriber{(stats?.active ?? 0) === 1 ? "" : "s"}
              </button>
            </div>

            {result && (
              <div
                className={cn(
                  "rounded-lg p-4 text-sm",
                  result.ok
                    ? "bg-primary/10 text-foreground"
                    : "bg-destructive/10 text-destructive",
                )}
                role="status"
                data-testid="send-result"
              >
                {result.ok ? (
                  result.mode === "test" ? (
                    <span>Test email sent.</span>
                  ) : (
                    <span>
                      Sent to {result.sent ?? 0} of {result.total ?? 0} subscribers
                      {result.failed ? ` (${result.failed} failed)` : ""}.
                    </span>
                  )
                ) : (
                  <span>{result.error ?? "Send failed."}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button
            onClick={refreshStats}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            data-testid="button-refresh-stats"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh stats
          </button>
        </div>
      </div>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-card rounded-2xl shadow-xl p-6 max-w-md w-full">
            <h2 className="font-serif text-xl mb-2">Send the dispatch?</h2>
            <p className="text-sm text-muted-foreground mb-5">
              This will email <strong>{stats?.active ?? 0}</strong> active subscriber
              {(stats?.active ?? 0) === 1 ? "" : "s"}. There's no undo.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="h-10 px-4 rounded-full border border-border text-sm hover:bg-muted"
                data-testid="button-cancel-broadcast"
              >
                Cancel
              </button>
              <button
                onClick={() => send("broadcast")}
                disabled={busy !== "idle"}
                className="h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 inline-flex items-center gap-2"
                data-testid="button-confirm-broadcast"
              >
                {busy === "broadcast" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  loading,
  highlight,
}: {
  label: string;
  value: number | string;
  loading?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        highlight ? "border-primary/30 bg-primary/5" : "border-border bg-card",
      )}
      data-testid={`stat-${label.toLowerCase()}`}
    >
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-2xl font-serif text-foreground">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : value}
      </div>
    </div>
  );
}
