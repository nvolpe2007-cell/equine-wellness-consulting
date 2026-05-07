import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  RefreshCw,
  LogOut,
  Lock,
  Star,
  AlertCircle,
  Users,
  TrendingUp,
  Mail,
  Send,
  X,
  CheckCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "survey_admin_token";

type SurveyResponse = {
  id: number;
  name: string | null;
  email: string | null;
  yearsInvolved: string | null;
  qualityRating: number | null;
  valuedAspects: string | null;
  challenges: string | null;
  futureConcernLevel: number | null;
  preservationIdeas: string | null;
  memberOfOrg: string | null;
  comments: string | null;
  submittedAt: string;
  lastFollowupAt: string | null;
};

type SurveyStats = {
  total: number;
  avgQuality: number | null;
  avgConcern: number | null;
  challenges: { label: string; count: number }[];
  weeklySubmissions: { week: string; count: number }[];
};

function StarDisplay({ value, max = 5 }: { value: number | null; max?: number }) {
  if (!value) return <span className="text-muted-foreground/50 text-xs">—</span>;
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < value
              ? "fill-[hsl(var(--gold))] text-[hsl(var(--gold))]"
              : "text-muted-foreground/20"
          )}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{value}/{max}</span>
    </span>
  );
}

function truncate(str: string | null, n = 80): string {
  if (!str) return "—";
  return str.length > n ? str.slice(0, n) + "…" : str;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatWeek(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function escCsv(val: string | null | undefined): string {
  if (val == null) return "";
  const s = String(val).replace(/"/g, '""');
  return /[",\n\r]/.test(s) ? `"${s}"` : s;
}

function buildCsv(rows: SurveyResponse[]): string {
  const headers = [
    "ID",
    "Submitted At",
    "Name",
    "Email",
    "Years Involved",
    "Quality Rating (1-5)",
    "Valued Aspects",
    "Challenges",
    "Future Concern Level (1-5)",
    "Preservation Ideas",
    "Member of Org",
    "Comments",
  ];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.id,
        escCsv(r.submittedAt),
        escCsv(r.name),
        escCsv(r.email),
        escCsv(r.yearsInvolved),
        r.qualityRating ?? "",
        escCsv(r.valuedAspects),
        escCsv(r.challenges),
        r.futureConcernLevel ?? "",
        escCsv(r.preservationIdeas),
        escCsv(r.memberOfOrg),
        escCsv(r.comments),
      ].join(",")
    ),
  ];
  return lines.join("\n");
}

function downloadCsv(rows: SurveyResponse[]) {
  const csv = buildCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pv-survey-responses-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function LoginGate({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/survey/admin/responses", {
        headers: { Authorization: `Bearer ${password.trim()}` },
      });
      if (res.ok) {
        sessionStorage.setItem(STORAGE_KEY, password.trim());
        onLogin(password.trim());
      } else if (res.status === 401) {
        setError("Incorrect password. Please try again.");
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Unable to connect. Try again.");
      }
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-full bg-card border border-border flex items-center justify-center mb-4">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-serif text-2xl text-foreground">Survey Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">PV Horse Keeping Survey responses</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Admin password</label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin token"
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2.5">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="bg-gold-metallic shadow-gold-glow w-full h-10 rounded-full text-sm font-medium transition-all hover:shadow-gold-glow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Checking…" : "Sign in"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

type LoadState = "idle" | "loading" | "error";
type SendState = "idle" | "sending" | "success" | "error";

const GOLD = "hsl(46 92% 62%)";
const GOLD_DEEP = "hsl(38 80% 44%)";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-card border border-border rounded-xl px-5 py-4 flex items-start gap-4">
      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-4.5 w-4.5 text-primary" style={{ height: 18, width: 18 }} />
      </div>
      <div>
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-2xl font-serif text-foreground leading-none">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function StatsSection({ stats, emailCount }: { stats: SurveyStats; emailCount: number }) {
  const shortLabel = (label: string) => {
    const map: Record<string, string> = {
      "High cost of boarding or land": "High Cost",
      "Limited trail access": "Trail Access",
      "Zoning or land-use restrictions": "Zoning",
      "Development pressure on equestrian properties": "Dev. Pressure",
      "Lack of veterinary or farrier services": "Vet/Farrier",
      "Water and resource costs": "Water Costs",
      "Community or neighbor opposition": "Neighbor Opposition",
      "Aging or inadequate facilities": "Aging Facilities",
      "Other": "Other",
    };
    return map[label] ?? label;
  };

  const challengeData = stats.challenges.map((c) => ({
    label: shortLabel(c.label),
    fullLabel: c.label,
    count: c.count,
  }));

  const weeklyData = stats.weeklySubmissions.map((w) => ({
    week: formatWeek(w.week),
    count: w.count,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 space-y-6"
    >
      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Total Responses"
          value={stats.total}
          icon={Users}
        />
        <StatCard
          label="With Email"
          value={emailCount}
          sub={emailCount === 1 ? "can receive follow-up" : "can receive follow-up"}
          icon={Mail}
        />
        <StatCard
          label="Avg. Quality Rating"
          value={stats.avgQuality != null ? `${stats.avgQuality} / 5` : "—"}
          sub="1 = Poor · 5 = Excellent"
          icon={Star}
        />
        <StatCard
          label="Avg. Concern Level"
          value={stats.avgConcern != null ? `${stats.avgConcern} / 5` : "—"}
          sub="1 = Not concerned · 5 = Very"
          icon={AlertCircle}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Challenge frequency */}
        {challengeData.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Top Challenges (selections)
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={challengeData}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={110}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted-foreground)/0.06)" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number, _name: string, props: { payload?: { fullLabel?: string } }) => [
                    `${value} respondent${value !== 1 ? "s" : ""}`,
                    props.payload?.fullLabel ?? "Challenge",
                  ]}
                  labelFormatter={() => ""}
                />
                <Bar
                  dataKey="count"
                  fill={GOLD}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Weekly submissions */}
        {weeklyData.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Weekly Submissions
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={weeklyData}
                margin={{ top: 0, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted-foreground)/0.06)" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number) => [
                    `${value} response${value !== 1 ? "s" : ""}`,
                    "Week of",
                  ]}
                />
                <Bar
                  dataKey="count"
                  fill={GOLD_DEEP}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="border-b border-border" />
    </motion.div>
  );
}

type FollowUpResult = {
  mode: "test" | "broadcast";
  sent: number;
  failed: number;
  total: number;
};

function FollowUpModal({
  token,
  emailCount,
  onClose,
}: {
  token: string;
  emailCount: number;
  onClose: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [sendState, setSendState] = useState<SendState>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<FollowUpResult | null>(null);

  async function send(isTest: boolean) {
    if (!subject.trim() || !body.trim()) return;
    if (isTest && !testEmail.trim()) return;
    setSendState("sending");
    setError("");
    setResult(null);
    try {
      const payload: Record<string, string> = { subject, body };
      if (isTest) payload["testEmail"] = testEmail.trim();
      const res = await fetch("/api/survey/admin/followup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; error?: string } & Partial<FollowUpResult>;
      if (!data.ok) {
        setError(data.error ?? "Send failed.");
        setSendState("error");
        return;
      }
      setResult({
        mode: data.mode ?? (isTest ? "test" : "broadcast"),
        sent: data.sent ?? 0,
        failed: data.failed ?? 0,
        total: data.total ?? (isTest ? 1 : emailCount),
      });
      setSendState("success");
    } catch {
      setError("Network error. Please try again.");
      setSendState("error");
    }
  }

  const isBusy = sendState === "sending";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25 }}
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-serif text-lg text-foreground">Send Follow-up Email</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {emailCount} respondent{emailCount !== 1 ? "s" : ""} with email addresses
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Success state */}
        {sendState === "success" && result && (
          <div className="px-6 py-8 flex flex-col items-center gap-4 text-center">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-primary" />
            </div>
            {result.mode === "test" ? (
              <>
                <p className="font-medium text-foreground">Test email sent</p>
                <p className="text-sm text-muted-foreground">
                  A preview was delivered to <strong>{testEmail}</strong>. Review it, then send the real follow-up when ready.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-foreground">Follow-up sent</p>
                <p className="text-sm text-muted-foreground">
                  {result.sent} of {result.total} email{result.total !== 1 ? "s" : ""} delivered successfully
                  {result.failed > 0 ? ` (${result.failed} failed)` : "."}
                </p>
              </>
            )}
            <div className="flex gap-3 mt-2">
              {result.mode === "test" && (
                <button
                  onClick={() => { setSendState("idle"); setResult(null); }}
                  className="px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back to compose
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-gold-metallic shadow-gold-glow text-sm font-medium hover:shadow-gold-glow-lg transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Compose form */}
        {sendState !== "success" && (
          <div className="px-6 py-5 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Thank you for your survey response"
                disabled={isBusy}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Message</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Thank you so much for taking the time to fill out our PV Horse Keeping survey. Your input means a great deal to us…"
                rows={7}
                disabled={isBusy}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors resize-y disabled:opacity-60"
              />
              <p className="text-[11px] text-muted-foreground">Separate paragraphs with a blank line. Recipients will be greeted by name when available.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Test email <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isBusy}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors disabled:opacity-60"
              />
            </div>

            {(sendState === "error") && error && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2.5">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 pt-1 border-t border-border">
              <button
                type="button"
                onClick={() => send(true)}
                disabled={isBusy || !subject.trim() || !body.trim() || !testEmail.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="h-4 w-4" />
                Send test
              </button>
              <button
                type="button"
                onClick={() => send(false)}
                disabled={isBusy || !subject.trim() || !body.trim() || emailCount === 0}
                className="ml-auto inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold-metallic shadow-gold-glow text-sm font-medium hover:shadow-gold-glow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                {isBusy
                  ? "Sending…"
                  : `Send to ${emailCount} respondent${emailCount !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function SurveyAdmin() {
  const [token, setToken] = useState<string>(
    () => sessionStorage.getItem(STORAGE_KEY) ?? ""
  );
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const emailCount = responses.filter((r) => r.email).length;

  const fetchData = useCallback(
    async (tkn: string) => {
      setLoadState("loading");
      setErrorMsg("");
      try {
        const [responsesRes, statsRes] = await Promise.all([
          fetch("/api/survey/admin/responses", {
            headers: { Authorization: `Bearer ${tkn}` },
          }),
          fetch("/api/survey/admin/stats", {
            headers: { Authorization: `Bearer ${tkn}` },
          }),
        ]);

        if (responsesRes.status === 401) {
          sessionStorage.removeItem(STORAGE_KEY);
          setToken("");
          setLoadState("idle");
          return;
        }

        const [responsesData, statsData] = await Promise.all([
          responsesRes.json(),
          statsRes.json(),
        ]);

        if (responsesData.ok) {
          setResponses(responsesData.responses);
        } else {
          setErrorMsg(responsesData.error ?? "Failed to load responses.");
          setLoadState("error");
          return;
        }

        if (statsData.ok) {
          setStats(statsData as SurveyStats & { ok: true });
        }

        setLoadState("idle");
      } catch {
        setErrorMsg("Network error. Check your connection and try again.");
        setLoadState("error");
      }
    },
    []
  );

  useEffect(() => {
    if (token) {
      void fetchData(token);
    }
  }, [token, fetchData]);

  function handleLogin(tkn: string) {
    setToken(tkn);
  }

  function handleLogout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken("");
    setResponses([]);
    setStats(null);
  }

  if (!token) {
    return <LoginGate onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl text-foreground">PV Survey Responses</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {loadState === "loading"
                ? "Loading…"
                : `${responses.length} response${responses.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => fetchData(token)}
              disabled={loadState === "loading"}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn("h-4 w-4", loadState === "loading" && "animate-spin")} />
              Refresh
            </button>
            {emailCount > 0 && loadState === "idle" && (
              <button
                onClick={() => setShowFollowUp(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 text-sm text-primary hover:bg-primary/5 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Follow-up ({emailCount})
              </button>
            )}
            {responses.length > 0 && (
              <button
                onClick={() => downloadCsv(responses)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-metallic shadow-gold-glow text-sm font-medium hover:shadow-gold-glow-lg transition-all"
              >
                <Download className="h-4 w-4" />
                Download CSV
              </button>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:border-destructive/40 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Error state */}
        {loadState === "error" && (
          <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-xl px-5 py-4 text-sm text-destructive mb-6">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Loading state */}
        {loadState === "loading" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-card border border-border animate-pulse" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-card border border-border animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {loadState === "idle" && responses.length === 0 && !errorMsg && (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-lg font-serif">No responses yet</p>
            <p className="text-sm mt-2">Survey responses will appear here once submitted.</p>
          </div>
        )}

        {/* Stats + Response list */}
        {loadState === "idle" && responses.length > 0 && (
          <>
            {stats && <StatsSection stats={stats} emailCount={emailCount} />}

            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Individual Responses
              </h2>
            </div>

            <div className="space-y-3">
              {responses.map((r, idx) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  {/* Summary row */}
                  <button
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    className="w-full text-left px-5 py-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-[1fr_auto_auto_auto_auto] gap-x-6 gap-y-2 items-center">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {r.name ?? <span className="text-muted-foreground italic">Anonymous</span>}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {r.email ? (
                            <span className="inline-flex items-center gap-1">
                              <Mail className="h-3 w-3 text-primary/60" />
                              {r.email}
                            </span>
                          ) : (
                            "No email"
                          )}
                        </p>
                        {r.lastFollowupAt && (
                          <p className="text-xs text-primary/70 truncate mt-0.5 inline-flex items-center gap-1">
                            <Clock className="h-3 w-3 shrink-0" />
                            Last contacted {formatDate(r.lastFollowupAt)}
                          </p>
                        )}
                        {r.preservationIdeas && (
                          <p className="text-xs text-muted-foreground/70 truncate mt-1 italic">
                            {truncate(r.preservationIdeas, 90)}
                          </p>
                        )}
                      </div>
                      <div className="hidden md:block text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(r.submittedAt)}
                      </div>
                      <div className="hidden md:flex flex-col gap-0.5 items-start">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Quality</span>
                        <StarDisplay value={r.qualityRating} />
                      </div>
                      <div className="hidden md:flex flex-col gap-0.5 items-start">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Concern</span>
                        <StarDisplay value={r.futureConcernLevel} />
                      </div>
                      <div className="text-xs text-primary font-medium">
                        {expanded === r.id ? "Hide ↑" : "View ↓"}
                      </div>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {expanded === r.id && (
                    <div className="border-t border-border px-5 py-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                      <DetailField label="Submission date" value={formatDate(r.submittedAt)} />
                      <DetailField label="Name" value={r.name} />
                      <DetailField label="Email" value={r.email} />
                      <DetailField label="Years involved in PV" value={r.yearsInvolved} />
                      <DetailField label="Member of equine org" value={r.memberOfOrg} />
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Quality rating</span>
                        <StarDisplay value={r.qualityRating} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Future concern level</span>
                        <StarDisplay value={r.futureConcernLevel} />
                      </div>
                      <DetailField label="What they value most" value={r.valuedAspects} full />
                      <DetailField label="Challenges" value={r.challenges} full />
                      <DetailField label="Preservation ideas" value={r.preservationIdeas} full />
                      <DetailField label="Additional comments" value={r.comments} full />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Follow-up modal */}
      <AnimatePresence>
        {showFollowUp && (
          <FollowUpModal
            token={token}
            emailCount={emailCount}
            onClose={() => setShowFollowUp(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailField({
  label,
  value,
  full,
}: {
  label: string;
  value: string | null | undefined;
  full?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-1", full && "md:col-span-2")}>
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      {value ? (
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{value}</p>
      ) : (
        <p className="text-sm text-muted-foreground/50 italic">Not provided</p>
      )}
    </div>
  );
}
