import { useEffect, useState } from "react";

export function useStickyVisible(heroId: string): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, [heroId]);

  return visible;
}
