import { Icon } from "@/components/ui/Icon";
import { ALL_SOLUTIONS, CHALLENGES, SOLUTION_GROUPS } from "@/lib/content";
import { CONTACT_HREF, pageHref, withBase } from "@/lib/routes";
import { Logo } from "./Logo";
import { BurgerButton, Drawer, HeaderBar, MegaItem, NavProvider } from "./nav-client";

// Plain <a> links between pages (not next/link): every page loads with only its own template
// styles, so the homepage and the two inner-page templates never share a document.
function HomeLogo() {
  return (
    <a className="sx-logo" href={withBase("/")} aria-label="MoogleLabs home">
      <Logo />
    </a>
  );
}

export function SiteHeader() {
  return (
    <NavProvider>
      <HeaderBar>
        <div className="sx-bar">
          <HomeLogo />
          <ul className="sx-menu">
            <MegaItem id="sol" label="Solutions">
              <div className="sx-mega-in">
                {SOLUTION_GROUPS.map((group) => (
                  <div className="sx-grp" key={group.title}>
                    <p className="sx-gh">{group.title}</p>
                    {group.items.map((s) => (
                      <a className="sx-it" href={pageHref(s.slug)} key={s.slug}>
                        <span className="sx-i">
                          <Icon name={s.icon} className="ico" />
                        </span>
                        <span>
                          <b>{s.title}</b>
                          <small>{s.blurb}</small>
                        </span>
                      </a>
                    ))}
                  </div>
                ))}
                <a className="sx-promo" href={withBase("/#pick")}>
                  <small>Not sure where to start?</small>
                  <b>Start with the challenge, not the technology.</b>
                  <span>See the five challenges &#8594;</span>
                </a>
              </div>
            </MegaItem>
            <MegaItem id="ch" label="Challenges">
              <div className="sx-mega-in sx-two">
                <div className="sx-ch">
                  {CHALLENGES.map((c) => (
                    <a href={pageHref(c.slug)} key={c.id}>
                      <b>{c.question}</b>
                      <small>{c.label} &#8594;</small>
                    </a>
                  ))}
                </div>
                <a className="sx-promo" href={pageHref("ai-security-governance", "#prism")}>
                  <small>Built by MoogleLabs</small>
                  <b>PRISM AI: see and control every AI system.</b>
                  <span>Explore PRISM AI &#8594;</span>
                </a>
              </div>
            </MegaItem>
          </ul>
          <a className="sx-cta" href={CONTACT_HREF}>
            Contact Us &#8594;
          </a>
          <BurgerButton />
        </div>
      </HeaderBar>

      <Drawer logo={<HomeLogo />}>
        <details>
          <summary>Solutions</summary>
          <div className="sx-dl">
            {ALL_SOLUTIONS.map((s) => (
              <a href={pageHref(s.slug)} key={s.slug}>
                {s.title}
                <small>{s.blurb}</small>
              </a>
            ))}
          </div>
        </details>
        <details>
          <summary>Challenges</summary>
          <div className="sx-dl">
            {CHALLENGES.map((c) => (
              <a href={pageHref(c.slug)} key={c.id}>
                {c.question}
                <small>{c.label}</small>
              </a>
            ))}
          </div>
        </details>
        <a className="sx-cta" href={CONTACT_HREF}>
          Contact Us &#8594;
        </a>
      </Drawer>
    </NavProvider>
  );
}
