import Link from 'next/link';
import { processPayment, processPreapproval } from '@/src/lib/payments';
import styles from '../checkout.module.css';

export const metadata = { title: 'Pago recibido | MaicoFit' };
export const dynamic = 'force-dynamic';

// Página de vuelta de Mercado Pago. La verdad del pago la escribe el webhook,
// pero acá hacemos una reconciliación activa por si el webhook se pierde:
// re-consultamos el recurso a MP y actualizamos la DB (es idempotente).
export default async function CheckoutExitoPage({ searchParams }) {
  const params = await searchParams;
  const paymentId = params.payment_id || params.collection_id;
  const preapprovalId = params.preapproval_id;

  try {
    if (paymentId && paymentId !== 'null') {
      await processPayment(paymentId);
    } else if (preapprovalId) {
      await processPreapproval(preapprovalId);
    }
  } catch (err) {
    // No romper la UX: el webhook de MP lo va a terminar de confirmar
    console.error('[checkout/exito] reconciliación falló:', err?.message);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={`${styles.icon} ${styles.iconOk}`} aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className={styles.title}>¡PAGO CONFIRMADO!</h1>
        <p className={styles.copy}>
          Gracias por confiar en <strong>MaicoFit</strong>. En unos minutos te llega un
          mail con todos los detalles y el contenido de tu plan. Revisá también la
          carpeta de spam por las dudas.
        </p>
        <div className={styles.actions}>
          <Link className="plan-btn plan-btn-solid" href="/cuenta">Ver mi cuenta</Link>
          <Link className="plan-btn plan-btn-outline" href="/">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
