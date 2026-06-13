const stats = [
  { num: '90', label: 'Días de transformación' },
  { num: '8+', label: 'Años de experiencia' },
  { num: '1:1', label: 'Seguimiento directo' },
];

export default function Stats() {
  return (
    <div className="stats-strip" id="resultados">
      {stats.map((s) => (
        <div className="stat" data-focus key={s.label}>
          <div className="stat-num">{s.num}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
