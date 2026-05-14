import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Mail, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { spring, duration, ease } from "@/lib/motion";

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

const successVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: duration.base, ease: ease.out },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    transition: { duration: duration.fast, ease: ease.inOut },
  },
};

const formVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.fast, ease: ease.out },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: duration.fast, ease: ease.inOut },
  },
};

const shakeVariants: Variants = {
  idle: { x: 0 },
  shake: {
    x: [0, -9, 9, -7, 7, -4, 4, 0],
    transition: { duration: 0.48, ease: "easeInOut" },
  },
};

export function NewsletterSignup({
  variant = "hero",
  source = "news_page",
  heading,
  subheading,
  className,
}: Props) {
  const shouldReduceMotion = useReducedMotion();

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
  const [shakeKey, setShakeKey] = useState(0);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

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
        setShakeKey((k) => k + 1);
        if (/email/i.test(message)) {
          setError("email", { type: "server", message });
        } else if (/name/i.test(message)) {
          setError("name", { type: "server", message });
        }
        return;
      }

      setStatus(data.alreadySubscribed ? "already" : "success");
      if (data.alreadySubscribed) {
        trackEvent("newsletter_signup_duplicate", { source });
      } else {
        trackEvent("newsletter_signup", { source });
      }
      reset();
    } catch {
      setStatus("error");
      setServerError("Network error. Please try again.");
      setShakeKey((k) => k + 1);
    }
  }

  const nameReg = register("name");
  const emailReg = register("email");

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

  const focusRingProps = (isFocused: boolean) =>
    shouldReduceMotion
      ? {}
      : {
          animate: isFocused
            ? { scale: 1.015, transition: spring.gentle }
            : { scale: 1, transition: spring.gentle },
        };

  const isSuccess = status === "success" || status === "already";

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

      <AnimatePresence mode="wait" initial={false}>
        {isSuccess ? (
          <motion.div
            key="success"
            variants={shouldReduceMotion ? undefined : successVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
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
          <motion.form
            key="form"
            variants={shouldReduceMotion ? undefined : formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3"
          >
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              key={`shake-${shakeKey}`}
              variants={shouldReduceMotion ? undefined : shakeVariants}
              initial="idle"
              animate={status === "error" && shakeKey > 0 ? "shake" : "idle"}
            >
              <div>
                <label htmlFor={`nl-name-${variant}`} className="sr-only">
                  Your name
                </label>
                <motion.div {...focusRingProps(nameFocused)}>
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
                    onFocus={() => setNameFocused(true)}
                    {...nameReg}
                    onBlur={(e) => { setNameFocused(false); void nameReg.onBlur(e); }}
                  />
                </motion.div>
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
                <motion.div {...focusRingProps(emailFocused)}>
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
                    onFocus={() => setEmailFocused(true)}
                    {...emailReg}
                    onBlur={(e) => { setEmailFocused(false); void emailReg.onBlur(e); }}
                  />
                </motion.div>
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
            </motion.div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              animate={
                shouldReduceMotion
                  ? {}
                  : isSubmitting
                    ? {
                        opacity: [1, 0.65, 1],
                        scale: [1, 0.98, 1],
                        transition: {
                          duration: 1.1,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }
                    : { opacity: 1, scale: 1 }
              }
              whileHover={
                shouldReduceMotion || isSubmitting
                  ? {}
                  : { scale: 1.02, transition: spring.snappy }
              }
              whileTap={
                shouldReduceMotion || isSubmitting
                  ? {}
                  : { scale: 0.97, transition: spring.snappy }
              }
              className={cn(
                "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "disabled:cursor-not-allowed",
                isFooter
                  ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  : "bg-gold-metallic shadow-gold-glow hover:shadow-gold-glow-lg",
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
            </motion.button>

            {serverError && status === "error" && (
              <motion.p
                initial={shouldReduceMotion ? {} : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration.fast, ease: ease.out }}
                className={cn(
                  "text-sm",
                  isFooter ? "text-red-200" : "text-destructive",
                )}
                role="alert"
                data-testid="newsletter-error"
              >
                {serverError}
              </motion.p>
            )}

            <p
              className={cn(
                "text-xs",
                isFooter ? "text-primary-foreground/85" : "text-muted-foreground",
              )}
            >
              One thoughtful dispatch a month. Unsubscribe any time.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
