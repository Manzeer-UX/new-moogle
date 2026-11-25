import type { CSSProperties } from "react";
import { RevealSection } from "@/components/ui/RevealSection";
import { OM_ROWS, OM_STAGES } from "@/lib/content";

const FILL = ["33%", "67%", "100%"];

export function OperatingModel() {
  return (
    <RevealSection className="band omx" id="operating-model">
      <div className="in">
        <div className="omx-h">
          <div>
            <div className="eyebrow">From one use case to an operating model</div>
            <h2>
              We don&apos;t build isolated AI apps. We build <span className="grad">AI that scales.</span>
            </h2>
          </div>
          <p>
            Once the first use case proves value, we put the architecture, data foundation, governance, reusable
            components and engineering practices in place, so every next use case is faster, cheaper and safer.
          </p>
        </div>

        <div className="omx-g">
          <div className="omx-ax" aria-hidden="true">
            <b>Business value &#8593;</b>
            <span>Foundations that compound &#8595;</span>
          </div>
          {OM_STAGES.map((s, i) => (
            <div className={`omx-st omx-st--${i + 1}`} key={s.title}>
              <div className="omx-c">
                <span>Stage 0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
          <svg className="omx-curve" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="omg" x1="0" x2="1">
                <stop offset="0" stopColor="#e8613c" />
                <stop offset="1" stopColor="#f2a93b" />
              </linearGradient>
            </defs>
            <path d="M0 230 C 70 215, 120 160, 167 148 S 410 80, 500 68 S 760 16, 833 12 S 960 -6, 1000 -14" />
          </svg>
          {OM_ROWS.map((row) => (
            <div className="omx-r" key={row.label}>
              <div className="omx-l">
                <i aria-hidden="true" />
                {row.label}
              </div>
              {row.cells.map((cell, i) => (
                <div className={`omx-cell c${i + 1}`} data-s={`Stage 0${i + 1}`} key={cell}>
                  <em style={{ "--f": FILL[i] } as CSSProperties} aria-hidden="true" />
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="omx-ft">
          <span>
            <i aria-hidden="true" />
            Every stage measured with PRISM AI: quality, cost and reliability
          </span>
          <a className="btn" href="#talk">
            Plan your operating model &#8594;
          </a>
        </div>
      </div>
    </RevealSection>
  );
}
