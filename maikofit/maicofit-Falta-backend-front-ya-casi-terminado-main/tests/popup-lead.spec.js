import { test, expect } from '@playwright/test';

// API /api/popup-lead — barreras de validación y anti-spam.
// Se prueban solo los caminos que NO escriben en Supabase/Brevo
// (cortan antes), para no ensuciar datos reales.
test.describe('api popup-lead', () => {
  // API pura: con un project alcanza (evita doble conteo del rate-limit por IP).
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'API: corre en un solo project');
  });

  test('email inválido → rechazado (400, o 429 si el rate-limit ya saltó)', async ({ request }) => {
    const res = await request.post('/api/popup-lead', { data: { email: 'no-es-mail' } });
    expect([400, 429]).toContain(res.status());
  });

  test('honeypot lleno → 200 sin guardar', async ({ request }) => {
    const res = await request.post('/api/popup-lead', {
      data: { email: 'bot@x.com', company: 'Acme' },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });

  test('GET → 405', async ({ request }) => {
    const res = await request.get('/api/popup-lead');
    expect(res.status()).toBe(405);
  });
});
