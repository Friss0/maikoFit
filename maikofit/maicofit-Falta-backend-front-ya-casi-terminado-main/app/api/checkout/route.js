import { NextResponse } from 'next/server';
import { createClient } from '@/src/lib/supabase/server';
import { createAdminClient } from '@/src/lib/supabase/admin';
import { getPlan } from '@/src/lib/plans';
import { mpPreference, mpPreApproval } from '@/src/lib/mercadopago';
import { trackEvent } from '@/src/lib/brevo';

const now = () => new Date().toISOString();

// POST { planId: 'esencial' | '1a1', discount?: boolean }
// → crea el checkout en DB, dispara checkout_started a Brevo y devuelve
//   la URL de Mercado Pago (init_point) para redirigir al usuario.
export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Tenés que iniciar sesión para comprar.' }, { status: 401 });
  }

  const { planId, discount } = await request.json().catch(() => ({}));
  const plan = getPlan(planId);
  if (!plan) {
    return NextResponse.json({ error: 'Plan inválido.' }, { status: 400 });
  }

  const admin = createAdminClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006';

  // El 10% off NO se decide en el browser: solo aplica si este email reclamó
  // el descuento dejando su mail en el popup (quedó en popup_leads). Así el
  // descuento es el incentivo real para sumarse al newsletter, y nadie puede
  // forzar el precio rebajado mandando discount:true a mano.
  let useDiscount = false;
  if (discount && plan.discountAmount && user.email) {
    const { data: lead } = await admin
      .from('popup_leads')
      .select('email')
      .eq('email', user.email.toLowerCase())
      .maybeSingle();
    useDiscount = Boolean(lead);
  }
  const amount = useDiscount ? plan.discountAmount : plan.amount;

  if (plan.kind === 'subscription') {
    const { data: existing } = await admin
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .in('status', ['pending', 'authorized'])
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        { error: 'Ya tenés una suscripción activa. Podés gestionarla desde Mi cuenta.' },
        { status: 409 },
      );
    }
  }

  const { data: checkout, error: ckErr } = await admin
    .from('checkouts')
    .insert({
      user_id: user.id,
      plan_id: plan.id,
      kind: plan.kind,
      amount,
      discount_applied: useDiscount,
    })
    .select()
    .single();
  if (ckErr || !checkout) {
    console.error('[checkout] error creando checkout:', ckErr?.message);
    return NextResponse.json({ error: 'No se pudo iniciar el checkout.' }, { status: 500 });
  }

  // Dispara el journey de carrito abandonado en Brevo (no bloqueante)
  await trackEvent('checkout_started', user.email, { plan: plan.id, amount });

  try {
    let initPoint;

    if (plan.kind === 'one_time') {
      const pref = await mpPreference().create({
        body: {
          items: [
            {
              id: plan.id,
              title: plan.title,
              quantity: 1,
              unit_price: amount,
              currency_id: plan.currency,
            },
          ],
          external_reference: checkout.id,
          payer: { email: user.email },
          back_urls: {
            success: `${appUrl}/checkout/exito`,
            failure: `${appUrl}/checkout/error`,
            pending: `${appUrl}/checkout/pendiente`,
          },
          auto_return: 'approved',
          notification_url: `${appUrl}/api/webhooks/mercadopago`,
          metadata: { user_id: user.id, plan_id: plan.id },
          statement_descriptor: 'MAICOFIT',
        },
      });
      await admin
        .from('checkouts')
        .update({ mp_preference_id: pref.id, status: 'pending', updated_at: now() })
        .eq('id', checkout.id);
      initPoint = pref.init_point;
    } else {
      const pre = await mpPreApproval().create({
        body: {
          reason: plan.title,
          external_reference: checkout.id,
          payer_email: user.email,
          auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: amount,
            currency_id: plan.currency,
          },
          back_url: `${appUrl}/checkout/exito`,
          status: 'pending',
        },
      });
      await admin
        .from('checkouts')
        .update({ mp_preapproval_id: pre.id, status: 'pending', updated_at: now() })
        .eq('id', checkout.id);
      await admin.from('subscriptions').upsert(
        {
          user_id: user.id,
          checkout_id: checkout.id,
          mp_preapproval_id: String(pre.id),
          status: 'pending',
          amount,
        },
        { onConflict: 'mp_preapproval_id' },
      );
      initPoint = pre.init_point;
    }

    return NextResponse.json({ initPoint });
  } catch (err) {
    console.error('[checkout] error con Mercado Pago:', err?.message || err);
    await admin.from('checkouts').update({ status: 'failed', updated_at: now() }).eq('id', checkout.id);
    return NextResponse.json(
      { error: 'No se pudo conectar con Mercado Pago. Probá de nuevo en unos minutos.' },
      { status: 502 },
    );
  }
}
