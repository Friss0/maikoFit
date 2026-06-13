// Fuente de verdad de planes y precios — se usa SOLO del lado del servidor.
// El navegador nunca manda montos: manda un planId y el monto sale de acá.
// Si cambian los precios en src/components/Plans.jsx, actualizar también este archivo.

export const PLANS = {
  esencial: {
    id: 'esencial',
    name: 'Plan Esencial',
    kind: 'subscription',
    amount: 12900,
    discountAmount: 11600, // precio con el 10% off del exit popup
    currency: 'ARS',
    title: 'MaicoFit — Plan Esencial (suscripción mensual)',
  },
  '1a1': {
    id: '1a1',
    name: 'Programa 1 a 1 — 3 meses',
    kind: 'one_time',
    amount: 397000,
    currency: 'ARS',
    title: 'MaicoFit — Programa 1 a 1 (3 meses)',
  },
};

export function getPlan(planId) {
  return PLANS[planId] || null;
}
