'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './AuthForm.module.css';

const COPY = {
  login: {
    title: 'INICIAR SESIÓN',
    sub: 'Entrá a tu cuenta para gestionar tu plan.',
    cta: 'Entrar',
    busy: 'Entrando…',
    endpoint: '/api/auth/login',
    altText: '¿Todavía no tenés cuenta?',
    altLink: '/registro',
    altLabel: 'Registrate',
  },
  registro: {
    title: 'CREÁ TU CUENTA',
    sub: 'Es gratis. Con tu cuenta podés comprar un plan y gestionar tu suscripción.',
    cta: 'Crear cuenta',
    busy: 'Creando cuenta…',
    endpoint: '/api/auth/register',
    altText: '¿Ya tenés cuenta?',
    altLink: '/login',
    altLabel: 'Iniciá sesión',
  },
};

export default function AuthForm({ mode }) {
  const copy = COPY[mode];
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/cuenta';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);
    try {
      const res = await fetch(copy.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Algo salió mal. Probá de nuevo.');
        return;
      }
      if (data.needsEmailConfirm) {
        setNotice('¡Cuenta creada! Revisá tu email para confirmarla y después iniciá sesión.');
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError('Error de conexión. Revisá tu internet y probá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.sub}>{copy.sub}</p>

        {error && <p className={styles.error} role="alert">{error}</p>}
        {notice && <p className={styles.success} role="status">{notice}</p>}

        <form onSubmit={onSubmit} noValidate>
          {mode === 'registro' && (
            <label className={styles.field}>
              <span className={styles.label}>Nombre</span>
              <input
                className={styles.input}
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre"
              />
            </label>
          )}

          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <input
              className={styles.input}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Contraseña</span>
            <input
              className={styles.input}
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'registro' ? 'Mínimo 8 caracteres' : '••••••••'}
            />
          </label>

          <button
            className={`plan-btn plan-btn-solid ${styles.submit}`}
            type="submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? copy.busy : copy.cta}
          </button>
        </form>

        <p className={styles.alt}>
          {copy.altText} <Link href={`${copy.altLink}?next=${encodeURIComponent(next)}`}>{copy.altLabel}</Link>
        </p>
      </div>
    </div>
  );
}
