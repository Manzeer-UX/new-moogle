import { Icon } from "@/components/ui/Icon";
import { SpotlightGroup } from "@/components/ui/SpotlightGroup";
import { DIFFERENTIATORS } from "@/lib/content";

export function Why() {
  return (
    <section className="band" id="why">
      <div className="in">
        <div className="eyebrow">Why MoogleLabs</div>
        <h2>
          We do not sell headcount or prototypes. We deliver <span className="grad">operational capability.</span>
        </h2>
        <p className="lede">
          An end-to-end transformation partner, taking ownership from the business problem to secure, governed, and
          scalable AI/ML solutions.
        </p>
        <SpotlightGroup className="why-grid" cardSelector=".wy">
          {DIFFERENTIATORS.map((d) => (
            <div className={d.dark ? "wy dark" : "wy"} key={d.title}>
              <span className={`t t-${d.tone}`}>
                <Icon name={d.icon} />
              </span>
              <h3>{d.title}</h3>
              <p>{d.text}</p>
              <div className="d">
                <small>Differentiator:</small>
                {d.short}
              </div>
            </div>
          ))}
        </SpotlightGroup>
      </div>
    </section>
  );
}
