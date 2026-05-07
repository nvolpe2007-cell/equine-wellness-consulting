import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "framer-motion";
import { ease as easing } from "@/lib/motion";

type Props = {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
};

export function CountUp({
  to,
  suffix = "",
  prefix = "",
  duration = 1.6,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inViewRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(inViewRef, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [displayed, setDisplayed] = useState(reduce ? to : 0);
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current || reduce) return;
    started.current = true;
    const controls = animate(0, to, {
      duration,
      ease: easing.out,
      onUpdate(v) {
        setDisplayed(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [isInView, to, duration, reduce]);

  return (
    <span ref={inViewRef} className={className}>
      <span ref={ref}>
        {prefix}
        {displayed}
        {suffix}
      </span>
    </span>
  );
}
