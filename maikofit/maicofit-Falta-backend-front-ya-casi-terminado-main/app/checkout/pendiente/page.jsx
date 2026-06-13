import Link from 'next/link';
import styles from '../checkout.module.css';

export const metadata = { title: 'Pago pendiente | MaicoFit' };

export default function CheckoutPendientePage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={`${styles.icon} ${styles.iconPending}`} aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <h1 className={styles.title}>PAGO EN PROCESO</h1>
        <p className={styles.copy}>
          Tu pago está siendo procesado por Mercado Pago. Apenas se acredite te
          llega un mail de confirmación con el contenido de tu plan. Podés ver el
          estado en cualquier momento desde tu cuenta.
        </p>
        <div className={styles.actions}>
          <Link className="plan-btn plan-btn-solid" href="/cuenta">Ver mi cuenta</Link>
          <Link className="plan-btn plan-btn-outline" href="/">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
