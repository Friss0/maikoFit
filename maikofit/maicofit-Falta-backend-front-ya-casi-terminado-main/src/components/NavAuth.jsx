'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase/client';

// Reemplaza los botones placeholder de login/registro del nav.
// undefined = cargando (no parpadear), null = sin sesión, objeto = logueado.
export default function NavAuth({ onNavigate }) {
  const [user, setUser] = useState(undefined);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    let subscription;
    try {
      const supabase = createClient();
      supabase.auth
        .getUser()
        .then(({ data }) => mounted && setUser(data?.user ?? null))
        .catch(() => mounted && setUser(null));
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (mounted) setUser(session?.user ?? null);
      });
      subscription = data?.subscription;
    } catch {
      // Supabase sin configurar: mostrar los links igual
      setUser(null);
    }
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      /* sin red: igual limpiamos el estado local */
    }
    setUser(null);
    onNavigate?.();
    router.push('/');
    router.refresh();
  };

  if (user === undefined) return null;

  if (user) {
    return (
      <>
        <Link className="nav-login" href="/cuenta" onClick={onNavigate}>
          Mi cuenta
        </Link>
        <button className="nav-cta nav-register" type="button" onClick={logout}>
          Salir
        </button>
      </>
    );
  }

  return (
    <>
      <Link className="nav-login" href="/login" onClick={onNavigate}>
        Iniciar sesión
      </Link>
      <Link className="nav-cta nav-register" href="/registro" onClick={onNavigate}>
        Registrarse
      </Link>
    </>
  );
}
