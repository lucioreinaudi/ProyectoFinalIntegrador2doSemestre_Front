// @ts-check
import { test, expect } from '@playwright/test';

// Login y acceso a una ruta protegida, de punta a punta (SCRUM-97): front y back juntos.
// Necesita el back levantado en local. El usuario de prueba es un VECINO que ya exista
// en la base (se crea una vez desde /registro) y se pasa por variables de entorno:
//   PowerShell:  $env:TEST_EMAIL="..."; $env:TEST_PASS="..."
// Las credenciales nunca van en el repo.
const EMAIL = process.env.TEST_EMAIL;
const PASS = process.env.TEST_PASS;

// /mis-reportes es solo para vecinos (RutaProtegida en App.jsx).
const RUTA_PROTEGIDA = '/mis-reportes';

async function completarLogin(page, email, password) {
  await page.getByLabel('Correo electrónico').fill(email);
  await page.getByLabel('Contraseña', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
}

test('sin sesión, una ruta protegida redirige al login', async ({ page }) => {
  await page.goto(RUTA_PROTEGIDA);
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();
});

test('login correcto vuelve a la ruta protegida', async ({ page }) => {
  test.skip(!EMAIL || !PASS, 'Faltan TEST_EMAIL y TEST_PASS (usuario vecino de prueba)');

  // Entra a la ruta protegida sin sesion: lo manda al login...
  await page.goto(RUTA_PROTEGIDA);
  await expect(page).toHaveURL(/\/login$/);

  // ...y despues de loguearse vuelve a donde queria ir (redireccion de SCRUM-72).
  await completarLogin(page, EMAIL, PASS);
  await expect(page).toHaveURL(new RegExp(RUTA_PROTEGIDA + '$'));
  await expect(page.getByRole('heading', { name: 'Mis reportes', level: 1 })).toBeVisible();
});

test('login con contraseña incorrecta muestra el error', async ({ page }) => {
  // No hace falta el usuario de prueba: con cualquier email y una contraseña mala el
  // back responde 401 y el front muestra el mensaje. Si hay usuario de prueba, se usa ese.
  await page.goto('/login');
  await completarLogin(page, EMAIL || 'no-existe@test.com', 'contraseña-incorrecta');
  await expect(page.getByText('Email o contraseña incorrectos')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});
