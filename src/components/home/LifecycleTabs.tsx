"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface StageView {
  name: string;
  focus: string;
  execution: string;
  outcome: string;
  links: { label: string; href: string }[];
}

/** Seven-stage lifecycle as an accessible tab list (click, or arrow keys / Home / End). */
export function LifecycleTabs({ stages }: { stages: StageView[] }) {
  const [current, setCurrent] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // Every stage's text is stacked in the same grid cell and only the current one is visible, so
  // each card is as tall as its longest stage: switching stages never moves the page below.
  const stack = (render: (s: StageView) => ReactNode) => (
    <div className="lc-stack">
      {stages.map((s, i) => (
        <div key={s.name} className={i === current ? "on" : undefined} aria-hidden={i !== current} inert={i !== current}>
          {render(s)}
        </div>
      ))}
    </div>
  );

  const select = (i: number) => {
    const n = (i + stages.length) % stages.length;
    setCurrent(n);
    tabs.current[n]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: current + 1,
      ArrowDown: current + 1,
      ArrowLeft: current - 1,
      ArrowUp: current - 1,
      Home: 0,
      End: stages.length - 1,
    };
    if (e.key in keys) {
      e.preventDefault();
      select(keys[e.key]);
    }
  };

  return (
    <>
      <div className="lc-track" role="tablist" aria-label="Lifecycle stages" onKeyDown={onKeyDown}>
        {stages.map((s, i) => (
          <button
            key={s.name}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            className="st"
            type="button"
            role="tab"
            id={`lc-tab-${i}`}
            aria-selected={i === current}
            aria-controls="lc-panel"
            tabIndex={i === current ? 0 : -1}
            onClick={() => setCurrent(i)}
          >
            <span className="st-d">{String(i + 1).padStart(2, "0")}</span>
            <b>{s.name}</b>
          </button>
        ))}
      </div>
      <div className="lc-panel" id="lc-panel" role="tabpanel" aria-labelledby={`lc-tab-${current}`}>
        <h3 className="lc-name">
          {String(current + 1).padStart(2, "0")}. {stages[current].name}
        </h3>
        <div className="lc-c">
          <h4>Focus:</h4>
          {stack((s) => (
            <p>{s.focus}</p>
          ))}
          <h4 className="lc-sub">Engineering Execution:</h4>
          {stack((s) => (
            <p className="lc-x">{s.execution}</p>
          ))}
        </div>
        <div className="lc-c">
          <h4>Enterprise Outcome:</h4>
          {stack((s) => (
            <p>{s.outcome}</p>
          ))}
        </div>
        <div className="lc-c">
          <h4>Solves:</h4>
          {stack((s) => (
            <div className="lc-links">
              {s.links.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label} &#8594;
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
