import { CASES, CLIENTS } from "@/lib/content";

export function Work() {
  return (
    <section className="band work" id="work">
      <div className="in">
        <div className="eyebrow">Work we&apos;ve delivered</div>
        <h2>Proof, not promises</h2>
        <div className="cases">
          {CASES.map((c, i) => (
            <article className="case" key={c.industry}>
              <div className={`cv c${i + 1}`}>
                <span className="ind">{c.industry}</span>
                <span className="phl">Sample &#183; replace</span>
              </div>
              <div className="cb">
                <small>[Client name]</small>
                <h3>[Project title]</h3>
                <p>[One line on the challenge and what we built]</p>
                <div className="res">
                  <b>{c.result}</b>
                  <span>[Headline result]</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="trust">
          <div className="names">
            {CLIENTS.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
          <small>Replace names with logos once each client approves.</small>
        </div>
      </div>
    </section>
  );
}
