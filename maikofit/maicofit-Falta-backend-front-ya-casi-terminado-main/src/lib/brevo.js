import 'server-only';
import { createAdminClient } from './supabase/admin';

// Integración con Brevo (https://api.brevo.com/v3).
// Principio: ninguna llamada a Brevo puede bloquear ni romper el flujo principal
// (registro, checkout, webhook de MP). Si Brevo falla, el job se encola en
// brevo_jobs y lo reintenta /api/jobs/brevo.

const BASE = 'https://api.brevo.com/v3';
const TIMEOUT_MS = 5000;

async function brevoFetch(path, method, body) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY no configurada');
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    // 2xx ok; Brevo devuelve 204 en updates y 201/204 en creates
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Brevo ${res.status} en ${method} ${path}: ${text}`);
    }
    return { ok: true };
  } finally {
    clearTimeout(timer);
  }
}

// Ejecuta directo (la usa también el reintentador de /api/jobs/brevo)
export function executeBrevoJob({ path, method, body }) {
  return brevoFetch(path, method, body);
}

async function safeCall(kind, path, method, body) {
  try {
    return await brevoFetch(path, method, body);
  } catch (err) {
    console.error(`[brevo] fallo ${kind} (${method} ${path}):`, err.message);
    try {
      const admin = createAdminClient();
      await admin.from('brevo_jobs').insert({ kind, payload: { path, method, body } });
      return { queued: true };
    } catch (err2) {
      console.error('[brevo] tampoco se pudo encolar el reintento:', err2.message);
      return { failed: true };
    }
  }
}

// Crea o actualiza un contacto. listIds: array de IDs numéricos de listas de Brevo.
export function upsertContact(email, attributes = {}, listIds = []) {
  const body = { email, attributes, updateEnabled: true };
  const ids = listIds.filter((n) => Number.isFinite(n));
  if (ids.length) body.listIds = ids;
  return safeCall('contact_upsert', '/contacts', 'POST', body);
}

// Evento custom: dispara las automations configuradas en Brevo.
// Eventos usados: user_registered, checkout_started, purchase_completed, popup_discount_claimed
export function trackEvent(eventName, email, properties = {}) {
  return safeCall('event', '/events', 'POST', {
    event_name: eventName,
    identifiers: { email_id: email },
    event_properties: properties,
  });
}

// Actualiza atributos del contacto (HA_COMPRADO, PLAN_COMPRADO, FECHA_COMPRA…).
// Es el "segundo cinturón" que frena el journey de carrito abandonado.
export function updateContactAttrs(email, attributes) {
  return safeCall('attr_update', `/contacts/${encodeURIComponent(email)}`, 'PUT', {
    attributes,
  });
}

export function generalListIds() {
  const id = parseInt(process.env.BREVO_LIST_ID_GENERAL, 10);
  return Number.isFinite(id) ? [id] : [];
}

export function discountListIds() {
  const id = parseInt(process.env.BREVO_LIST_ID_DESCUENTO, 10);
  return Number.isFinite(id) ? [id] : [];
}
