import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "hero" | "footer" | "inline";

type Props = {
  variant?: Variant;
  source?: string;
  heading?: string;
  subheading?: string;
  className?: string;
};

type SubscribeResponse = {
  ok: boolean;
  alreadySubscribed?: boolean;
  error?: string;
};

export function NewsletterSignup({
  variant = "hero",
  source = "news_page",
  heading,
  subheading,
  className,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "already" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, source }),
      });
      const data = (await res.json()) as SubscribeResponse;

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus(data.alreadySubscribed ? "already" : "success");
      setName("");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  const isFooter = variant === "footer";
  const isHero = variant === "hero";

  const wrapperClasses = cn(
    isHero && "bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm",
    isFooter && "bg-transparent",
    variant === "inline" && "bg-card border border-border rounded-xl p-6",
    className,
  );

  const successView = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex items-start gap-3 rounded-lg p-4",
        isFooter
          ? "bg-primary-foreground/10 text-primary-foreground"
          : "bg-primary/10 text-foreground",
      )}
      data-testid="newsletter-success"
      role="status"
      aria-live="polite"
    >
      <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
      <div>
        <p className="font-medium">
          {status === "already" ? "You're already on the list." : "You're in. Welcome to The Worthy Horse News."}
        </p>
        <p className={cn("text-sm mt-1", isFooter ? "text-primary-foreground/80" : "text-muted-foreground")}>
          {status === "already"
            ? "Thanks for confirming — we won't add you again."
            : "Look for the next dispatch in your inbox soon."}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className={wrapperClasses} data-testid={`newsletter-signup-${variant}`}>
      {(heading || subheading) && (
        <div className={cn("mb-6", isFooter && "mb-4")}>
          {heading && (
            <h3
              className={cn(
                "font-serif",
                isHero ? "text-2xl md:text-3xl text-foreground" : "text-xl",
                isFooter && "text-primary-foreground",
              )}
            >
              {heading}
            </h3>
          )}
          {subheading && (
            <p
              className={cn(
                "mt-2 leading-relaxed",
                isFooter ? "text-primary-foreground/80 text-sm" : "text-muted-foreground",
              )}
            >
              {subheading}
            </p>
          )}
        </div>
      )}

      {status === "success" || status === "already" ? (
        successView
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`nl-name-${variant}`} className="sr-only">
                Your name
              </label>
              <input
                id={`nl-name-${variant}`}
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={status === "submitting"}
                className={cn(
                  "w-full h-11 px-4 rounded-md border bg-background text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                  "disabled:opacity-60",
                  isFooter && "bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 placeholder:text-primary-foreground/60",
                )}
                data-testid="input-newsletter-name"
              />
            </div>
            <div>
              <label htmlFor={`nl-email-${variant}`} className="sr-only">
                Email address
              </label>
              <input
                id={`nl-email-${variant}`}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "submitting"}
                className={cn(
                  "w-full h-11 px-4 rounded-md border bg-background text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                  "disabled:opacity-60",
                  isFooter && "bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 placeholder:text-primary-foreground/60",
                )}
                data-testid="input-newsletter-email"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className={cn(
              "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-all",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              isFooter
                ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-md",
            )}
            data-testid="button-newsletter-subscribe"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Subscribing…
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Subscribe
              </>
            )}
          </button>

          {errorMsg && (
            <p
              className={cn(
                "text-sm",
                isFooter ? "text-red-200" : "text-destructive",
              )}
              role="alert"
              data-testid="newsletter-error"
            >
              {errorMsg}
            </p>
          )}

          <p
            className={cn(
              "text-xs",
              isFooter ? "text-primary-foreground/60" : "text-muted-foreground",
            )}
          >
            One thoughtful dispatch a month. Unsubscribe any time.
          </p>
        </form>
      )}
    </div>
  );
}
