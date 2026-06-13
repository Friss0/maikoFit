import 'server-only';
import crypto from 'node:crypto';
import { MercadoPagoConfig, Preference, PreApproval, Payment } from 'mercadopago';

let _config;
function config() {
  if (!process.env.MP_ACCESS_TOKEN) {
    throw new Error('MP_ACCESS_TOKEN no configurado en .env.local');
  }
  if (!_config) {
    _config = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
  }
  return _config;
}

export const mpPreference = () => new Preference(config());
export const mpPreApproval = () => new PreApproval(config());
export const mpPayment = () => new Payment(config());

// GET /authorized_payments/{id} — cobros recurrentes de una suscripción.
// El SDK v2 no lo expone, así que va con fetch directo.
export async function fetchAuthorizedPayment(id) {
  const res = await fetch(`https://api.mercadopago.com/authorized_payments/${id}`, {
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
  });
  if (!res.ok) {
    throw new Error(`MP authorized_payments/${id} respondió ${res.status}`);
  }
  return res.json();
}

// Verificación de firma de webhooks de MP.
// Header x-signature: "ts=<timestamp>,v1=<hmac>". El manifest se arma con
// data.id (en minúsculas si es alfanumérico), x-request-id y ts:
//   id:{data.id};request-id:{x-request-id};ts:{ts};
// Las partes sin valor se omiten del manifest (doc oficial de MP).
const SIGNATURE_TOLERANCE_MS = 5 * 60 * 1000;

export function verifyWebhookSignature({ signature, requestId, dataId }) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[mp] MP_WEBHOOK_SECRET no configurado — firma NO verificada (solo permitido en dev)');
      return true;
    }
    return false;
  }
  if (!signature) return false;

  const parts = Object.fromEntries(
    signature
      .split(',')
      .map((p) => p.trim().split('='))
      .filter((p) => p.length === 2)
      .map(([k, v]) => [k.trim(), v.trim()]),
  );
  const { ts, v1 } = parts;
  if (!ts || !v1) return false;

  // ts puede venir en segundos o milisegundos según la versión del panel
  const tsMs = String(ts).length > 10 ? Number(ts) : Number(ts) * 1000;
  if (!Number.isFinite(tsMs) || Math.abs(Date.now() - tsMs) > SIGNATURE_TOLERANCE_MS) {
    return false;
  }

  let manifest = '';
  if (dataId !== undefined && dataId !== null && dataId !== '') {
    const id = /[a-zA-Z]/.test(String(dataId)) ? String(dataId).toLowerCase() : String(dataId);
    manifest += `id:${id};`;
  }
  if (requestId) manifest += `request-id:${requestId};`;
  manifest += `ts:${ts};`;

  const hmac = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(v1));
  } catch {
    return false;
  }
}
