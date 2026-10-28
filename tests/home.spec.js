// @ts-check
import { test, expect } from '@playwright/test';

// Prueba minima para comprobar que Playwright esta bien configurado: el Home es
// publico, asi que carga sin sesion y sin usuario de prueba. Las pruebas de login
// y de rutas protegidas van en auth.spec.js (SCRUM-97).
test('el Home carga sin sesion', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Conectar Laboulaye', level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ingresar' })).toBeVisible();
});
