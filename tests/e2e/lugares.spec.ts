import { randomBytes } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";

/**
 * Lugares de las cuentas (CLGDC-209): una cuenta nueva publica un lugar desde el panel, con una
 * imagen subida por ella, y queda «En revisión» sin aparecer en `/lugares` hasta que el admin lo
 * apruebe.
 *
 * La cuenta es `e2e-registro-lugar-<timestamp>@e2e.lgdc.test` (cabe en el patrón que borra
 * `scripts/e2e.sh`), y el script borra antes sus lugares, porque `Place.owner` es `SetNull` y
 * quedarían sin dueño. El correo de bienvenida queda en Mailpit, como en `registro.spec.ts`. La
 * contraseña se genera al azar en cada corrida y no se imprime. Ojo: el backend limita
 * `POST /me/places` a 10 por hora por cuenta (aquí, una por corrida).
 */

const FIRST_NAME = "Lucía";
const LAST_NAME = "Rojas";

/** PNG de 1×1 px: el backend valida el formato por sus bytes iniciales. */
const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

/** Los campos se buscan por su etiqueta visible: de paso comprueba que estén bien asociadas. */
const field = (page: Page, label: string) => page.getByLabel(label, { exact: true });

async function register(page: Page, email: string) {
  const password = `E2e-${randomBytes(12).toString("base64url")}`;
  await page.goto("/registro");
  await field(page, "Nombre").fill(FIRST_NAME);
  await field(page, "Apellido").fill(LAST_NAME);
  await field(page, "Email").fill(email);
  await field(page, "Contraseña").fill(password);
  await field(page, "Repite la contraseña").fill(password);
  await page.getByRole("checkbox", { name: /Acepto los términos y condiciones/ }).check();
  await page.getByRole("button", { name: "Crear cuenta" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.describe("lugares de las cuentas", () => {
  test("una cuenta publica un lugar: queda en revisión y no sale en /lugares", async ({ page }) => {
    const stamp = Date.now();
    const email = `e2e-registro-lugar-${stamp}@e2e.lgdc.test`;
    const title = `Mirador e2e ${stamp}`;

    await register(page, email);

    // «Lugar» reemplazó a «Sugerir» en el selector del inicio y lleva al formulario del dueño.
    const chooser = page.locator("#publicar");
    await expect(chooser.getByRole("link", { name: "Lugar" })).toHaveAttribute("href", "/dashboard/lugares/nuevo");
    await expect(chooser.getByRole("link", { name: "Sugerir" })).toHaveCount(0);

    await page.goto("/dashboard/lugares/nuevo");
    await expect(page.getByRole("heading", { level: 1, name: "Publica un lugar" })).toBeVisible();
    // Los campos solo del admin no se ofrecen al dueño.
    await expect(field(page, "Slug")).toHaveCount(0);
    await expect(page.getByRole("checkbox", { name: "Destacado" })).toHaveCount(0);

    await page.getByRole("combobox", { name: /Ciudad/ }).click();
    await page.getByRole("option").first().click();
    await field(page, "Nombre").fill(title);
    await page.getByLabel(/^Descripción/).fill("Vista a la bahía al atardecer.\n\nTiene bancas y estacionamiento.");
    await page.getByLabel(/^Dirección/).fill("Paseo del Mirador 123");

    const upload = page.waitForResponse((r) => r.url().includes("/api/uploads") && r.request().method() === "POST");
    await page.locator('input[type="file"]').first().setInputFiles({
      name: "lugar.png",
      mimeType: "image/png",
      buffer: PNG_1X1,
    });
    expect((await upload).ok()).toBe(true);

    const submit = page.getByRole("button", { name: "Enviar a revisión" });
    await expect(submit).toBeEnabled();
    await submit.click();

    // «Mis lugares»: el lugar recién creado, «En revisión»; el menú ya muestra el grupo nuevo.
    await expect(page).toHaveURL(/\/dashboard\/lugares$/);
    await expect(page.getByRole("heading", { level: 1, name: "Mis lugares" })).toBeVisible();
    const row = page.getByRole("listitem").filter({ hasText: title });
    await expect(row).toBeVisible();
    await expect(row.getByText("En revisión", { exact: true })).toBeVisible();

    // Mientras está en revisión, el directorio público no lo muestra.
    await page.goto("/lugares");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page.getByText(title)).toHaveCount(0);
  });
});
