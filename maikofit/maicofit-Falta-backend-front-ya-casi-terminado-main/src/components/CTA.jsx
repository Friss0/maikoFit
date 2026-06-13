import Link from 'next/link';

export default function CTA({ showPlans = true }) {
  return (
    <section className="cta-section" id="contacto">
      <h2 className="cta-title">¿LISTO PARA<br /><span className="cta-title-hi">EL CAMBIO?</span></h2>
      <p className="cta-sub">Escribime directo y arranquemos hoy.</p>
      <div className="cta-buttons">
        {showPlans && (
          <Link className="cta-btn-cal" href="/planes">
            Ver planes
          </Link>
        )}
        <a
          className="cta-btn"
          href="https://wa.me/541144036786?text=Hola%20Maico!%20Quiero%20info%20sobre%20los%20planes"
          target="_blank"
          rel="noreferrer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          Escribime por WhatsApp
        </a>
      </div>
      <p className="cta-microcopy">Respuesta en menos de 24 hs · Sin compromiso · Cupos limitados</p>
    </section>
  );
}
