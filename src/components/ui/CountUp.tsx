"use client";

import { useEffect, useState } from "react";
import type { RevealPhase } from "./useArmedReveal";

interface CountUpProps {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** "static" shows the final value, "armed" shows zero, "play" counts up. */
  phase: RevealPhase;
  delay?: number;
  duration?: number;
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Animated number (in the spirit of React Bits' CountUp), without an animation library. */
export function CountUp({ to, decimals = 0, prefix = "", suffix = "", phase, delay = 0, duration = 1.1 }: CountUpProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase !== "play") return;
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now + delay * 1000;
      const t = Math.max(0, (now - start) / (duration * 1000));
      setProgress(easeOutExpo(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, delay, duration]);

  const value = phase === "static" ? to : phase === "armed" ? 0 : to * progress;
  return (
    <>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </>
  );
}
