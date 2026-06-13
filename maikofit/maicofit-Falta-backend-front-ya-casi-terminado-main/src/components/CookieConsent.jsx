'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Banner de consentimiento de cookies. Aparece en la primera visita y guarda
// la decisión en localStorage para no volver a mostrarlo.
export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem('mf_cookie_consent')) setShow(true);
    } catch {}
  }, []);

  const decide = (value) => {
    try { localStorage.setItem('mf_cookie_consent', value); } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Aviso de cookies">
      <p className="cookie-text">
        Usamos cookies propias y de terceros para mejorar tu experiencia y entender cómo
        se usa el sitio. Podés leer más en nuestros{' '}
        <Link href="/terminos">Términos y política de cookies</Link>.
      </p>
      <div className="cookie-actions">
        <button className="cookie-btn cookie-btn--ghost" type="button" onClick={() => decide('rejected')}>
          Rechazar
        </button>
        <button className="cookie-btn cookie-btn--solid" type="button" onClick={() => decide('accepted')}>
          Aceptar
        </button>
      </div>
    </div>
  );
}
