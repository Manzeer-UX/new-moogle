"use client";

import { useEffect } from "react";

/** Arrow keys, Home and End move between the tabs of a tablist (clicking still works as before). */
function arrowKeys(tabs: HTMLElement[], signal: AbortSignal) {
  tabs.forEach((tab, i) =>
    tab.addEventListener(
      "keydown",
      (e) => {
        const last = tabs.length - 1;
        const next: Record<string, number> = {
          ArrowRight: i === last ? 0 : i + 1,
          ArrowDown: i === last ? 0 : i + 1,
          ArrowLeft: i === 0 ? last : i - 1,
          ArrowUp: i === 0 ? last : i - 1,
          Home: 0,
          End: last,
        };
        if (!(e.key in next)) return;
        e.preventDefault();
        tabs[next[e.key]].focus();
        tabs[next[e.key]].click();
      },
      { signal },
    ),
  );
}

/**
 * The interactive parts of the inner pages, as on the original site:
 * - lifecycle tabs (.lc-t / .lc-p) on the solution pages,
 * - the handover-kit preview (#klist .ki / .kview .kp) on the challenge pages,
 * - the contact form (#f), which shows its thank-you message (#done).
 * The page markup is static HTML, so this only attaches listeners after hydration.
 */
export function InnerPageScripts() {
  useEffect(() => {
    const ac = new AbortController();
    const { signal } = ac;

    document.querySelectorAll<HTMLElement>(".lc").forEach((lc) => {
      const tabs = Array.from(lc.querySelectorAll<HTMLElement>(".lc-t"));
      const panels = Array.from(lc.querySelectorAll<HTMLElement>(".lc-p"));
      tabs.forEach((tab) =>
        tab.addEventListener(
          "click",
          () => {
            const i = tab.dataset.i;
            tabs.forEach((t) => {
              t.classList.toggle("on", t.dataset.i === i);
              t.setAttribute("aria-selected", String(t.dataset.i === i));
            });
            panels.forEach((p) => p.classList.toggle("on", p.dataset.i === i));
          },
          { signal },
        ),
      );
      arrowKeys(tabs, signal);
    });

    const kit = Array.from(document.querySelectorAll<HTMLElement>("#klist .ki"));
    kit.forEach((item) =>
      item.addEventListener(
        "click",
        () => {
          kit.forEach((x) => x.setAttribute("aria-selected", String(x === item)));
          document.querySelectorAll<HTMLElement>(".kview .kp").forEach((p) => (p.hidden = p.dataset.k !== item.dataset.k));
        },
        { signal },
      ),
    );
    arrowKeys(kit, signal);

    document.getElementById("f")?.addEventListener(
      "submit",
      (e) => {
        e.preventDefault();
        const done = document.getElementById("done");
        if (done) done.hidden = false;
      },
      { signal },
    );

    return () => ac.abort();
  }, []);

  return null;
}
