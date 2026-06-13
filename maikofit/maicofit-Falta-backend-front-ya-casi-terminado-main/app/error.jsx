'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './checkout/checkout.module.css';

// Error boundary de la app. Next lo monta cuando una ruta tira en runtime.
export default function Error({ error, reset }) {
  useEffect(() => {
    // Log para observabilidad; en prod lo levanta el runtime de Vercel.
    console.error('[app/error]', error);
  }, [error]);

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={`${styles.icon} ${styles.iconError}`} aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4M12 17h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
        </div>
        <h1 className={styles.title}>ALGO SALIÓ MAL</h1>
        <p className={styles.copy}>
          Tuvimos un problema momentáneo de nuestro lado. Probá de nuevo; si sigue
          pasando, escribile a Maico y lo resolvemos.
        </p>
        <div className={styles.actions}>
          <button className="plan-btn plan-btn-solid" type="button" onClick={() => reset()}>
            Reintentar
          </button>
          <Link className="plan-btn plan-btn-outline" href="/">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
