import { useRef, useCallback } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export function useMagneticEffect<T extends HTMLElement = HTMLElement>(
  strength = 0.3,
) {
  const ref = useRef<T>(null);
  const reduce = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 300, damping: 20, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 300, damping: 20, mass: 0.5 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      if (reduce || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      rawX.set((e.clientX - cx) * strength);
      rawY.set((e.clientY - cy) * strength);
    },
    [rawX, rawY, strength, reduce],
  );

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { ref, x, y, onMouseMove, onMouseLeave };
}
