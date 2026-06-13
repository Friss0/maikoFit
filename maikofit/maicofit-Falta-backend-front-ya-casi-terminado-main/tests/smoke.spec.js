import { test, expect } from '@playwright/test';

const PAGES = ['/', '/planes', '/proceso', '/historia'];

// Smoke de las 4 páginas en mobile y desktop (ambos projects):
// sin scroll horizontal, exactamente un h1, sin errores de consola.
for (const path of PAGES) {
  test(`smoke ${path}`, async ({ page }) => {
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(String(e)));

    // domcontentloaded (no 'load'/'networkidle'): el hero tiene videos que
    // mantienen la red/el load activos y harían colgar el test en webkit.
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2600); // deja terminar la intro

    // Cero scroll horizontal
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, 'scroll horizontal').toBeLessThanOrEqual(0);

    // Un único h1
    await expect(page.locator('h1')).toHaveCount(1);

    // Sin errores de consola
    expect(errors, errors.join('\n')).toHaveLength(0);
  });
}
