const phrases = [
  {
    text: <>EL VERDADERO CAMBIO NO ES FÍSICO.<br /><span>ES MENTAL.</span></>,
  },
  {
    text: <>NADIE VA A VENIR A SALVARTE.<br /><span>EL CAMBIO DEPENDE DE VOS.</span></>,
  },
  {
    text: <>LOS MOMENTOS MÁS OSCUROS<br /><span>SON LOS QUE MÁS TE DESPIERTAN.</span></>,
  },
];

export default function Phrases() {
  return (
    <div className="phrases">
      <div className="phrases-grid">
        {phrases.map((p, i) => (
          <div className="phrase-card" key={i}>
            <div className="phrase-quote">"</div>
            <p className="phrase-text">{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
