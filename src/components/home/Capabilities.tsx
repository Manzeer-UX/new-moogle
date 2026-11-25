import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";
import { CAPABILITIES, INDUSTRIES } from "@/lib/content";
import { pageHref } from "@/lib/routes";
import { CapabilitiesExplorer } from "./CapabilitiesExplorer";

/** Capabilities & Solutions: pick one of four categories to see its solutions, then the industries we serve (a framed grid). */
export function Capabilities() {
  const categories = CAPABILITIES.map((cat) => ({
    title: cat.title,
    text: cat.text,
    tone: cat.tone,
    items: cat.items.map((s) => ({ title: s.title, text: s.text, href: pageHref(s.slug), icon: <Icon name={s.icon} /> })),
  }));

  return (
    <section className="band" id="capabilities">
      <div className="in">
        <h2>
          Capabilities &amp; <span className="grad">Solutions</span>
        </h2>

        <CapabilitiesExplorer categories={categories} />

        {/* One framed grid: the intro takes the first cell, the industries fill the rest. */}
        <div className="ind-band">
          <div className="ind-intro">
            <h3>Industries We Serve</h3>
            <p>Intelligence tailored to how your sector actually operates.</p>
          </div>
          <ul className="ind-list">
            {INDUSTRIES.map((ind, i) => (
              <li key={ind.name} style={{ "--i": i } as CSSProperties}>
                <span className="ii">
                  <Icon name={ind.icon} />
                </span>
                <span className="nm">{ind.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
