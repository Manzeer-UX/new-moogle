"use client";

import type { PointerEvent, ReactNode } from "react";

/**
 * SpotlightCard behaviour for a whole grid (in the spirit of React Bits' SpotlightCard):
 * one delegated pointer listener moves a soft light under the cursor on the hovered card.
 * The light itself is pure CSS (`::before` reading --mx / --my).
 */
export function SpotlightGroup({
  className,
  cardSelector,
  children,
}: {
  className: string;
  cardSelector: string;
  children: ReactNode;
}) {
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const card = (e.target as Element).closest<HTMLElement>(cardSelector);
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div className={className} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}
