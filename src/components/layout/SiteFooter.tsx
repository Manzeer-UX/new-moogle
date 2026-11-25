import { ALL_SOLUTIONS, CHALLENGES } from "@/lib/content";
import { CONTACT_HREF, pageHref, withBase } from "@/lib/routes";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="sx-foot">
      <div className="sx-foot-in">
        <div>
          <a className="sx-logo" href={withBase("/")} aria-label="MoogleLabs home">
            <Logo />
          </a>
          <p>
            From enterprise challenge to production-scale intelligence. Others build solutions. We build the capability to
            scale them.
          </p>
          <a className="sx-foot-cta" href={CONTACT_HREF}>
            Contact Us &#8594;
          </a>
        </div>
        <div>
          <h2>Solutions</h2>
          <ul>
            {ALL_SOLUTIONS.map((s) => (
              <li key={s.slug}>
                <a href={pageHref(s.slug)}>{s.title}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Start with a challenge</h2>
          <ul>
            {CHALLENGES.map((c) => (
              <li key={c.id}>
                <a href={pageHref(c.slug)}>{c.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="sx-foot-b">
        <span>&#169; MoogleLabs</span>
        <span>Observability by PRISM AI</span>
      </div>
    </footer>
  );
}
