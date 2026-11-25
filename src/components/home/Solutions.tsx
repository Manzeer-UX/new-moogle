import { Icon } from "@/components/ui/Icon";
import { SOLUTION_GROUPS } from "@/lib/content";
import { pageHref } from "@/lib/routes";

export function Solutions() {
  return (
    <section className="band" id="solutions">
      <div className="in">
        <div className="so-head">
          <div>
            <div className="eyebrow">What we do</div>
            <h2>
              Ten ways we help you <span className="grad">build, run and trust AI.</span>
            </h2>
          </div>
          <p>
            Each solution works on its own, and they are built to work together, from your first use case to AI at scale.
          </p>
        </div>
        <div className="so-grid">
          {SOLUTION_GROUPS.map((group) => (
            <div className="so-col" key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((s) => (
                  <li key={s.slug}>
                    <a className="so-it" href={pageHref(s.slug)}>
                      <span className="si">
                        <Icon name={s.icon} className="ico" />
                      </span>
                      <span>
                        <b>{s.title}</b>
                        <small>{s.blurb}</small>
                      </span>
                      <span className="ar" aria-hidden="true">
                        &#8594;
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
