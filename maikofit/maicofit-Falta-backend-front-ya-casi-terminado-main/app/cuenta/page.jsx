import { redirect } from 'next/navigation';
import { createClient } from '@/src/lib/supabase/server';
import { createAdminClient } from '@/src/lib/supabase/admin';
import AccountPanel from '@/src/components/AccountPanel';

export const metadata = { title: 'Mi cuenta | MaicoFit' };
export const dynamic = 'force-dynamic';

export default async function CuentaPage() {
  let user = null;
  try {
    const supabase = await createClient();
    ({
      data: { user },
    } = await supabase.auth.getUser());
  } catch (err) {
    // Supabase sin configurar o caído: tratar como sesión inexistente
    console.error('[cuenta] no se pudo verificar la sesión:', err?.message);
  }
  if (!user) redirect('/login?next=/cuenta');

  const admin = createAdminClient();
  const [{ data: profile }, { data: subscription }, { data: orders }] = await Promise.all([
    admin.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    admin
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['pending', 'authorized', 'paused'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    admin
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ]);

  return (
    <AccountPanel
      email={user.email}
      profile={profile}
      subscription={subscription}
      orders={orders || []}
    />
  );
}
