'use client'
import { useEffect } from 'react';

// Dispara la animación de entrada agregando .anim-run al body.
// 800ms: el video del hero se ve solo (protagonista) un instante antes de que
// entren logo (izq), auth (der) y el contenido en stagger. Se bajó de 1500ms
// para mejorar el LCP (el título del hero entra antes) sin perder la intro.
export default function PageIntro() {
  useEffect(() => {
    const t = setTimeout(() => document.body.classList.add('anim-run'), 800);
    return () => clearTimeout(t);
  }, []);

  return null;
}
