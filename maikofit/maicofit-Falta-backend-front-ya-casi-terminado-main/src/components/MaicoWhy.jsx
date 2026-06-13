const icons = {
  brain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M12 5v13" />
    </svg>
  ),
  sliders: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  cycle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
};

const reasons = [
  {
    icon: icons.brain,
    title: 'MENTALIDAD PRIMERO',
    desc: 'No entreno solo cuerpos. Entreno la forma en que pensás sobre vos mismo. El físico es consecuencia.',
  },
  {
    icon: icons.sliders,
    title: '100% PERSONALIZADO',
    desc: 'Nada de plantillas. Tu programa existe para vos y nadie más. Se adapta semana a semana a tu realidad.',
  },
  {
    icon: icons.bolt,
    title: 'PARA HOMBRES QUE RINDEN',
    desc: 'Entiendo que tu tiempo vale. Los protocolos están diseñados para maximizar resultados con la menor fricción posible.',
  },
  {
    icon: icons.cycle,
    title: 'RESULTADOS QUE DURAN',
    desc: 'No te enseño a hacer dieta. Te enseño a vivir de otra manera. Cuando terminás, no volvés atrás.',
  },
];

export default function MaicoWhy() {
  return (
    <section className="maico-why">
      <div className="section-tag">Por qué Maico</div>
      <h2 className="section-title">LO QUE ME HACE<br />DIFERENTE</h2>
      <div className="maico-why-grid">
        {reasons.map((r, i) => (
          <div className="why-card" data-focus key={r.title}>
            <div className="why-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="why-icon">{r.icon}</div>
            <div className="why-title">{r.title}</div>
            <p className="why-desc">{r.desc}</p>
          </div>
        ))}
      </div>

      <div className="section-cta">
        <a
          className="cta-btn"
          href="https://wa.me/541144036786?text=Hola%20Maico!%20Quiero%20saber%20mas%20sobre%20el%20programa"
          target="_blank"
          rel="noreferrer"
        >
          💬 Hablar con Maico
        </a>
      </div>
    </section>
  );
}
