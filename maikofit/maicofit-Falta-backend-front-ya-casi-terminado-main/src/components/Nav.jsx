import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavAuth from './NavAuth';

const links = [
  { label: 'Inicio', href: '/' },
  { label: 'Planes', href: '/planes' },
  { label: 'Proceso', href: '/proceso' },
  { label: 'Historia', href: '/historia' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);

  const navTo = (href) => {
    close();
    if (!href.includes('#') && href === pathname) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav id="nav" className={`nav${scrolled ? ' scrolled' : ''}${open ? ' nav-open' : ''}`}>
      <Link
        className="nav-logo"
        href="/"
        onClick={() => {
          close();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        MAICO<span>FIT</span>
      </Link>

      <ul id="nav-links-panel" className={`nav-links${open ? ' open' : ''}`}>
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} onClick={() => navTo(l.href)}>{l.label}</Link>
          </li>
        ))}
        <li className="nav-auth-mobile">
          <NavAuth onNavigate={close} />
        </li>
      </ul>

      <div className="nav-auth">
        <NavAuth />
      </div>

      <button
        className={`nav-hamburger${open ? ' active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        aria-controls="nav-links-panel"
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}
