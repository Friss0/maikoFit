import { NextResponse } from 'next/server';
import { createClient } from '@/src/lib/supabase/server';

// Callback para OAuth (Google) y links de confirmación de email de Supabase.
export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/cuenta';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('[auth/callback]', error.message);
      return NextResponse.redirect(new URL('/login?error=callback', url.origin));
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
