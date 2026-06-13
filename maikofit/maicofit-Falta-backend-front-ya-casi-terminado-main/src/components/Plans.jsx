import BuyButton from './BuyButton';

const plans = [
  {
    id: 'esencial',
    tier: 'Esencial · Suscripción mensual',
    name: 'ESENCIAL',
    duration: 'Mensual',
    tagline: 'Construí disciplina sin vivir haciendo dieta. El primer paso hacia tu transformación.',
    price: '$12.900',
    priceNote: 'ARS / mes · se renueva automáticamente',
    features: [
      'Rutina de entrenamiento estructurada',
      'Guía de alimentación simple y efectiva',
      'Guía de hábitos y disciplina',
      'Recomendaciones de suplementación',
      'Acceso al grupo / comunidad privada',
      'Actualización mensual de contenido',
    ],
    ideal: 'Para hombres que quieren arrancar ya y ver resultados reales sin que el proceso les consuma la vida.',
    featured: false,
    bgImg: '/fotos/web/DSC09949.webp',
  },
  {
    id: '1a1',
    tier: '1 a 1 · Programa personalizado',
    name: '1 A 1',
    duration: '3 meses',
    tagline: 'Para el hombre que está listo para una transformación real y no quiere hacerlo solo.',
    price: '$132.333',
    priceNote: 'ARS / mes · 3 meses · total $397.000 — pago único',
    features: [
      'Plan adaptado a tu cuerpo, horarios y objetivos',
      'Nutrición deportiva personalizada por licenciada',
      'Seguimiento semanal 1 a 1 — nunca perdés el rumbo',
      'Ajustes constantes según tu progreso real',
      'Contacto directo por WhatsApp — siempre disponible',
      'Convertís el entrenamiento en parte de tu identidad',
      'Acceso a comunidad privada exclusiva',
      '3 entrenamientos presenciales incluidos',
    ],
    ideal: 'Para hombres comprometidos que quieren transformación real, más energía para sus negocios y construir su mejor versión en 90 días.',
    featured: true,
    badge: 'Recomendado',
    bgImg: '/fotos/web/DSC09964.webp',
  },
];

export default function Plans() {
  return (
    <section className="plans" id="planes">
      <div className="section-inner">
        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              className={`plan-card${plan.featured ? ' featured' : ''}`}
              data-focus
              key={plan.name}
              style={{ '--card-img': `url(${plan.bgImg})` }}
            >
              {plan.badge && <div className="badge-hot">{plan.badge}</div>}
              <span className="plan-tier">{plan.tier}</span>
              <div className="plan-name">{plan.name}</div>
              <div className="plan-duration">{plan.duration}</div>
              <p className="plan-tagline">{plan.tagline}</p>
              <div className="plan-price">{plan.price}</div>
              <div className="plan-price-note">{plan.priceNote}</div>
              <div className="plan-divider" />
              <div className="plan-includes">¿Qué incluye?</div>
              <ul className="plan-features">
                {plan.features.map((f) => (
                  <li className="plan-feature" key={f}>{f}</li>
                ))}
              </ul>
              <p className="plan-ideal">{plan.ideal}</p>
              <div className="pay-group">
                <BuyButton planId={plan.id}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Comprar con Mercado Pago
                </BuyButton>
              </div>
            </div>
          ))}
        </div>

        <div className="teaser-guarantee plans-guarantee" id="garantia">
          <div className="teaser-guarantee-badge">
            <span className="teaser-guarantee-days">90</span>
            <span className="teaser-guarantee-text">días</span>
          </div>
          <p className="teaser-guarantee-copy">
            <strong>Garantía total.</strong> Si seguís el programa durante 90 días y no lográs
            el cambio que buscabas, te devuelvo la plata. Sin preguntas, sin vueltas.
            No vas a perder ni tiempo ni dinero.
          </p>
        </div>

        <div className="section-cta">
          <a
            className="cta-btn-cal"
            href="https://wa.me/541144036786?text=Hola%20Maico!%20Quiero%20info%20sobre%20los%20planes"
            target="_blank"
            rel="noreferrer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: '0.45rem', verticalAlign: '-2px' }}>
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            ¿Tenés dudas? Escribime
          </a>
        </div>
      </div>
    </section>
  );
}
