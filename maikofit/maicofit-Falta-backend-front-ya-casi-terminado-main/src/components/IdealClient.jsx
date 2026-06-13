const yes = [
  'Tenés entre 20 y 40 años',
  'Sos emprendedor o trabajás con alta exigencia',
  'Dejaste tu salud de lado por enfocarte en tu negocio',
  'Querés más energía, foco y presencia física',
  'Estás dispuesto a comprometerte de verdad',
  'Entendés que el cuerpo es parte de tu imagen y tu poder',
];

const no = [
  'Buscás resultados sin esfuerzo ni compromiso',
  'Querés una dieta milagro o solución rápida',
  'No estás dispuesto a cambiar hábitos',
  'Sos menor de 20 años',
  'Buscás un programa para mujeres',
];

export default function IdealClient() {
  return (
    <section className="ideal" id="para-quien">
      <div className="section-inner">
        <div className="section-tag">Para quién es esto</div>
        <h2 className="section-title">¿ESTO ES PARA VOS?</h2>

        <div className="ideal-grid">
          <div className="ideal-vs">VS</div>
          <div className="ideal-col yes" data-focus>
            <div className="ideal-col-tag">
              <span>✓</span> Esto es para vos si...
            </div>
            <ul className="ideal-list">
              {yes.map((item) => (
                <li className="ideal-item" key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="ideal-col no" data-focus>
            <div className="ideal-col-tag">
              <span>✕</span> Esto NO es para vos si...
            </div>
            <ul className="ideal-list">
              {no.map((item) => (
                <li className="ideal-item" key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="section-cta">
          <a
            className="cta-btn"
            href="https://wa.me/541144036786?text=Hola%20Maico!%20Quiero%20saber%20si%20el%20programa%20es%20para%20mi"
            target="_blank"
            rel="noreferrer"
          >
            💬 ¿Sos el perfil ideal? Escribime
          </a>
        </div>
      </div>
    </section>
  );
}
