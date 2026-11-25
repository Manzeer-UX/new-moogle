import { LIFECYCLE } from "@/lib/content";
import { pageHref } from "@/lib/routes";
import { LifecycleTabs } from "./LifecycleTabs";

export function Lifecycle() {
  const stages = LIFECYCLE.map((s) => ({
    name: s.name,
    focus: s.focus,
    execution: s.execution,
    outcome: s.outcome,
    links: s.solves.map((l) => ({ label: l.label, href: pageHref(l.slug) })),
  }));

  return (
    <section className="band life" id="lifecycle">
      <div className="in">
        <h2>The 7 Delivery Stages</h2>
        <LifecycleTabs stages={stages} />
        <div className="islc">
          <span className="tag" aria-hidden="true" />
          <span>
            <b>Governed end to end.</b> Security, data and AI governance checks run at every stage, not just at the end.
          </span>
        </div>
      </div>
    </section>
  );
}
