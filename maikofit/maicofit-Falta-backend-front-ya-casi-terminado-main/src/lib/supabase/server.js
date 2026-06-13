import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Cliente de Supabase para Server Components y Route Handlers.
// Lee/escribe la sesión en las cookies del request.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll desde un Server Component (sin response): lo maneja proxy.js
          }
        },
      },
    },
  );
}
