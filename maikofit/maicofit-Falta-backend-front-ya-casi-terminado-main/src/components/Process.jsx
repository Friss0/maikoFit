const steps = [
  {
    num: '01',
    title: 'ELEGÍS TU PLAN',
    desc: 'Esencial para arrancar ya con estructura, o 1 a 1 para una transformación completa y personalizada. Sin excusas, solo decisiones.',
    img: '/fotos/web/DSC09937.webp',
    cta: { label: 'Ver planes', href: '/planes' },
  },
  {
    num: '02',
    title: 'EVALUACIÓN',
    desc: 'Analizamos tu punto de partida: objetivos, hábitos, estilo de vida y disponibilidad. Tu programa empieza desde donde estás, no desde donde quisieras estar.',
    img: '/fotos/web/DSC09941.webp',
    cta: { label: 'Quiero mi evaluación', href: 'https://wa.me/541144036786?text=Hola%20Maico!%20Quiero%20mi%20evaluaci%C3%B3n', external: true },
  },
  {
    num: '03',
    title: 'PLAN A MEDIDA',
    desc: 'Entrenamiento, alimentación y mentalidad diseñados exclusivamente para vos. No hay plantillas, hay estrategia.',
    img: '/fotos/web/DSC09949.webp',
    cta: { label: 'Empezar ahora', href: '/planes' },
  },
  {
    num: '04',
    title: 'RESULTADOS',
    desc: 'Seguimiento constante para que nunca pierdas el rumbo. Tu progreso se ajusta semana a semana. Acá no abandonás.',
    img: '/fotos/web/DSC09964.webp',
    cta: { label: 'Quiero esto', href: 'https://wa.me/541144036786?text=Hola%20Maico!%20Quiero%20empezar', external: true },
  },
];

export default function Process() {
  return (
    <section id="proceso" className="process">
      <div className="process-header">
        <div className="section-tag">Cómo funciona</div>
        <h1 className="section-title" style={{ marginBottom: 0 }}>EL PROCESO</h1>
      </div>

      <div className="process-panels">
        {steps.map((step) => (
          <div className="process-panel" key={step.num}>
            <div
              className="process-panel-bg"
              style={{ backgroundImage: `url(${step.img})` }}
            />
            <div className="process-panel-overlay" />
            <div className="process-panel-content">
              <div className="process-panel-num">{step.num}</div>
              <div className="process-panel-title">{step.title}</div>
              <p className="process-panel-desc">{step.desc}</p>
              <a
                className="process-panel-cta"
                href={step.cta.href}
                target={step.cta.external ? '_blank' : undefined}
                rel={step.cta.external ? 'noreferrer' : undefined}
              >
                {step.cta.label} →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
