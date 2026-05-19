import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const YEARS_OPTIONS = [
  "Less than 1 year",
  "1–5 years",
  "6–15 years",
  "More than 15 years",
  "Not currently a horse owner, but interested",
];

const CHALLENGE_OPTIONS = [
  "High cost of boarding or land",
  "Limited trail access",
  "Zoning or land-use restrictions",
  "Development pressure on equestrian properties",
  "Lack of veterinary or farrier services",
  "Water and resource costs",
  "Community or neighbor opposition",
  "Aging or inadequate facilities",
  "Other",
];

function StarRating({
  value,
  onChange,
  labels,
}: {
  value: number | null;
  onChange: (v: number) => void;
  labels?: [string, string];
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
            aria-label={`Rate ${n} out of 5`}
          >
            <Star
              className={cn(
                "h-7 w-7 transition-colors",
                n <= (hovered || value || 0)
                  ? "fill-[hsl(var(--gold))] text-[hsl(var(--gold))]"
                  : "text-muted-foreground/60"
              )}
            />
          </button>
        ))}
        {value && (
          <span className="ml-2 text-sm text-muted-foreground">
            {value} / 5
          </span>
        )}
      </div>
      {labels && (
        <div className="flex justify-between text-xs text-muted-foreground max-w-[180px]">
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
        </div>
      )}
    </div>
  );
}

function SectionCard({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-6"
    >
      <h2 className="font-serif text-xl text-foreground border-b border-border pb-4">
        {title}
      </h2>
      {children}
    </motion.div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {!required && (
          <span className="ml-1.5 text-xs text-muted-foreground font-normal">
            (optional)
          </span>
        )}
      </label>
      {hint && <p className="text-xs text-muted-foreground -mt-0.5">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors";

const textareaCls = cn(inputCls, "resize-none leading-relaxed");

export default function Survey() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [years, setYears] = useState("");
  const [quality, setQuality] = useState<number | null>(null);
  const [valuedAspects, setValuedAspects] = useState("");
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [concern, setConcern] = useState<number | null>(null);
  const [preservationIdeas, setPreservationIdeas] = useState("");
  const [memberOfOrg, setMemberOfOrg] = useState("");
  const [comments, setComments] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function toggleChallenge(item: string) {
    setSelectedChallenges((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/survey/pv-horse-keeping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          yearsInvolved: years || undefined,
          qualityRating: quality ?? undefined,
          valuedAspects: valuedAspects.trim() || undefined,
          challenges: selectedChallenges.length
            ? JSON.stringify(selectedChallenges)
            : undefined,
          futureConcernLevel: concern ?? undefined,
          preservationIdeas: preservationIdeas.trim() || undefined,
          memberOfOrg: memberOfOrg || undefined,
          comments: comments.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Unable to submit. Please check your connection and try again.");
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="gold-rule mb-6" />
              <p className="text-xs font-sans tracking-[0.22em] text-primary uppercase mb-4">
                Community Survey
              </p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.05] tracking-tight"
              >
                Horse Keeping in Palos Verdes
              </motion.h1>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 lg:pt-16"
            >
              <p className="text-muted-foreground text-lg leading-relaxed border-l-2 border-primary/40 pl-5">
                The Palos Verdes Peninsula is home to one of the last vibrant
                horse-keeping communities in greater Los Angeles. Your voice
                helps shape its future.
              </p>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 divider-gold" />
      </section>

      {/* Context */}
      <section className="py-14 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex gap-4 bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
              <p>
                Equestrian culture in Palos Verdes spans generations — from the
                Equestrian Overlay Zone to the miles of dedicated riding trails
                that wind through the hills. Yet rising land costs, development
                pressures, and regulatory uncertainty are putting this way of
                life at risk.
              </p>
              <p>
                This survey gathers community perspectives on the current quality
                of horse keeping in the PV area and the steps needed to preserve
                it. All responses are anonymous; contact details are optional and
                used only to follow up if you request it.
              </p>
              <p className="text-xs text-muted-foreground">
                Takes approximately 5 minutes. All fields are optional unless marked required.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form / Success */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-4 max-w-3xl">
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-10 md:p-14 text-center shadow-sm"
            >
              <CheckCircle2 className="h-14 w-14 text-primary mx-auto mb-5" />
              <h2 className="font-serif text-3xl text-foreground mb-4">
                Thank you for your response
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                Your perspective on horse keeping in Palos Verdes has been
                recorded. Community voices like yours are what keep equestrian
                culture alive in the Peninsula.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* About You */}
              <SectionCard title="About You" delay={0}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Your name">
                    <input
                      type="text"
                      className={inputCls}
                      placeholder="First and last name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={120}
                    />
                  </Field>
                  <Field label="Email address" hint="Only used if you request follow-up">
                    <input
                      type="email"
                      className={inputCls}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={320}
                    />
                  </Field>
                </div>

                <Field label="How long have you been involved with horses in the Palos Verdes area?">
                  <select
                    className={cn(inputCls, "cursor-pointer")}
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  >
                    <option value="">Select one…</option>
                    {YEARS_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Are you a member of a local equine organization?">
                  <div className="flex flex-wrap gap-3">
                    {["Yes", "No"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setMemberOfOrg(opt.toLowerCase())}
                        className={cn(
                          "px-5 py-2 rounded-full text-sm border transition-colors",
                          memberOfOrg === opt.toLowerCase()
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </Field>
              </SectionCard>

              {/* Current State */}
              <SectionCard title="Current State of Horse Keeping" delay={0.05}>
                <Field
                  label="How would you rate the overall quality of horse keeping in Palos Verdes today?"
                  hint="1 = Poor, 5 = Excellent"
                >
                  <StarRating
                    value={quality}
                    onChange={setQuality}
                    labels={["Poor", "Excellent"]}
                  />
                </Field>

                <Field label="What do you value most about equestrian life in Palos Verdes?">
                  <textarea
                    className={textareaCls}
                    rows={4}
                    placeholder="Trails, community, facilities, proximity to the city…"
                    value={valuedAspects}
                    onChange={(e) => setValuedAspects(e.target.value)}
                    maxLength={3000}
                  />
                </Field>

                <Field label="What are the biggest challenges facing horse owners in the PV area?">
                  <p className="text-xs text-muted-foreground mb-2">Select all that apply</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CHALLENGE_OPTIONS.map((item) => {
                      const checked = selectedChallenges.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleChallenge(item)}
                          className={cn(
                            "flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-sm text-left transition-colors",
                            checked
                              ? "bg-primary/10 border-primary/50 text-foreground"
                              : "border-border text-muted-foreground hover:border-primary/40"
                          )}
                        >
                          <span
                            className={cn(
                              "h-4 w-4 shrink-0 rounded border flex items-center justify-center",
                              checked ? "bg-primary border-primary" : "border-border"
                            )}
                          >
                            {checked && (
                              <svg
                                viewBox="0 0 10 8"
                                className="h-2.5 w-2.5 fill-primary-foreground"
                              >
                                <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </SectionCard>

              {/* Looking Ahead */}
              <SectionCard title="Looking Ahead" delay={0.1}>
                <Field
                  label="How concerned are you about the future availability of equestrian spaces in Palos Verdes?"
                  hint="1 = Not concerned, 5 = Very concerned"
                >
                  <StarRating
                    value={concern}
                    onChange={setConcern}
                    labels={["Not concerned", "Very concerned"]}
                  />
                </Field>

                <Field label="What steps should be taken to preserve equestrian culture in Palos Verdes?">
                  <textarea
                    className={textareaCls}
                    rows={5}
                    placeholder="Zoning protections, community organizations, trail maintenance, local advocacy…"
                    value={preservationIdeas}
                    onChange={(e) => setPreservationIdeas(e.target.value)}
                    maxLength={3000}
                  />
                </Field>
              </SectionCard>

              {/* Additional */}
              <SectionCard title="Anything Else?" delay={0.15}>
                <Field label="Additional comments or context">
                  <textarea
                    className={textareaCls}
                    rows={4}
                    placeholder="Share any other thoughts on horse keeping, the community, or the future of equestrian life in PV…"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    maxLength={3000}
                  />
                </Field>
              </SectionCard>

              {errorMsg && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
                  {errorMsg}
                </p>
              )}

              <motion.button
                type="submit"
                disabled={status === "submitting"}
                whileHover={{ translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn("bg-gold-metallic shadow-gold-glow w-full sm:w-auto sm:min-w-[200px] h-12 rounded-full px-8 text-sm font-medium transition-all hover:shadow-gold-glow-lg disabled:opacity-60 disabled:cursor-not-allowed", status === "submitting" && "shimmer-paused")}
              >
                {status === "submitting" ? "Submitting…" : "Submit Response"}
              </motion.button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
