export default function PageHeader({ tag, title, sub }) {
  return (
    <section className="page-header">
      <div className="page-header-glow" />
      <div className="section-tag">{tag}</div>
      <h1 className="page-header-title">{title}</h1>
      {sub && <p className="page-header-sub">{sub}</p>}
    </section>
  );
}
