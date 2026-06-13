import { NextResponse } from 'next/server';
import { createClient } from '@/src/lib/supabase/server';
import { createAdminClient } from '@/src/lib/supabase/admin';
import { upsertContact, trackEvent, generalListIds } from '@/src/lib/brevo';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  const { email, password, fullName } = await request.json().catch(() => ({}));

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Ingresá un email válido.' }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: 'La contraseña debe tener al menos 8 caracteres.' },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName || '' } },
  });

  if (error) {
    const msg = /already|registered|exists/i.test(error.message)
      ? 'Ese email ya está registrado. Probá iniciar sesión.'
      : 'No se pudo crear la cuenta. Probá de nuevo en unos minutos.';
    console.error('[auth/register]', error.message);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Brevo: contacto + evento user_registered (dispara el mail de bienvenida).
  // No bloqueante: si Brevo falla, queda encolado en brevo_jobs.
  await upsertContact(email, { NOMBRE: fullName || '' }, generalListIds());
  await trackEvent('user_registered', email, { nombre: fullName || '' });

  if (data.user?.id) {
    try {
      const admin = createAdminClient();
      await admin.from('profiles').update({ brevo_synced: true }).eq('id', data.user.id);
    } catch (err) {
      console.error('[auth/register] no se pudo marcar brevo_synced:', err.message);
    }
  }

  // Si "Confirm email" está activado en Supabase no hay sesión todavía
  return NextResponse.json({ ok: true, needsEmailConfirm: !data.session });
}
