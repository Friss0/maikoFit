import { NextResponse } from 'next/server';
import { createClient } from '@/src/lib/supabase/server';
import { createAdminClient } from '@/src/lib/supabase/admin';
import { mpPreApproval } from '@/src/lib/mercadopago';

const now = () => new Date().toISOString();

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: sub } = await admin
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['pending', 'authorized', 'paused'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!sub) {
    return NextResponse.json({ error: 'No tenés una suscripción activa.' }, { status: 404 });
  }

  try {
    await mpPreApproval().update({
      id: sub.mp_preapproval_id,
      body: { status: 'cancelled' },
    });
  } catch (err) {
    console.error('[subscription/cancel] error en MP:', err?.message || err);
    return NextResponse.json(
      { error: 'Mercado Pago no respondió. Probá de nuevo en unos minutos.' },
      { status: 502 },
    );
  }

  // Update optimista; el webhook subscription_preapproval lo confirma después
  await admin
    .from('subscriptions')
    .update({ status: 'cancelled', cancelled_at: now(), updated_at: now() })
    .eq('id', sub.id);

  return NextResponse.json({ ok: true });
}
