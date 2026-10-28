// @ts-check
import { defineConfig, devices } from '@playwright/test';

// Pruebas de punta a punta con Playwright (SCRUM-95).
// Abren un navegador real contra el front (Vite) y el back que este corriendo en local,
// asi que prueban los dos juntos. Ver tests/ y el README para correrlas.
//
// Antes de correrlas:
// - El back tiene que estar levantado en http://localhost:8080 (desde IntelliJ).
// - Las pruebas que inician sesion leen el usuario de prueba de las variables de entorno
//   TEST_EMAIL y TEST_PASS (nunca van en el repo).
export default defineConfig({
  testDir: './tests',
  // Si quedo un test.only olvidado, en un entorno de CI falla en vez de saltear el resto.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    // Asi los tests usan rutas cortas: page.goto('/login').
    baseURL: 'http://localhost:5173',
    // Si un test falla al reintentarlo, guarda la traza para verla con show-report.
    trace: 'on-first-retry',
  },
  // Solo Chromium: alcanza para lo que se pide y es el mas rapido de instalar.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Levanta el front solo (npm run dev). Si ya estaba corriendo, usa ese.
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 60000,
  },
});
