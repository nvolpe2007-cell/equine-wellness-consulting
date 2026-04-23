import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type Variant = "hero" | "footer" | "inline";

type Props = {
  variant?: Variant;
  source?: string;
  heading?: string;
  subheading?: string;
  className?: string;
};

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name")
    .max(120, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email")
    .email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

type SubscribeResponse = {
  ok: boolean;
  alreadySubscribed?: boolean;
  error?: string;
};

type SubmitStatus = "idle" | "success" | "already" | "error";

export function NewsletterSignup({
  variant = "hero",
  source = "news_page",
  heading,
  subheading,
  className,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "" },
  });

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setStatus("idle");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, source }),
      });
      const data = (await res.json().catch(() => null)) as SubscribeResponse | null;

      if (!res.ok || !data?.ok) {
        const message =
          data?.error ?? "Something went wrong. Please try again.";
        setStatus("error");
        setServerError(message);
        // Surface field errors when the server tells us which field failed.
        if (/email/i.test(message)) {
          setError("email", { type: "server", message });
        } else if (/name/i.test(message)) {
          setError("name", { type: "server", message });
        }
        return;
      }

      setStatus(data.alreadySubscribed ? "already" : "success");
      // Only count brand-new subscribes as a conversion; re-submits of
      // already-subscribed emails fire a separate, non-conversion event.
      if (data.alreadySubscribed) {
        trackEvent("newsletter_signup_duplicate", { source });
      } else {
        trackEvent("newsletter_signup", { source });
      }
      reset();
    } catch {
      setStatus("error");
      setServerError("Network error. Please try again.");
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

  const inputBase = cn(
    "w-full h-11 px-4 rounded-md border bg-background text-foreground placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
    "disabled:opacity-60",
  );

  const inputThemed = (hasError: boolean) =>
    cn(
      inputBase,
      isFooter &&
        "bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 placeholder:text-primary-foreground/60",
      hasError && (isFooter ? "border-red-300" : "border-destructive"),
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
              {status === "already"
                ? "You're already on the list."
                : "You're subscribed — watch your inbox."}
            </p>
            <p
              className={cn(
                "text-sm mt-1",
                isFooter ? "text-primary-foreground/80" : "text-muted-foreground",
              )}
            >
              {status === "already"
                ? "Thanks for confirming — we won't add you again."
                : "The next dispatch of The Worthy Horse News will arrive soon."}
            </p>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`nl-name-${variant}`} className="sr-only">
                Your name
              </label>
              <input
                id={`nl-name-${variant}`}
                type="text"
                autoComplete="name"
                placeholder="Your name"
                disabled={isSubmitting}
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? `nl-name-${variant}-err` : undefined}
                className={inputThemed(Boolean(errors.name))}
                data-testid="input-newsletter-name"
                {...register("name")}
              />
              {errors.name && (
                <p
                  id={`nl-name-${variant}-err`}
                  className={cn(
                    "mt-1.5 text-xs",
                    isFooter ? "text-red-200" : "text-destructive",
                  )}
                  data-testid="newsletter-name-error"
                >
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor={`nl-email-${variant}`} className="sr-only">
                Email address
              </label>
              <input
                id={`nl-email-${variant}`}
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                disabled={isSubmitting}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? `nl-email-${variant}-err` : undefined}
                className={inputThemed(Boolean(errors.email))}
                data-testid="input-newsletter-email"
                {...register("email")}
              />
              {errors.email && (
                <p
                  id={`nl-email-${variant}-err`}
                  className={cn(
                    "mt-1.5 text-xs",
                    isFooter ? "text-red-200" : "text-destructive",
                  )}
                  data-testid="newsletter-email-error"
                >
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
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
            {isSubmitting ? (
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

          {serverError && status === "error" && (
            <p
              className={cn(
                "text-sm",
                isFooter ? "text-red-200" : "text-destructive",
              )}
              role="alert"
              data-testid="newsletter-error"
            >
              {serverError}
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
