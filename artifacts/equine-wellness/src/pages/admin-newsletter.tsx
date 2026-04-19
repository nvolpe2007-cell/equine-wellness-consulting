import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Send,
  Lock,
  Mail,
  RefreshCw,
  Sparkles,
  Calendar,
  Save,
  Trash2,
  Plus,
} from "lucide-react";
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

type DispatchStatus = "draft" | "scheduled" | "sending" | "sent" | "failed";

type Dispatch = {
  id: number;
  subject: string;
  preheader: string | null;
  body: string;
  status: DispatchStatus;
  scheduledFor: string | null;
  sentAt: string | null;
  sentCount: number;
  failedCount: number;
  totalCount: number;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
};

type SaveMode = "draft" | "scheduled";

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

async function fetchDispatches(token: string): Promise<Dispatch[]> {
  const res = await fetch("/api/newsletter/admin/dispatches", {
    headers: authHeaders(token),
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { ok: boolean; dispatches: Dispatch[] };
  return data.ok ? data.dispatches : [];
}

// HTML datetime-local needs "YYYY-MM-DDTHH:mm" in the user's local time.
function toLocalDateTimeInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalDateTimeInput(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function formatWhen(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
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

  const [editingId, setEditingId] = useState<number | null>(null);
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [body, setBody] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [busy, setBusy] = useState<"idle" | "test" | "broadcast" | "save" | "delete">("idle");
  const [savingMode, setSavingMode] = useState<SaveMode | null>(null);
  const [result, setResult] = useState<SendResult | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [draftSources, setDraftSources] = useState<{ title: string; url: string }[]>([]);
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [dispatchesLoading, setDispatchesLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setStatsLoading(true);
      setDispatchesLoading(true);
      const [s, d] = await Promise.all([fetchStats(token), fetchDispatches(token)]);
      if (cancelled) return;
      if (s) {
        setStats(s);
        setDispatches(d);
        setAuthError(null);
      } else {
        setStats(null);
        setAuthError("That password didn't work. Try again.");
        setToken("");
        sessionStorage.removeItem(TOKEN_KEY);
      }
      setStatsLoading(false);
      setDispatchesLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function refreshAll() {
    if (!token) return;
    setStatsLoading(true);
    setDispatchesLoading(true);
    const [s, d] = await Promise.all([fetchStats(token), fetchDispatches(token)]);
    if (s) setStats(s);
    setDispatches(d);
    setStatsLoading(false);
    setDispatchesLoading(false);
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    if (!tokenInput.trim()) return;
    sessionStorage.setItem(TOKEN_KEY, tokenInput.trim());
    setToken(tokenInput.trim());
    setTokenInput("");
  }

  function startNew() {
    setEditingId(null);
    setSubject("");
    setPreheader("");
    setBody("");
    setScheduledFor("");
    setDraftSources([]);
    setDraftError(null);
    setResult(null);
  }

  function loadDispatch(d: Dispatch) {
    setEditingId(d.id);
    setSubject(d.subject);
    setPreheader(d.preheader ?? "");
    setBody(d.body);
    setScheduledFor(toLocalDateTimeInput(d.scheduledFor));
    setDraftSources([]);
    setDraftError(null);
    setResult(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

  async function saveDispatch(mode: SaveMode): Promise<Dispatch | null> {
    if (!token) return null;
    if (!subject.trim() || !body.trim()) {
      setResult({ ok: false, error: "Subject and body are required." });
      return null;
    }
    if (mode === "scheduled" && !scheduledFor) {
      setResult({ ok: false, error: "Pick a date and time to schedule for." });
      return null;
    }
    setBusy("save");
    setSavingMode(mode);
    setResult(null);
    try {
      const payload = {
        subject: subject.trim(),
        body,
        preheader: preheader.trim() || undefined,
        status: mode,
        scheduledFor: mode === "scheduled" ? fromLocalDateTimeInput(scheduledFor) : null,
      };
      const url = editingId
        ? `/api/newsletter/admin/dispatches/${editingId}`
        : "/api/newsletter/admin/dispatches";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: authHeaders(token),
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: boolean; dispatch?: Dispatch; error?: string }
        | null;
      if (!res.ok || !data?.ok || !data.dispatch) {
        setResult({ ok: false, error: data?.error ?? "Save failed." });
        return null;
      }
      setEditingId(data.dispatch.id);
      await refreshAll();
      setResult({ ok: true });
      return data.dispatch;
    } catch {
      setResult({ ok: false, error: "Network error." });
      return null;
    } finally {
      setBusy("idle");
      setSavingMode(null);
    }
  }

  async function deleteDispatch(id: number) {
    if (!token) return;
    if (!confirm("Delete this dispatch? This can't be undone.")) return;
    setBusy("delete");
    try {
      const res = await fetch(`/api/newsletter/admin/dispatches/${id}`, {
        method: "DELETE",
        headers: authHeaders(token),
      });
      const data = (await res.json().catch(() => null)) as { ok: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setResult({ ok: false, error: data?.error ?? "Delete failed." });
      } else if (editingId === id) {
        startNew();
      }
      await refreshAll();
    } finally {
      setBusy("idle");
    }
  }

  async function sendNow() {
    if (!token) return;
    // Save first (creating or updating) so the row exists in history.
    const saved = await saveDispatch("draft");
    if (!saved) return;
    setBusy("broadcast");
    setResult(null);
    try {
      const res = await fetch(`/api/newsletter/admin/dispatches/${saved.id}/send`, {
        method: "POST",
        headers: authHeaders(token),
      });
      const data = (await res.json().catch(() => null)) as SendResult | null;
      if (!res.ok || !data?.ok) {
        setResult({ ok: false, error: data?.error ?? "Send failed." });
      } else {
        setResult({ ...data, mode: "broadcast" });
      }
      await refreshAll();
    } catch {
      setResult({ ok: false, error: "Network error." });
    } finally {
      setBusy("idle");
      setConfirmOpen(false);
    }
  }

  async function sendTest() {
    if (!token) return;
    if (!subject.trim() || !body.trim()) {
      setResult({ ok: false, error: "Subject and body are required." });
      return;
    }
    if (!testEmail.trim()) {
      setResult({ ok: false, error: "Enter a test email address first." });
      return;
    }
    setBusy("test");
    setResult(null);
    try {
      const res = await fetch("/api/newsletter/admin/dispatch", {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({
          subject: subject.trim(),
          body,
          preheader: preheader.trim() || undefined,
          testEmail: testEmail.trim(),
        }),
      });
      const data = (await res.json().catch(() => null)) as SendResult | null;
      if (!res.ok || !data?.ok) {
        setResult({ ok: false, error: data?.error ?? "Test send failed." });
      } else {
        setResult(data);
      }
    } catch {
      setResult({ ok: false, error: "Network error." });
    } finally {
      setBusy("idle");
    }
  }

  const grouped = useMemo(() => {
    const drafts: Dispatch[] = [];
    const scheduled: Dispatch[] = [];
    const past: Dispatch[] = [];
    for (const d of dispatches) {
      if (d.status === "draft") drafts.push(d);
      else if (d.status === "scheduled" || d.status === "sending") scheduled.push(d);
      else past.push(d);
    }
    scheduled.sort((a, b) => {
      const ax = a.scheduledFor ? new Date(a.scheduledFor).getTime() : 0;
      const bx = b.scheduledFor ? new Date(b.scheduledFor).getTime() : 0;
      return ax - bx;
    });
    return { drafts, scheduled, past };
  }, [dispatches]);

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
  const editingLabel = editingId
    ? `Editing dispatch #${editingId}`
    : "New dispatch";

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
              <h2 className="font-serif text-lg text-foreground" data-testid="editor-title">
                {editingLabel}
              </h2>
              <p className="text-sm text-muted-foreground">
                Save as draft, schedule a send date, or send immediately.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {editingId && (
                <button
                  onClick={startNew}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-medium border border-border bg-background hover:bg-muted"
                  data-testid="button-new-dispatch"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New
                </button>
              )}
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

          <div className="border-t border-border pt-5 grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="schedule" className="block text-sm font-medium mb-1.5">
                <Calendar className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                Schedule for
              </label>
              <input
                id="schedule"
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="w-full h-11 px-4 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="input-scheduled-for"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Leave blank to save as a draft. The scheduler runs every minute.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end sm:justify-end">
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => saveDispatch("draft")}
                  disabled={busy !== "idle" || !subject.trim() || !body.trim()}
                  className={cn(
                    "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium flex-1",
                    "hover:bg-muted disabled:opacity-60 disabled:cursor-not-allowed",
                  )}
                  data-testid="button-save-draft"
                >
                  {busy === "save" && savingMode === "draft" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save draft
                </button>
                <button
                  onClick={() => saveDispatch("scheduled")}
                  disabled={
                    busy !== "idle" || !subject.trim() || !body.trim() || !scheduledFor
                  }
                  className={cn(
                    "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary/10 text-primary border border-primary/20 px-5 text-sm font-medium flex-1",
                    "hover:bg-primary/15 disabled:opacity-60 disabled:cursor-not-allowed",
                  )}
                  data-testid="button-save-scheduled"
                >
                  {busy === "save" && savingMode === "scheduled" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Calendar className="h-4 w-4" />
                  )}
                  Schedule
                </button>
              </div>
            </div>
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
                  onClick={sendTest}
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
                Send now to {stats?.active ?? 0} subscriber
                {(stats?.active ?? 0) === 1 ? "" : "s"}
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
                  ) : result.mode === "broadcast" ? (
                    <span>
                      Sent to {result.sent ?? 0} of {result.total ?? 0} subscribers
                      {result.failed ? ` (${result.failed} failed)` : ""}.
                    </span>
                  ) : (
                    <span>Saved.</span>
                  )
                ) : (
                  <span>{result.error ?? "Send failed."}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <DispatchList
          title="Scheduled"
          emptyText="Nothing on the calendar yet."
          dispatches={grouped.scheduled}
          loading={dispatchesLoading}
          editingId={editingId}
          onEdit={loadDispatch}
          onDelete={deleteDispatch}
          showWhen="scheduled"
        />
        <DispatchList
          title="Drafts"
          emptyText="No drafts saved."
          dispatches={grouped.drafts}
          loading={dispatchesLoading}
          editingId={editingId}
          onEdit={loadDispatch}
          onDelete={deleteDispatch}
          showWhen="updated"
        />
        <DispatchList
          title="Past dispatches"
          emptyText="Nothing has been sent yet."
          dispatches={grouped.past}
          loading={dispatchesLoading}
          editingId={editingId}
          onEdit={loadDispatch}
          onDelete={deleteDispatch}
          showWhen="sent"
        />

        <div className="mt-6 flex items-center justify-end">
          <button
            onClick={refreshAll}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            data-testid="button-refresh-stats"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
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
                onClick={sendNow}
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

function StatusPill({ status }: { status: DispatchStatus }) {
  const styles: Record<DispatchStatus, string> = {
    draft: "bg-muted text-muted-foreground",
    scheduled: "bg-primary/10 text-primary",
    sending: "bg-amber-100 text-amber-800",
    sent: "bg-emerald-100 text-emerald-800",
    failed: "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}

function DispatchList({
  title,
  emptyText,
  dispatches,
  loading,
  editingId,
  onEdit,
  onDelete,
  showWhen,
}: {
  title: string;
  emptyText: string;
  dispatches: Dispatch[];
  loading: boolean;
  editingId: number | null;
  onEdit: (d: Dispatch) => void;
  onDelete: (id: number) => void;
  showWhen: "scheduled" | "sent" | "updated";
}) {
  return (
    <section className="mt-8" data-testid={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <h3 className="font-serif text-xl text-foreground mb-3">{title}</h3>
      {loading ? (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : dispatches.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">{emptyText}</p>
      ) : (
        <ul className="space-y-2">
          {dispatches.map((d) => {
            const when =
              showWhen === "scheduled"
                ? formatWhen(d.scheduledFor)
                : showWhen === "sent"
                  ? formatWhen(d.sentAt ?? d.updatedAt)
                  : formatWhen(d.updatedAt);
            const whenLabel =
              showWhen === "scheduled"
                ? "Scheduled for"
                : showWhen === "sent"
                  ? d.status === "sent"
                    ? "Sent"
                    : "Last try"
                  : "Updated";
            return (
              <li
                key={d.id}
                className={cn(
                  "border border-border rounded-xl p-3 bg-card flex items-start gap-3",
                  editingId === d.id && "ring-2 ring-primary/40",
                )}
                data-testid={`dispatch-row-${d.id}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => onEdit(d)}
                      className="text-sm font-medium text-foreground hover:underline truncate text-left"
                      data-testid={`button-edit-dispatch-${d.id}`}
                    >
                      {d.subject || "(no subject)"}
                    </button>
                    <StatusPill status={d.status} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {whenLabel}: {when}
                    {d.status === "sent" && (
                      <>
                        {" · "}
                        Sent to {d.sentCount} of {d.totalCount}
                        {d.failedCount ? ` (${d.failedCount} failed)` : ""}
                      </>
                    )}
                    {d.status === "failed" && d.errorMessage && (
                      <>
                        {" · "}
                        <span className="text-destructive">{d.errorMessage}</span>
                      </>
                    )}
                  </div>
                </div>
                {d.status !== "sending" && d.status !== "sent" && (
                  <button
                    onClick={() => onDelete(d.id)}
                    className="text-muted-foreground hover:text-destructive p-1"
                    aria-label="Delete dispatch"
                    data-testid={`button-delete-dispatch-${d.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
