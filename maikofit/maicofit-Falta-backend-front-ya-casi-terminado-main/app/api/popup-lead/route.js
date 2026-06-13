import { NextResponse } from 'next/server';
import { createAdminClient } from '@/src/lib/supabase/admin';
import { upsertContact, trackEvent, discountListIds } from '@/src/lib/brevo';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limit básico en memoria: máx 5 envíos por IP cada 10 min.
// En serverless es por-instancia (se resetea en cold start) — alcanza como
// primera barrera anti-flood; el control fuerte de duplicados es el upsert por email.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map(); // ip -> number[] (timestamps)

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // techo de memoria
  return recent.length > MAX_HITS;
}

// Captura el email del exit popup (10% off) y lo manda a la lista de
// descuento de Brevo, donde un journey le envía el cupón/recordatorio.
export async function POST(request) {
  const { email, company } = await request.json().catch(() => ({}));

  // Honeypot: un campo oculto que solo un bot completa. Si viene con algo,
  // respondemos ok sin guardar nada (no le damos pista al bot).
  if (company) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Demasiados intentos. Probá en un rato.' }, { status: 429 });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Ingresá un email válido.' }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();
  const admin = createAdminClient();

  const { error } = await admin
    .from('popup_leads')
    .upsert({ email: normalized }, { onConflict: 'email' });
  if (error) {
    console.error('[popup-lead] error guardando lead:', error.message);
    return NextResponse.json({ error: 'No se pudo guardar. Probá de nuevo.' }, { status: 500 });
  }

  const result = await upsertContact(normalized, {}, discountListIds());
  await trackEvent('popup_discount_claimed', normalized, { plan: 'esencial', descuento: '10%' });

  if (result?.ok) {
    await admin.from('popup_leads').update({ synced_to_brevo: true }).eq('email', normalized);
  }

  return NextResponse.json({ ok: true });
}
