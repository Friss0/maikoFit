import 'server-only';
import { createAdminClient } from './supabase/admin';
import { mpPayment, mpPreApproval, fetchAuthorizedPayment } from './mercadopago';
import { trackEvent, updateContactAttrs } from './brevo';

// Procesamiento de pagos compartido entre el webhook de MP y la página
// /checkout/exito (reconciliación activa por si el webhook se pierde).
// Regla de oro: NUNCA confiar en el payload del webhook — siempre re-consultar
// el recurso a la API de MP. Todos los writes son upserts sobre claves únicas
// (mp_payment_id / mp_preapproval_id) → procesar dos veces no duplica nada.

async function getCheckoutWithEmail(admin, checkoutId) {
  if (!checkoutId) return null;
  const { data } = await admin
    .from('checkouts')
    .select('*, profiles(email, full_name)')
    .eq('id', checkoutId)
    .maybeSingle();
  return data || null;
}

async function notifyPurchase(email, plan, amount) {
  if (!email) return;
  // Evento (dispara el journey "gracias por tu compra" y la exit-condition
  // del carrito abandonado) + atributos (segundo cinturón del journey).
  await trackEvent('purchase_completed', email, { plan, amount });
  await updateContactAttrs(email, {
    HA_COMPRADO: true,
    PLAN_COMPRADO: plan,
    FECHA_COMPRA: new Date().toISOString().slice(0, 10),
  });
}

const now = () => new Date().toISOString();

// ── topic "payment": pagos únicos (1 a 1) y también los cobros de suscripción ──
export async function processPayment(paymentId) {
  const payment = await mpPayment().get({ id: paymentId });
  const checkoutId = payment.external_reference || null;
  const admin = createAdminClient();

  const checkout = await getCheckoutWithEmail(admin, checkoutId);
  if (!checkout) {
    // Cobro de suscripción sin checkout matcheable u otro pago ajeno: log y listo.
    console.log(`[payments] payment ${paymentId} sin checkout asociado (ext_ref=${checkoutId}) — ignorado`);
    return { handled: false };
  }

  if (checkout.kind === 'subscription') {
    // Cobro mensual del plan Esencial que llegó por topic payment
    if (payment.status === 'approved' && checkout.mp_preapproval_id) {
      await admin
        .from('subscriptions')
        .update({ last_payment_at: now(), updated_at: now() })
        .eq('mp_preapproval_id', checkout.mp_preapproval_id);
    }
    return { handled: true, kind: 'subscription_charge' };
  }

  // Pago único (1 a 1)
  if (payment.status === 'approved') {
    await admin.from('orders').upsert(
      {
        user_id: checkout.user_id,
        checkout_id: checkout.id,
        mp_payment_id: String(payment.id),
        status: 'approved',
        amount: payment.transaction_amount ?? checkout.amount,
        paid_at: payment.date_approved || now(),
      },
      { onConflict: 'mp_payment_id' },
    );
    const wasCompleted = checkout.status === 'completed';
    await admin
      .from('checkouts')
      .update({ status: 'completed', updated_at: now() })
      .eq('id', checkout.id);
    // Brevo solo en la transición (no en webhooks repetidos)
    if (!wasCompleted) {
      await notifyPurchase(checkout.profiles?.email, checkout.plan_id, checkout.amount);
    }
  } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
    await admin.from('orders').upsert(
      {
        user_id: checkout.user_id,
        checkout_id: checkout.id,
        mp_payment_id: String(payment.id),
        status: 'rejected',
        amount: payment.transaction_amount ?? checkout.amount,
      },
      { onConflict: 'mp_payment_id' },
    );
    if (checkout.status !== 'completed') {
      await admin.from('checkouts').update({ status: 'failed', updated_at: now() }).eq('id', checkout.id);
    }
  }
  return { handled: true, status: payment.status };
}

// ── topic "subscription_preapproval": altas/bajas/pausas del contrato ──
export async function processPreapproval(preapprovalId) {
  const pre = await mpPreApproval().get({ id: preapprovalId });
  const admin = createAdminClient();
  const checkoutId = pre.external_reference || null;
  const checkout = await getCheckoutWithEmail(admin, checkoutId);

  const statusMap = {
    pending: 'pending',
    authorized: 'authorized',
    paused: 'paused',
    cancelled: 'cancelled',
  };
  const status = statusMap[pre.status] || 'pending';

  const { data: existing } = await admin
    .from('subscriptions')
    .select('id, status')
    .eq('mp_preapproval_id', String(pre.id))
    .maybeSingle();

  const row = {
    mp_preapproval_id: String(pre.id),
    status,
    amount: pre.auto_recurring?.transaction_amount ?? checkout?.amount ?? null,
    updated_at: now(),
    ...(status === 'cancelled' ? { cancelled_at: now() } : {}),
  };

  if (existing) {
    await admin.from('subscriptions').update(row).eq('id', existing.id);
  } else if (checkout) {
    await admin.from('subscriptions').upsert(
      { ...row, user_id: checkout.user_id, checkout_id: checkout.id },
      { onConflict: 'mp_preapproval_id' },
    );
  } else {
    console.log(`[payments] preapproval ${pre.id} sin checkout asociado — ignorado`);
    return { handled: false };
  }

  if (status === 'authorized') {
    const wasAuthorized = existing?.status === 'authorized';
    if (checkout) {
      const wasCompleted = checkout.status === 'completed';
      await admin.from('checkouts').update({ status: 'completed', updated_at: now() }).eq('id', checkout.id);
      if (!wasAuthorized && !wasCompleted) {
        await notifyPurchase(checkout.profiles?.email, checkout.plan_id, checkout.amount);
      }
    }
  } else if (status === 'cancelled' && checkout && checkout.status === 'started') {
    await admin.from('checkouts').update({ status: 'failed', updated_at: now() }).eq('id', checkout.id);
  }

  return { handled: true, status };
}

// ── topic "subscription_authorized_payment": cada cobro mensual recurrente ──
export async function processAuthorizedPayment(authorizedPaymentId) {
  const ap = await fetchAuthorizedPayment(authorizedPaymentId);
  const preapprovalId = ap.preapproval_id;
  if (!preapprovalId) return { handled: false };

  const paymentStatus = ap.payment?.status || ap.status;
  if (paymentStatus === 'approved' || paymentStatus === 'processed') {
    const admin = createAdminClient();
    await admin
      .from('subscriptions')
      .update({ last_payment_at: ap.date_created || now(), updated_at: now() })
      .eq('mp_preapproval_id', String(preapprovalId));
  }
  return { handled: true, status: paymentStatus };
}
