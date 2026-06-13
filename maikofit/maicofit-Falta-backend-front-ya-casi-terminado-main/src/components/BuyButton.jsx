'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Botón de compra: POST /api/checkout → redirect a Mercado Pago.
// Si no hay sesión, manda a /login y vuelve a esta página al entrar.
export default function BuyButton({
  planId,
  discount = false,
  className = 'plan-btn plan-btn-solid',
  children,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const buy = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ planId, discount }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(pathname || '/planes')}`);
        return;
      }
      if (!res.ok || !data.initPoint) {
        setError(data.error || 'No se pudo iniciar el pago. Probá de nuevo.');
        return;
      }
      window.location.href = data.initPoint;
    } catch {
      setError('Error de conexión. Probá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={className}
        type="button"
        onClick={buy}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? 'Conectando con Mercado Pago…' : children}
      </button>
      {error && (
        <p role="alert" style={{ color: '#f8b4b4', fontSize: '0.8rem', marginTop: '0.5rem', lineHeight: 1.4 }}>
          {error}
        </p>
      )}
    </>
  );
}
