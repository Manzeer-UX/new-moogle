"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export type RevealPhase = "static" | "armed" | "play";

/**
 * Plays an entrance animation the first time an element scrolls into view.
 *
 * - "static": element was already on screen (or motion is reduced): show final state, no animation.
 * - "armed":  element is below the fold: render the start state while it is still off screen.
 * - "play":   element entered the viewport: animate to the final state.
 *
 * Content is fully visible in the server HTML, so nothing stays hidden if JavaScript fails.
 */
export function useArmedReveal<T extends Element>(threshold = 0.25): [RefObject<T | null>, RevealPhase] {
  const ref = useRef<T>(null);
  const [phase, setPhase] = useState<RevealPhase>("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let first = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false;
          if (entry.boundingClientRect.top < window.innerHeight) {
            io.disconnect(); // already visible on load: keep the final state
            return;
          }
          setPhase("armed");
          return;
        }
        if (entry.isIntersecting) {
          setPhase("play");
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, phase];
}
