"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export interface PickerItem {
  href: string;
  question: string;
  tone: string;
  icon: ReactNode;
}

/**
 * Challenge picker card. Cycles a highlight through the five challenges until the
 * visitor hovers or focuses the card, so it reads as an invitation to choose.
 */
export function ChallengePicker({ title, hint, items }: { title: string; hint: string; items: PickerItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const next = useRef(0);
  const hold = useRef(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let interval = 0;
    const step = () => {
      setActive(next.current);
      next.current = (next.current + 1) % items.length;
    };
    const timeout = window.setTimeout(() => {
      step();
      interval = window.setInterval(() => {
        if (!hold.current && !document.hidden) step();
      }, 2400);
    }, 1500);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [items.length]);

  const pause = () => {
    hold.current = true;
    setActive(null);
  };
  const resume = () => {
    hold.current = false;
  };

  return (
    <div
      className="picker"
      id="pick"
      role="group"
      aria-labelledby="pick-title"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <div className="pk-h">
        <b id="pick-title">{title}</b>
        <span className="pk-live">
          <i aria-hidden="true" />
          {hint}
        </span>
      </div>
      <ul className="pk-list">
        {items.map((item, i) => (
          <li key={item.href}>
            <a className={i === active ? "pk on" : "pk"} href={item.href}>
              <span className={`pk-i c-${item.tone}`}>{item.icon}</span>
              <b>{item.question}</b>
              <span className="pk-a" aria-hidden="true">
                &#8594;
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
