import { NextResponse } from 'next/server';
import { createClient } from '@/src/lib/supabase/server';

export async function POST(request) {
  const { email, password } = await request.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: 'Completá email y contraseña.' }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const msg = /confirm/i.test(error.message)
      ? 'Tenés que confirmar tu email antes de entrar. Revisá tu casilla.'
      : 'Email o contraseña incorrectos.';
    return NextResponse.json({ error: msg }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
