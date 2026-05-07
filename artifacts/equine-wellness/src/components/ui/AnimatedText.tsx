import {
  motion,
  useReducedMotion,
  AnimatePresence,
  type Variants,
  type HTMLMotionProps,
} from "framer-motion";
import { createElement, type ComponentType, type ReactNode } from "react";
import { ease } from "@/lib/motion";

type CommonProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  whileInView?: boolean;
  viewportMargin?: string;
  once?: boolean;
};

const easeOut = ease.out;

/**
 * WordReveal — splits text into words and reveals each with a soft fade-up.
 * Respects prefers-reduced-motion by rendering the text statically.
 */
export function WordReveal({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  duration = 0.7,
  as = "span",
  whileInView = false,
  viewportMargin = "-80px",
  once = true,
}: CommonProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as ComponentType<HTMLMotionProps<"div">>;

  if (reduce) {
    return createElement(as, { className }, text);
  }

  const words = text.split(/(\s+)/);
  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
  const child: Variants = {
    hidden: { y: "0.25em", opacity: 0.7 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration, ease: easeOut },
    },
  };

  const motionProps = whileInView
    ? {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once, margin: viewportMargin },
      }
    : { initial: "hidden" as const, animate: "visible" as const };

  return (
    <Tag className={className} variants={container} {...motionProps}>
      {words.map((word, i) =>
        /^\s+$/.test(word) ? (
          <span key={i}> </span>
        ) : (
          <span key={i} className="inline-block align-baseline">
            <motion.span
              variants={child}
              className="inline-block will-change-transform"
            >
              {word}
            </motion.span>
          </span>
        ),
      )}
    </Tag>
  );
}

/**
 * ClipReveal — cinematic heading entrance: text slides up from behind a clip mask.
 */
export function ClipReveal({
  text,
  className,
  delay = 0,
  duration = 0.75,
  as = "span",
  whileInView = true,
  viewportMargin = "-80px",
  once = true,
}: CommonProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return createElement(as, { className }, text);
  }

  const motionProps = whileInView
    ? {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once, margin: viewportMargin },
      }
    : { initial: "hidden" as const, animate: "visible" as const };

  const inner: Variants = {
    hidden: { y: "105%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: { duration, ease: easeOut, delay },
    },
  };

  return (
    <span className="block overflow-hidden">
      <motion.span
        className={`block ${className ?? ""}`}
        variants={inner}
        {...motionProps}
      >
        {text}
      </motion.span>
    </span>
  );
}

/**
 * StaggerReveal — wraps child elements and reveals them in sequence when
 * scrolled into view. Accepts any ReactNode children.
 */
export function StaggerReveal({
  children,
  className,
  staggerChildren = 0.08,
  delayChildren = 0,
  once = true,
  viewportMargin = "-60px",
}: {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  once?: boolean;
  viewportMargin?: string;
}) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  };

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: viewportMargin }}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem — individual child for use inside StaggerReveal.
 */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  const item: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: easeOut },
    },
  };

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

/**
 * LineReveal — single-shot fade-up for a line of text. Cheap and viewport-aware.
 */
export function LineReveal({
  text,
  className,
  delay = 0,
  duration = 0.7,
  as = "p",
  whileInView = true,
  viewportMargin = "-80px",
  once = true,
}: CommonProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as ComponentType<HTMLMotionProps<"div">>;

  if (reduce) {
    return createElement(as, { className }, text);
  }

  const variants: Variants = {
    hidden: { opacity: 0.7, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration, ease: easeOut, delay } },
  };

  const motionProps = whileInView
    ? {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once, margin: viewportMargin },
      }
    : { initial: "hidden" as const, animate: "visible" as const };

  return (
    <Tag className={className} variants={variants} {...motionProps}>
      {text}
    </Tag>
  );
}

/**
 * AnimatedHeading — pairs an optional uppercase eyebrow with a headline.
 * Eyebrow fades in first, then the headline reveals word-by-word.
 */
export function AnimatedHeading({
  eyebrow,
  text,
  className,
  eyebrowClassName,
  as = "h2",
  whileInView = true,
  delay = 0,
  stagger = 0.05,
  children,
}: {
  eyebrow?: string;
  text: string;
  className?: string;
  eyebrowClassName?: string;
  as?: "h1" | "h2" | "h3";
  whileInView?: boolean;
  delay?: number;
  stagger?: number;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <div>
      {eyebrow ? (
        reduce ? (
          <span className={eyebrowClassName}>{eyebrow}</span>
        ) : (
          <motion.span
            className={eyebrowClassName}
            initial={{ opacity: 0, y: 8 }}
            {...(whileInView
              ? {
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-80px" },
                }
              : { animate: { opacity: 1, y: 0 } })}
            transition={{ duration: 0.6, ease: easeOut, delay }}
          >
            {eyebrow}
          </motion.span>
        )
      ) : null}
      <WordReveal
        text={text}
        as={as}
        className={className}
        whileInView={whileInView}
        delay={delay + (eyebrow ? 0.18 : 0)}
        stagger={stagger}
      />
      {children}
    </div>
  );
}

/**
 * AccentFlourish — animated underline that draws beneath inline text after a delay.
 */
export function AccentFlourish({
  delay = 0.9,
  className = "bg-accent/70",
}: {
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.span
      aria-hidden="true"
      className={`absolute left-0 right-0 -bottom-1 md:-bottom-2 h-[3px] md:h-[5px] rounded-full origin-left ${className}`}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ delay, duration: 1.1, ease: easeOut }}
    />
  );
}
