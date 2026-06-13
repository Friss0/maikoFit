'use client'
import { useState, useRef, useEffect } from 'react';

// TODO: Reemplazar con los pares de fotos reales antes/después de cada cliente
// Las fotos van en public/fotos/web/ (versiones optimizadas ~30KB; las
// originales de cámara pesan 15MB y no deben referenciarse directo)
const cases = [
  {
    name: 'Nicolás R.',
    role: 'Empresario · Buenos Aires',
    result: '+8 kg de músculo · 90 días',
    before: '/fotos/web/DSC09937.webp',
    after: '/fotos/web/DSC09941.webp',
  },
  {
    name: 'Matías G.',
    role: 'Emprendedor · Córdoba',
    result: '-12 kg · 3 meses',
    before: '/fotos/web/DSC09949.webp',
    after: '/fotos/web/DSC09964.webp',
  },
  {
    name: 'Sebastián M.',
    role: 'Director de empresa',
    result: 'Transformación completa · 90 días',
    before: '/fotos/web/DSC09966.webp',
    after: '/fotos/web/DSC09949.webp',
  },
  {
    name: 'Andrés P.',
    role: '35 años · Profesional',
    result: '-15 kg · ganó músculo y energía',
    before: '/fotos/web/DSC09941.webp',
    after: '/fotos/web/DSC09964.webp',
  },
];

const N = cases.length;
// 3 copias: la del medio es la "real". Al llegar a una copia lateral se
// recentra en silencio (mismo contenido = salto invisible) → loop infinito,
// siempre hay fotos a ambos lados de la central.
const loopCases = [...cases, ...cases, ...cases];

export default function BeforeAfter() {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const settleRef = useRef(null);
  const [active, setActive] = useState(N);

  // Posición inicial: primera card de la copia central, sin animación
  useEffect(() => {
    const track = trackRef.current;
    const card = track?.children[N];
    if (!card) return;
    track.scrollLeft = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Imágenes ya completas al montar (cache hit): su load disparó antes
    // de que React attachee onLoad — marcarlas acá o quedan invisibles
    track.querySelectorAll('img').forEach((img) => {
      if (img.complete && img.naturalWidth > 0) img.classList.add('img-loaded');
    });

    let raf = null;

    const nearestIndex = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(track.children).forEach((el, i) => {
        const d = Math.abs(el.offsetLeft + el.clientWidth / 2 - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    };

    // Si quedamos en una copia lateral, saltar a la posición equivalente
    // de la copia central. Sin animación: el contenido es idéntico.
    const recenter = () => {
      if (animRef.current) return; // nunca durante la animación de flechas
      const i = nearestIndex();
      if (i >= N && i < 2 * N) return;
      const j = i < N ? i + N : i - N;
      const delta = track.children[j].offsetLeft - track.children[i].offsetLeft;
      const prevSnap = track.style.scrollSnapType;
      track.style.scrollSnapType = 'none';
      track.scrollLeft += delta;
      track.style.scrollSnapType = prevSnap;
      setActive(j);
    };

    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = null;
          setActive(nearestIndex());
        });
      }
      // Fallback de scrollend (Safari viejo): recentrar al asentarse
      clearTimeout(settleRef.current);
      settleRef.current = setTimeout(recenter, 140);
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    track.addEventListener('scrollend', recenter);
    return () => {
      track.removeEventListener('scroll', onScroll);
      track.removeEventListener('scrollend', recenter);
      clearTimeout(settleRef.current);
      if (raf) cancelAnimationFrame(raf);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Scroll animado con easing custom (easeOutQuart): arranque rápido y
  // frenado suave — la fluidez iOS que el scrollTo nativo no da.
  const scrollToCard = (i) => {
    const track = trackRef.current;
    const card = track?.children[i];
    if (!card) return;
    const target = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
    const start = track.scrollLeft;
    const delta = target - start;
    if (Math.abs(delta) < 1) return;

    if (animRef.current) cancelAnimationFrame(animRef.current);
    const t0 = performance.now();
    const DUR = 700;
    const ease = (t) => 1 - Math.pow(1 - t, 4);
    const prevSnap = track.style.scrollSnapType;
    track.style.scrollSnapType = 'none'; // que el snap no pelee con el rAF

    const step = (now) => {
      const p = Math.min(1, (now - t0) / DUR);
      track.scrollLeft = start + delta * ease(p);
      if (p < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        track.style.scrollSnapType = prevSnap;
        animRef.current = null;
        track.dispatchEvent(new Event('scrollend')); // recentrar si tocó una copia lateral
      }
    };
    animRef.current = requestAnimationFrame(step);
  };

  return (
    <section className="ba-section" id="transformaciones">
      <div className="ba-header">
        <span className="ba-tag">Casos de éxito</span>
        <h2 className="ba-title">RESULTADOS<br />REALES</h2>
        <p className="ba-sub">
          Hombres que tomaron la decisión y la sostuvieron. Sin magia — con método.
        </p>
      </div>

      <div className="ba-carousel">
        <button
          className="ba-arrow ba-arrow--prev"
          onClick={() => scrollToCard(active - 1)}
          aria-label="Caso anterior"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="ba-track" ref={trackRef}>
          {loopCases.map((c, i) => (
            <div
              className={`ba-card${active === i ? ' ba-card--active' : ''}`}
              key={i}
              onClick={() => i !== active && scrollToCard(i)}
            >
              <div className="ba-images">
                <div className="ba-half">
                  <img
                    src={c.before}
                    alt={`Antes — ${c.name}`}
                    className="ba-img"
                    loading="lazy"
                    decoding="async"
                    onLoad={(e) => e.currentTarget.classList.add('img-loaded')}
                  />
                  <span className="ba-label ba-label--before">ANTES</span>
                </div>
                <div className="ba-divider" aria-hidden="true" />
                <div className="ba-half">
                  <img
                    src={c.after}
                    alt={`Después — ${c.name}`}
                    className="ba-img"
                    loading="lazy"
                    decoding="async"
                    onLoad={(e) => e.currentTarget.classList.add('img-loaded')}
                  />
                  <span className="ba-label ba-label--after">DESPUÉS</span>
                </div>
              </div>
              <div className="ba-info">
                <div className="ba-name">{c.name}</div>
                <div className="ba-role">{c.role}</div>
                <div className="ba-result">
                  <span className="ba-result-check">✓</span>
                  {c.result}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="ba-arrow ba-arrow--next"
          onClick={() => scrollToCard(active + 1)}
          aria-label="Caso siguiente"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="ba-cta">
        <a className="cta-btn" href="#planes">
          Quiero mi transformación
        </a>
      </div>
    </section>
  );
}
