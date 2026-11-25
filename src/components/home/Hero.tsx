import { Icon } from "@/components/ui/Icon";
import { SplitText } from "@/components/ui/SplitText";
import { CHALLENGES, CLIENTS } from "@/lib/content";
import { pageHref } from "@/lib/routes";
import { ChallengePicker } from "./ChallengePicker";
import { HeroGlobe } from "./HeroGlobe";

export function Hero() {
  const items = CHALLENGES.map((c) => ({
    href: pageHref(c.slug),
    question: c.question,
    tone: c.tone,
    icon: <Icon name={c.icon} />,
  }));

  return (
    <section className="hero band" id="top">
      <HeroGlobe />
      <div className="in">
        <div className="h-grid">
          <div>
            <span className="h-eb">
              <i aria-hidden="true" />
              Enterprise AI Engineering
            </span>
            <h1 className="split">
              <SplitText
                parts={[{ text: "From Experimental AI to" }, { text: "Production Intelligence", className: "grad" }]}
              />
            </h1>
            <p className="lede">
              We bridge the gap between AI pilots and live deployment by engineering secure, governed, cost-efficient
              platforms inside your core operational stack.
            </p>
            <div className="ctas">
              <a className="btn" href="#talk">
                Discuss Your AI Roadmap <span aria-hidden="true">&#8594;</span>
              </a>
              <a className="btn light" href="#capabilities">
                Explore Solutions Below
              </a>
            </div>
          </div>
          <ChallengePicker title="Where is your AI roadmap encountering friction?" hint="Pick one to start" items={items} />
        </div>

        <div className="h-strip">
          <span>Trusted by teams at</span>
          <div className="names">
            <div className="marq">
              {CLIENTS.map((n) => (
                <span key={n}>{n}</span>
              ))}
              {CLIENTS.map((n) => (
                <span key={`${n}-dup`} aria-hidden="true">
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
