import type { Variants, Transition } from "framer-motion";

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.4, 0, 0.2, 1] as const,
  snappy: [0.175, 0.885, 0.32, 1.1] as const,
};

export const spring = {
  gentle: { type: "spring", stiffness: 200, damping: 28, mass: 0.8 } as Transition,
  snappy: { type: "spring", stiffness: 380, damping: 30, mass: 0.6 } as Transition,
  bouncy: { type: "spring", stiffness: 500, damping: 22, mass: 0.5 } as Transition,
  slow: { type: "spring", stiffness: 100, damping: 20, mass: 1 } as Transition,
};

export const duration = {
  fast: 0.2,
  base: 0.35,
  slow: 0.6,
  cinematic: 0.85,
};

export function staggerVariants(
  staggerChildren = 0.07,
  delayChildren = 0,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  };
}

export function fadeUpVariants(
  yOffset = 20,
  durationVal = duration.slow,
): Variants {
  return {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: durationVal, ease: ease.out },
    },
    exit: {
      opacity: 0,
      y: -yOffset * 0.5,
      transition: { duration: duration.base, ease: ease.inOut },
    },
  };
}

export function slideVariants(direction: "left" | "right" = "right"): Variants {
  const x = direction === "right" ? 40 : -40;
  return {
    hidden: { opacity: 0, x },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: duration.slow, ease: ease.out },
    },
    exit: {
      opacity: 0,
      x: -x * 0.6,
      transition: { duration: duration.base, ease: ease.inOut },
    },
  };
}

export const cardHover = {
  rest: { y: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.12)" },
  hover: {
    y: -6,
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.25), 0 0 20px rgba(198,163,40,0.08)",
    transition: spring.snappy,
  },
};

export const scaleHover = {
  rest: { scale: 1 },
  hover: { scale: 1.025, transition: spring.snappy },
};
