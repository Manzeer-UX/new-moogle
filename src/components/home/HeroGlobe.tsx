"use client";

import { useEffect, useRef } from "react";

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Decorative WebGL globe behind the hero. The renderer lives in a separate chunk that is
 * fetched only once the browser is idle after first paint, and it is skipped entirely for
 * visitors who ask to save data.
 */
export function HeroGlobe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;

    let dispose: (() => void) | undefined;
    let cancelled = false;
    const w = window as IdleWindow;

    // wait for web fonts too, so the globe is placed against the final hero layout
    const load = () =>
      Promise.all([import("./globe"), document.fonts?.ready]).then(([{ mountGlobe }]) => {
        if (!cancelled) dispose = mountGlobe(canvas);
      });

    const id = w.requestIdleCallback ? w.requestIdleCallback(load, { timeout: 2500 }) : window.setTimeout(load, 800);

    return () => {
      cancelled = true;
      if (w.cancelIdleCallback) w.cancelIdleCallback(id);
      else clearTimeout(id);
      dispose?.();
    };
  }, []);

  return <canvas ref={ref} className="hero-globe" aria-hidden="true" />;
}
