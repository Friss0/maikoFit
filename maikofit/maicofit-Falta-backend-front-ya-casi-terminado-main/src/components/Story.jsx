import Link from 'next/link';

export default function Story() {
  return (
    <section className="story" id="historia">
      <div
        className="story-bg"
        style={{ backgroundImage: 'url(/fotos/web/DSC09966.webp)' }}
      />
      <div className="story-overlay" />

      <div className="story-inner">
        <div className="section-tag">Mi historia</div>
        <h1 className="section-title">POR QUÉ HAGO ESTO</h1>

        <div className="story-credentials">
          <div className="story-credential">8+ años de experiencia</div>
          <div className="story-credential">Nutrición deportiva</div>
          <div className="story-credential">Coaching 1 a 1</div>
          <div className="story-credential">+100 transformaciones</div>
        </div>

        <div className="story-grid">
          <div className="story-col">
            <p className="story-p">
              Nací en Argentina, en una familia de <span>trabajo, esfuerzo y valores</span>. Desde chico supe que era diferente — mi cabeza siempre iba para otro lado. Siempre sentí que estaba hecho para algo más.
            </p>
            <p className="story-p">
              Durante años el fútbol fue mi vida. Pero también fue la etapa donde empecé a perderme. Vivía <span>desconectado de mí mismo</span>, tapando inseguridades con lo que tenía a mano. Fiestas, malas compañías, sin propósito.
            </p>
            <p className="story-p">
              Cuando dejé el fútbol fue un <span>golpe enorme</span>. Aprendí responsabilidad. Pero seguía sintiendo que no estaba viviendo la vida que quería.
            </p>
          </div>

          <div className="story-col">
            <p className="story-p">
              El gimnasio empezó siendo una forma de descargarme, pero terminó <span>transformándome por completo</span>. No solo cambié mi cuerpo — cambié mi cabeza, mi energía, la forma en que me veía a mí mismo.
            </p>
            <p className="story-p">
              Hoy trabajo con hombres que están exactamente donde yo estaba: <span>exitosos en sus negocios, perdidos en su cuerpo</span>. Hombres que saben que hay algo que falta.
            </p>
            <p className="story-p">
              Mi misión es que <span>encuentren ese algo — y que lo construyan para siempre</span>.
            </p>
          </div>

          <blockquote className="story-pullquote">
            "NO ENTRENO CUERPOS.<br />ENTRENO HOMBRES QUE YA GANARON AFUERA Y<br />
            <span>QUIEREN GANAR TAMBIÉN ADENTRO.</span>"
          </blockquote>
        </div>

        <div className="section-cta" style={{ marginTop: '3rem' }}>
          <Link className="cta-btn" href="/planes">
            Ver planes
          </Link>
        </div>
      </div>
    </section>
  );
}
