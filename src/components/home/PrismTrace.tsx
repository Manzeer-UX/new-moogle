"use client";

import type { CSSProperties } from "react";
import { CountUp } from "@/components/ui/CountUp";
import { useArmedReveal } from "@/components/ui/useArmedReveal";

interface TraceRow {
  step: string;
  offset: number;
  width: number;
  ms: number;
}

/** PRISM AI trace: when it scrolls into view the spans draw in as a waterfall and the timings count up. */
export function PrismTrace({ rows }: { rows: TraceRow[] }) {
  const [ref, phase] = useArmedReveal<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className={phase === "armed" ? "ptr armed" : "ptr"}>
      <div className="ptr-h">
        <span>Trace &#183; customer assistant</span>
        <em>&#9679; Passed</em>
      </div>
      {rows.map((r, i) => (
        <div className="ptr-r" key={r.step}>
          <span>{r.step}</span>
          <i style={{ "--l": `${r.offset}%`, "--w": `${r.width}%`, "--d": `${i * 0.18}s` } as CSSProperties} />
          <b>
            <CountUp to={r.ms} suffix=" ms" phase={phase} delay={i * 0.18} duration={0.9} />
          </b>
        </div>
      ))}
      <div className="ptr-k">
        <div>
          <small>Groundedness</small>
          <b>
            <CountUp to={0.94} decimals={2} phase={phase} delay={0.6} />
          </b>
        </div>
        <div>
          <small>Policy</small>
          <b>Pass</b>
        </div>
        <div>
          <small>Cost</small>
          <b>
            <CountUp to={0.004} decimals={3} prefix="$" phase={phase} delay={0.6} />
          </b>
        </div>
      </div>
    </div>
  );
}
