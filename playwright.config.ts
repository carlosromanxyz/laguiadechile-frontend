import { defineConfig, devices } from "@playwright/test";

/**
 * Suite e2e (CLGDC-196). Se corre con `scripts/e2e.sh`, que levanta la imagen
 * `mcr.microsoft.com/playwright:v1.64.0-noble` en la red del contenedor del front: ahí
 * `localhost:3000` es el dev server y `mailpit:8025` es la API de Mailpit. Sin CI ni hooks.
 */
export default defineConfig({
  testDir: "tests/e2e",
  // `scripts/e2e.sh` monta el árbol en solo lectura y pasa una carpeta escribible dentro de
  // test-results/ (Playwright borra y recrea outputDir, y un punto de montaje no se puede borrar).
  outputDir: process.env.E2E_OUTPUT_DIR ?? "test-results",
  retries: 0,
  workers: 1,
  fullyParallel: false,
  reporter: "list",
  // El dev server compila las rutas la primera vez que se piden: margen amplio.
  timeout: 90_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    headless: true,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
