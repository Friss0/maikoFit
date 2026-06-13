import Link from 'next/link';
import styles from './checkout/checkout.module.css';

export const metadata = { title: 'Página no encontrada | MaicoFit' };

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.icon} aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <h1 className={styles.title}>ESTA PÁGINA NO EXISTE</h1>
        <p className={styles.copy}>
          El link que seguiste no lleva a ningún lado. Puede que la página se haya
          movido. Volvé al inicio y seguí desde ahí.
        </p>
        <div className={styles.actions}>
          <Link className="plan-btn plan-btn-solid" href="/">Volver al inicio</Link>
          <Link className="plan-btn plan-btn-outline" href="/planes">Ver los planes</Link>
        </div>
      </div>
    </div>
  );
}
