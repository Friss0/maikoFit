import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Next 16: proxy.js reemplaza a middleware.js (misma API).
// Refresca la sesión de Supabase en las cookies y protege /cuenta.
export default async function proxy(request) {
  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && request.nextUrl.pathname.startsWith('/cuenta')) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.search = '';
      url.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  } catch (err) {
    // Supabase sin configurar o caído: no bloquear la navegación pública
    console.error('[proxy] error refrescando sesión:', err?.message);
  }

  return response;
}

export const config = {
  matcher: ['/cuenta/:path*', '/login', '/registro'],
};
