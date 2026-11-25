import { Fragment, type CSSProperties } from "react";
import { DEVFORGE_INNER, DEVFORGE_OUTER, PRISM_CHIPS, PRISM_TRACE, STACK } from "@/lib/content";
import { EXTERNAL, newTab, pageHref } from "@/lib/routes";
import { PrismTrace } from "./PrismTrace";

/** Position on an ellipse, as % of the orbit box (0deg = 12 o'clock, clockwise). */
function onEllipse(deg: number, rx: number, ry: number): CSSProperties {
  const a = (deg * Math.PI) / 180;
  return { left: `${(50 + rx * Math.sin(a)).toFixed(1)}%`, top: `${(50 - ry * Math.cos(a)).toFixed(1)}%` };
}

export function Platforms() {
  return (
    <section className="band" id="platforms">
      <div className="in">
        <div className="eyebrow">End-to-End Enterprise Delivery</div>
        <h2>One unified team across the full enterprise AI lifecycle.</h2>
        <p className="lede">One team across the whole AI stack, backed by our own platform and product suite.</p>
        <div className="stack">
          {STACK.map((s, i) => (
            <Fragment key={s}>
              {i > 0 && <i aria-hidden="true">+</i>}
              <span>{s}</span>
            </Fragment>
          ))}
        </div>

        <div className="ptop">
          <div className="pl hl">
            <span className="own">Our platform</span>
            <b>PRISM AI</b>
            <p>Our AI observability and governance platform. See and control every AI system in one place.</p>
            <div className="chips">
              {PRISM_CHIPS.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            <PrismTrace rows={PRISM_TRACE} />
            <a href={pageHref("ai-security-governance", "#prism")}>See PRISM AI in action &#8594;</a>
          </div>

          <div className="dfh">
            <div className="dfh-t">
              <div>
                <span className="own">Our product suite</span>
                <b>DevForge.ai</b>
              </div>
              <a className="dfl" href={EXTERNAL.devforge} {...newTab}>
                devforge.ai &#8599;
              </a>
            </div>
            <p>Purpose-built AI products we designed and run in production, reused in client work.</p>
            <div className="orbit" role="group" aria-label="DevForge.ai products">
              <span className="ring r1" aria-hidden="true" />
              <span className="ring r2" aria-hidden="true" />
              <a className="hub" href={EXTERNAL.devforge} {...newTab}>
                <b>DevForge.ai</b>
                <small>14 AI products</small>
              </a>
              {DEVFORGE_INNER.map((p, i) => (
                <a
                  key={p.path}
                  className="orb-t inner"
                  href={`${EXTERNAL.devforge}/${p.path}`}
                  style={onEllipse(i * 60, 27, 25)}
                  {...newTab}
                >
                  {p.name}
                </a>
              ))}
              {DEVFORGE_OUTER.map((p, i) => (
                <a
                  key={p.path}
                  className="orb-t"
                  href={`${EXTERNAL.devforge}/${p.path}`}
                  style={onEllipse(22.5 + i * 45, 44, 43)}
                  {...newTab}
                >
                  {p.name}
                </a>
              ))}
            </div>
            <div className="orb-chips">
              {[...DEVFORGE_INNER, ...DEVFORGE_OUTER].map((p) => (
                <a key={p.path} href={`${EXTERNAL.devforge}/${p.path}`} {...newTab}>
                  {p.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
