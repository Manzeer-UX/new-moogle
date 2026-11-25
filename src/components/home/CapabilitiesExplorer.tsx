"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";

export interface ExplorerCategory {
  title: string;
  text: string;
  tone: string;
  items: { title: string; text: string; href: string; icon: ReactNode }[];
}

const ACCORDION = "(max-width: 900px)";


/**
 * Capabilities explorer: pick a category, see its solutions.
 * Desktop: a dark card with the categories as numbered tabs across the top and one panel below
 * (all panels share a grid row, so switching never changes the page height); its glow takes the
 * selected category's colour. 900px and below: the same markup is an accordion. Every panel is
 * in the server HTML, so all ten solutions stay crawlable.
 */
export function CapabilitiesExplorer({ categories }: { categories: ExplorerCategory[] }) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const isAccordion = useRef(false);

  useEffect(() => {
    const mq = matchMedia(ACCORDION);
    const sync = () => (isAccordion.current = mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const select = (i: number, focus = false) => {
    const btn = buttons.current[i];
    if (!btn) return;
    if (focus) btn.focus();
    if (i === active) return;
    // In accordion mode the panel above may collapse: keep the tapped header where it was.
    const before = btn.getBoundingClientRect().top;
    flushSync(() => setActive(i));
    if (isAccordion.current) window.scrollBy(0, btn.getBoundingClientRect().top - before);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = categories.length - 1;
    const keys: Record<string, number> = {
      ArrowDown: i === last ? 0 : i + 1,
      ArrowRight: i === last ? 0 : i + 1,
      ArrowUp: i === 0 ? last : i - 1,
      ArrowLeft: i === 0 ? last : i - 1,
      Home: 0,
      End: last,
    };
    if (e.key in keys) {
      e.preventDefault();
      select(keys[e.key], true);
    }
  };

  return (
    <div className="capx" data-tone={categories[active].tone} style={{ "--n": categories.length } as CSSProperties}>
      {categories.map((cat, i) => {
        const on = i === active;
        const count = cat.items.length;
        return [
          <h3 className={`capx-h tone-${cat.tone}`} style={{ "--r": i + 1 } as CSSProperties} key={`h-${cat.title}`}>
            <button
              ref={(el) => {
                buttons.current[i] = el;
              }}
              type="button"
              id={`capx-tab-${i}`}
              className="capx-tab"
              aria-expanded={on}
              aria-controls={`capx-panel-${i}`}
              onClick={() => select(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <span className="n">Category {i + 1}:</span>
              <span className="t">{cat.title}</span>
            </button>
          </h3>,
          <div
            key={`p-${cat.title}`}
            id={`capx-panel-${i}`}
            role="region"
            aria-labelledby={`capx-tab-${i}`}
            className={`capx-panel tone-${cat.tone}${on ? " on" : ""}`}
            inert={!on}
          >
            <p className="capx-desc">{cat.text}</p>
            {/* one row of cards per category, so the panels are close in height */}
            <ul className={`cap-items${count === 1 ? " one" : ""}`} style={{ "--cols": count } as CSSProperties}>
              {cat.items.map((s, j) => (
                <li key={s.href} style={{ "--i": j } as CSSProperties}>
                  <a className="cap-it" href={s.href}>
                    <span className="ci">{s.icon}</span>
                    <span>
                      <b>{s.title}</b>
                      <span className="cd">{s.text}</span>
                    </span>
                    <span className="ar" aria-hidden="true">
                      &#8594;
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>,
        ];
      })}
    </div>
  );
}
