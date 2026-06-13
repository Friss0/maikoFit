import { NextResponse } from 'next/server';
import { createAdminClient } from '@/src/lib/supabase/admin';
import { verifyWebhookSignature } from '@/src/lib/mercadopago';
import {
  processPayment,
  processPreapproval,
  processAuthorizedPayment,
} from '@/src/lib/payments';

// Webhook de Mercado Pago — el corazón del sistema.
// Topics configurados en el panel de MP: payment, subscription_preapproval,
// subscription_authorized_payment.
//
// Garantías:
// 1. Firma HMAC verificada (x-signature) → nadie puede falsificar un "pago".
// 2. Idempotencia vía webhook_events.dedup_key → un retry de MP no duplica nada.
// 3. Ante error de procesamiento devolvemos 500 → MP reintenta con backoff.
// 4. Brevo nunca bloquea la respuesta (outbox interno en lib/brevo).
export async function POST(request) {
  const url = new URL(request.url);
  const body = await request.json().catch(() => ({}));

  const dataId = url.searchParams.get('data.id') || body?.data?.id || url.searchParams.get('id');
  const type = url.searchParams.get('type') || body?.type || url.searchParams.get('topic');
  const action = body?.action || '';

  const validSignature = verifyWebhookSignature({
    signature: request.headers.get('x-signature'),
    requestId: request.headers.get('x-request-id'),
    dataId,
  });
  if (!validSignature) {
    return NextResponse.json({ error: 'firma inválida' }, { status: 401 });
  }

  // Ping de prueba del panel de MP (sin data.id): responder 200 y listo
  if (!dataId || !type) {
    return NextResponse.json({ received: true });
  }

  const admin = createAdminClient();
  const dedupKey = `${type}:${dataId}:${action}`;

  const { error: insErr } = await admin
    .from('webhook_events')
    .insert({ dedup_key: dedupKey, type, action, payload: body });

  if (insErr) {
    if (insErr.code === '23505') {
      // Ya lo recibimos antes: si quedó procesado, cortar acá (idempotencia).
      // Si quedó en error/received, lo reprocesamos (retry de MP).
      const { data: existing } = await admin
        .from('webhook_events')
        .select('status')
        .eq('dedup_key', dedupKey)
        .maybeSingle();
      if (existing?.status === 'processed') {
        return NextResponse.json({ received: true, duplicated: true });
      }
    } else {
      console.error('[webhook] no se pudo registrar el evento:', insErr.message);
    }
  }

  try {
    if (type === 'payment') {
      await processPayment(dataId);
    } else if (type === 'subscription_preapproval') {
      await processPreapproval(dataId);
    } else if (type === 'subscription_authorized_payment') {
      await processAuthorizedPayment(dataId);
    } else {
      console.log(`[webhook] tipo no manejado: ${type} (${dedupKey})`);
    }

    await admin
      .from('webhook_events')
      .update({ status: 'processed', processed_at: new Date().toISOString(), error: null })
      .eq('dedup_key', dedupKey);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`[webhook] error procesando ${dedupKey}:`, err?.message || err);
    await admin
      .from('webhook_events')
      .update({ status: 'error', error: String(err?.message || err) })
      .eq('dedup_key', dedupKey);
    // 500 → Mercado Pago reintenta más tarde
    return NextResponse.json({ error: 'processing failed' }, { status: 500 });
  }
}
