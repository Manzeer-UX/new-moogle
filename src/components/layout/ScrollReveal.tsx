"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide scroll reveal, as on the original page: blocks that start below the fold fade
 * and rise into place (60 ms stagger between siblings). Blocks already on screen, the hero,
 * and sections with their own choreography are left alone, so nothing is hidden by default.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const fold = window.innerHeight * 0.92;
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("main section .in > *, main section .in > div > *"),
    ).filter(
      (el) =>
        !el.closest(".hero, .sx-hero, .omx-g, .lc") &&
        !el.parentElement?.closest(".capx, .ind-band") && // these animate their own children
        el.getBoundingClientRect().top > fold &&
        el.offsetHeight < 1400,
    );

    const timers: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("sx-in");
          io.unobserve(el);
          // once revealed, hand the element back to its own styles and transitions
          const delay = parseFloat(el.style.transitionDelay) || 0;
          timers.push(
            window.setTimeout(() => {
              el.classList.remove("sx-rv", "sx-in");
              el.style.transitionDelay = "";
            }, 760 + delay),
          );
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    for (const el of els) {
      const index = Array.prototype.indexOf.call(el.parentElement?.children ?? [], el);
      el.style.transitionDelay = `${Math.min(index, 5) * 60}ms`;
      el.classList.add("sx-rv");
      io.observe(el);
    }

    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  return null;
}
