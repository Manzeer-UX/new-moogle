import { CHALLENGES } from "@/lib/content";
import { ContactForm } from "./ContactForm";

export function Talk() {
  return (
    <section className="band" id="talk">
      <div className="in cta">
        <div>
          <div className="eyebrow">Next Steps</div>
          <h2>Discuss your roadmap with an AI solutions architect.</h2>
          <p className="lede">
            Share where your team is facing friction. In a focused 30-minute technical session, we will assess your current
            constraints and outline a practical path toward production. No sales pitch, no commitment.
          </p>
        </div>
        <ContactForm challenges={CHALLENGES.map((c) => c.question)} />
      </div>
    </section>
  );
}
