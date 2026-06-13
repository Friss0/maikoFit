import Link from 'next/link';
import styles from '../checkout.module.css';

export const metadata = { title: 'Pago no completado | MaicoFit' };

export default function CheckoutErrorPage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={`${styles.icon} ${styles.iconError}`} aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </div>
        <h1 className={styles.title}>EL PAGO NO SE COMPLETÓ</h1>
        <p className={styles.copy}>
          No te preocupes: no se te cobró nada. Puede ser un rechazo del banco o
          un error momentáneo. Probá de nuevo con otra tarjeta o escribile a Maico
          si necesitás ayuda.
        </p>
        <div className={styles.actions}>
          <Link className="plan-btn plan-btn-solid" href="/planes">Volver a intentar</Link>
          <a
            className="plan-btn plan-btn-outline"
            href="https://wa.me/541144036786?text=Hola%20Maico!%20Tuve%20un%20problema%20con%20el%20pago"
            target="_blank"
            rel="noreferrer"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
