import { test, expect } from '@playwright/test';

// Menú hamburguesa (solo mobile: en desktop el botón está oculto).
test.describe('nav mobile', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'solo mobile');
  });

  test('abre, cierra y navega', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2600);

    const ham = page.locator('.nav-hamburger');
    const panel = page.locator('#nav-links-panel');

    // Touch target >= 44x44
    const box = await ham.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);

    // Cerrado al cargar
    await expect(ham).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toHaveCSS('opacity', '0');

    // Abrir
    await ham.click();
    await expect(ham).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toHaveCSS('opacity', '1');

    // Navegar cierra el panel y cambia de ruta
    await panel.getByRole('link', { name: 'Planes' }).click();
    await expect(page).toHaveURL(/\/planes$/);
    await expect(ham).toHaveAttribute('aria-expanded', 'false');
  });
});
