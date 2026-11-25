import { FAQS } from "@/lib/content";

/**
 * Frequently Asked Questions: native <details> accordion (keyboard and screen-reader friendly,
 * no JavaScript). The first answer starts open; the `name` attribute keeps one open at a time.
 */
export function Faq() {
  return (
    <section className="band" id="faq">
      <div className="in faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <details className="faq-q" name="faq" open={i === 0} key={f.q}>
              <summary>
                <span className="faq-n">{i + 1}.</span>
                <span className="faq-t">{f.q}</span>
                <span className="faq-i" aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
