'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './AccountPanel.module.css';

const SUB_STATUS = {
  pending: { label: 'Pendiente de pago', cls: 'badgePending' },
  authorized: { label: 'Activa', cls: 'badgeActive' },
  paused: { label: 'Pausada', cls: 'badgePending' },
  cancelled: { label: 'Cancelada', cls: 'badgeOff' },
};

const ORDER_STATUS = {
  approved: { label: 'Pagado', cls: 'badgeActive' },
  pending: { label: 'Pendiente', cls: 'badgePending' },
  rejected: { label: 'Rechazado', cls: 'badgeOff' },
  refunded: { label: 'Reembolsado', cls: 'badgeOff' },
};

const fmtMoney = (n) =>
  n == null ? '—' : `$${Number(n).toLocaleString('es-AR')}`;

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

export default function AccountPanel({ email, profile, subscription, orders }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');

  const cancelSubscription = async () => {
    setCancelling(true);
    setError('');
    try {
      const res = await fetch('/api/subscription/cancel', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'No se pudo cancelar. Probá de nuevo o escribinos.');
        return;
      }
      setConfirming(false);
      router.refresh();
    } catch {
      setError('Error de conexión. Probá de nuevo.');
    } finally {
      setCancelling(false);
    }
  };

  const subStatus = subscription ? SUB_STATUS[subscription.status] || SUB_STATUS.pending : null;

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <h1 className={styles.title}>MI CUENTA</h1>
        <p className={styles.email}>
          {profile?.full_name ? `${profile.full_name} · ` : ''}{email}
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Suscripción — Plan Esencial</h2>
          {subscription ? (
            <>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Estado</span>
                <span className={`${styles.badge} ${styles[subStatus.cls]}`}>{subStatus.label}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Monto mensual</span>
                <span className={styles.rowValue}>{fmtMoney(subscription.amount)} ARS</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Último cobro</span>
                <span className={styles.rowValue}>{fmtDate(subscription.last_payment_at)}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Suscripto desde</span>
                <span className={styles.rowValue}>{fmtDate(subscription.created_at)}</span>
              </div>

              {!confirming ? (
                <button className={styles.cancelBtn} type="button" onClick={() => setConfirming(true)}>
                  Cancelar suscripción
                </button>
              ) : (
                <div className={styles.cancelConfirm}>
                  <p>
                    ¿Seguro que querés cancelar? Vas a perder el acceso al contenido
                    y a la comunidad al final del período ya pagado.
                  </p>
                  <div className={styles.cancelActions}>
                    <button
                      className={styles.cancelBtn}
                      type="button"
                      onClick={cancelSubscription}
                      disabled={cancelling}
                      aria-busy={cancelling}
                    >
                      {cancelling ? 'Cancelando…' : 'Sí, cancelar'}
                    </button>
                    <button
                      className="plan-btn plan-btn-outline"
                      type="button"
                      onClick={() => setConfirming(false)}
                      disabled={cancelling}
                    >
                      No, mantener mi plan
                    </button>
                  </div>
                </div>
              )}
              {error && <p className={styles.error} role="alert">{error}</p>}
            </>
          ) : (
            <p className={styles.empty}>
              No tenés una suscripción activa. <Link href="/planes">Mirá los planes</Link> para
              arrancar tu transformación.
            </p>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Compras — Programa 1 a 1</h2>
          {orders.length ? (
            orders.map((order) => {
              const st = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
              return (
                <div className={styles.row} key={order.id}>
                  <span className={styles.rowLabel}>{fmtDate(order.paid_at || order.created_at)}</span>
                  <span className={styles.rowValue}>
                    {fmtMoney(order.amount)} ARS{' '}
                    <span className={`${styles.badge} ${styles[st.cls]}`}>{st.label}</span>
                  </span>
                </div>
              );
            })
          ) : (
            <p className={styles.empty}>Todavía no compraste el programa 1 a 1.</p>
          )}
        </section>
      </div>
    </div>
  );
}
