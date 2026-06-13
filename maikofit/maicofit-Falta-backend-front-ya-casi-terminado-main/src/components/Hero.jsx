import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Versiones comprimidas (1080p, faststart, sin audio) — los originales de
// 15MB en /fotos/ no deben referenciarse: tardan en arrancar y se ven negros
const VIDEOS = ['/fotos/web/hero-1.mp4', '/fotos/web/hero-2.mp4'];
const POSTERS = ['/fotos/web/hero-poster-1.webp', '/fotos/web/hero-poster-2.webp'];

export default function Hero() {
  const [active, setActive] = useState(0);
  const refs = [useRef(null), useRef(null)];
  const prebuffered = useRef(false);

  useEffect(() => {
    const vid = refs[active].current;
    if (!vid) return;
    vid.currentTime = 0;
    vid.play().catch(() => {});
  }, [active]);

  // El video 2 arranca con preload="none" (no compite con la carga inicial).
  // Cuando el video 1 va por el 60%, bufferear el 2 para un crossfade sin gap.
  const handleTimeUpdate = (e) => {
    if (prebuffered.current) return;
    const v = e.currentTarget;
    if (v.duration && v.currentTime > v.duration * 0.6) {
      prebuffered.current = true;
      const next = refs[1].current;
      if (next) {
        next.preload = 'auto';
        next.load();
      }
    }
  };

  return (
    <section className="hero">
      {VIDEOS.map((src, i) => (
        <video
          key={src}
          ref={refs[i]}
          className={`hero-video${active === i ? ' active' : ''}`}
          muted
          playsInline
          autoPlay={i === 0}
          preload={i === 0 ? 'auto' : 'none'}
          poster={POSTERS[i]}
          onTimeUpdate={i === 0 ? handleTimeUpdate : undefined}
          onEnded={() => setActive((i + 1) % 2)}
          src={src}
        />
      ))}
      <div className="hero-overlay" />

      <div className="hero-content">
        <div className="hero-eyebrow">Mentalidad · Entrenamiento · Nutrición</div>

        <h1 className="hero-title">
          CONVERTITE EN<br />
          EL HOMBRE QUE<br />
          <span className="hi">QUERÉS SER</span>
        </h1>

        <p className="hero-sub">
          Transformación real para hombres de 20 a 40 años que quieren verse mejor,
          sentirse mejor y recuperar su confianza — sin dejar de lado su negocio.
        </p>

        <div className="hero-cta-group">
          <Link className="btn-primary" href="/planes">VER PLANES</Link>
          <Link className="btn-ghost" href="/historia">Conocé mi historia</Link>
        </div>
      </div>
    </section>
  );
}
