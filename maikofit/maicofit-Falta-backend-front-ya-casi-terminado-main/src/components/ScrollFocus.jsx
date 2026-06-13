'use client'
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// En dispositivos táctiles (sin hover) marca con .in-focus el elemento
// [data-focus] que cruza la banda central del viewport (24% del alto).
// El CSS aplica a .in-focus los mismos estilos que al :hover de desktop,
// así la "iluminación" acompaña el scroll sección por sección.
export default function ScrollFocus() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(hover: hover)').matches) return;
    const els = document.querySelectorAll('[data-focus]');
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          e.target.classList.toggle('in-focus', e.isIntersecting)
        );
      },
      { rootMargin: '-38% 0px -38% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]); // re-escanear en cada navegación client-side

  return null;
}
