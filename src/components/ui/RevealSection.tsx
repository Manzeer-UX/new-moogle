"use client";

import type { ReactNode } from "react";
import { useArmedReveal } from "./useArmedReveal";

/**
 * A <section> that plays its CSS entrance choreography once, when a quarter of it is visible.
 * CSS hooks: `.armed` (start state, applied only while off screen) and `.on` (playing/played).
 */
export function RevealSection({
  className,
  id,
  threshold = 0.25,
  children,
}: {
  className: string;
  id?: string;
  threshold?: number;
  children: ReactNode;
}) {
  const [ref, phase] = useArmedReveal<HTMLElement>(threshold);
  const state = phase === "armed" ? " armed" : phase === "play" ? " on" : "";
  return (
    <section ref={ref} id={id} className={className + state}>
      {children}
    </section>
  );
}
