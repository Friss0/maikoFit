const socials = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/maicofit',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@maico.fit',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  // WhatsApp se removió de acá: ya está el botón flotante de WA en toda la web (evita redundancia).
];

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sections = [
  { label: 'Inicio', href: '/' },
  { label: 'Planes', href: '/planes' },
  { label: 'Proceso', href: '/proceso' },
  { label: 'Historia', href: '/historia' },
];

export default function Footer() {
  const pathname = usePathname();

  const navTo = (href) => {
    if (href === pathname) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-logo">MAICO<span>FIT</span></div>
          <p className="footer-tagline">
            Mentalidad, entrenamiento y nutrición para convertirte en el hombre que querés ser.
          </p>
        </div>

        <nav className="footer-nav">
          <div className="footer-nav-title">Secciones</div>
          {sections.map((s) => (
            <Link key={s.href} href={s.href} onClick={() => navTo(s.href)}>
              {s.label}
            </Link>
          ))}
        </nav>

        <div className="footer-follow">
          <div className="footer-nav-title">Seguime</div>
          <div className="footer-social">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">
          © 2026 MaicoFit · Todos los derechos reservados ·{' '}
          <Link href="/terminos" className="footer-legal">Términos y Condiciones</Link>
        </div>
        <button
          className="footer-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Volver arriba"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>
    </footer>
  );
}
