'use client';

import { useState } from 'react';

export default function ExitPopup({ onClose }) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(''); // honeypot: queda vacío para humanos
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [error, setError] = useState('');

  const claim = async (e) => {
    e.preventDefault();
    setState('loading');
    setError('');
    try {
      const res = await fetch('/api/popup-lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, company }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState('error');
        setError(data.error || 'No se pudo guardar. Probá de nuevo.');
        return;
      }
      // Dejó su mail: no volver a interrumpirlo con el popup en este dispositivo
      try { localStorage.setItem('mf_discount_claimed', '1'); } catch {}
      setState('done');
    } catch {
      setState('error');
      setError('Error de conexión. Probá de nuevo.');
    }
  };

  return (
    <div className="popup-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="popup-box">
        <div className="popup-bar" />
        <button className="popup-close" onClick={onClose}>✕</button>

        <div className="popup-badge">Oferta · Solo este mes</div>
        <div className="popup-title">ESPERÁ UN SEGUNDO</div>
        <p className="popup-sub">
          Antes de irte, tenemos algo para vos.<br />
          El <strong>Plan Esencial</strong> con <b>10% de descuento</b> solo durante este mes.
        </p>

        <div className="popup-prices">
          <div className="popup-prices-row">
            <span className="popup-old">$12.900</span>
            <span className="popup-off">-10%</span>
          </div>
          <span className="popup-new">$11.600</span>
          <div className="popup-note">ARS / mes · suscripción mensual</div>
        </div>

        {state === 'done' ? (
          <p className="popup-sub" role="status" style={{ color: '#bbf7d0' }}>
            <strong>¡Listo!</strong> Te mandamos el descuento a tu mail.
            Revisá tu casilla (y spam, por las dudas).
          </p>
        ) : (
          <form onSubmit={claim}>
            {/* Honeypot anti-bot: oculto a la vista y a lectores de pantalla,
                fuera del tab order. Un humano nunca lo completa. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              aria-label="Tu email"
              autoComplete="email"
              style={{
                width: '100%',
                minHeight: '44px',
                padding: '0.7rem 0.9rem',
                marginBottom: '0.75rem',
                fontFamily: 'var(--body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
                background: 'var(--mid)',
                border: '1px solid var(--border)',
              }}
            />
            <button
              className="popup-btn popup-btn-mp"
              type="submit"
              disabled={state === 'loading'}
              aria-busy={state === 'loading'}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem', verticalAlign: '-3px' }}>
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {state === 'loading' ? 'Guardando…' : 'Quiero el descuento'}
            </button>
            {state === 'error' && (
              <p role="alert" style={{ color: '#f8b4b4', fontSize: '0.8rem', margin: '0 0 0.5rem' }}>
                {error}
              </p>
            )}
          </form>
        )}

        <button className="popup-decline" onClick={onClose}>
          No, prefiero pagar precio completo
        </button>
      </div>
    </div>
  );
}
