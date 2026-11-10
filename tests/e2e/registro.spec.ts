import { randomBytes } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";
import { countMessagesTo, htmlCheck, waitForMessageTo } from "./support/mailpit";

/**
 * Registro por formulario con Mailpit (CLGDC-196).
 *
 * Las cuentas se crean con `e2e-registro-<timestamp>@e2e.lgdc.test` (nunca `@demo.lgdc.cl`, que
 * está reservado); `scripts/e2e.sh` las borra de la base al terminar, pase o no la suite. Los
 * correos no se borran: quedan en Mailpit (http://localhost:3019) para revisarlos, así que cada
 * aserción busca solo por la dirección única de su prueba. La contraseña se genera al azar en cada
 * corrida y no se imprime.
 */

const WELCOME_SUBJECT = "Te damos la bienvenida a La Guía de Chile";
const WELCOME_FROM = "noreply@notificaciones.laguiadechile.cl";
const FIRST_NAME = "Ana María";
const LAST_NAME = "Pérez";

/** En minúsculas, como lo guarda el backend. */
const uniqueEmail = () => `e2e-registro-${Date.now()}@e2e.lgdc.test`.toLowerCase();
const randomPassword = () => `E2e-${randomBytes(12).toString("base64url")}`;

/** Los campos se buscan por su etiqueta visible: de paso comprueba que estén bien asociadas. */
const field = (page: Page, label: string) => page.getByLabel(label, { exact: true });

test.describe("registro por formulario", () => {
  test("registro por formulario envía bienvenida", async ({ page }) => {
    const email = uniqueEmail();
    const password = randomPassword();

    await page.goto("/registro");
    await field(page, "Nombre").fill(FIRST_NAME);
    await field(page, "Apellido").fill(LAST_NAME);
    await field(page, "Email").fill(email);
    await field(page, "Contraseña").fill(password);
    await field(page, "Repite la contraseña").fill(password);
    await page.getByRole("checkbox", { name: /Acepto los términos y condiciones/ }).check();
    await page.getByRole("button", { name: "Crear cuenta" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("heading", { level: 1, name: `Hola, ${FIRST_NAME}` })).toBeVisible();

    const message = await waitForMessageTo(email);
    expect(message.To.map((to) => to.Address)).toEqual([email]);
    expect(message.Subject).toBe(WELCOME_SUBJECT);
    expect(message.From.Address).toBe(WELCOME_FROM);
    expect(message.Text).toContain(`Hola, ${FIRST_NAME}`);
    expect(message.Text).toContain("/dashboard");
    // Parte HTML de React Email (CLGDC-202), con la banda que sirve el front desde public/email.
    expect(message.HTML).toContain(`Hola, ${FIRST_NAME}:`);
    expect(message.HTML).toContain("/email/banda@2x.gif");
    expect(message.HTML).toContain("/dashboard");
    expect(await htmlCheck(message.ID)).toBe(200);
  });

  test("sin nombre ni apellido no crea la cuenta ni manda correo", async ({ page }) => {
    const email = uniqueEmail();
    const password = randomPassword();

    await page.goto("/registro");
    // Todo lleno salvo nombre y apellido: si algo se enviara, habría un correo para este email.
    await field(page, "Email").fill(email);
    await field(page, "Contraseña").fill(password);
    await field(page, "Repite la contraseña").fill(password);
    await page.getByRole("checkbox", { name: /Acepto los términos y condiciones/ }).check();

    const registerRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/auth/register")) registerRequests.push(request.url());
    });
    await page.getByRole("button", { name: "Crear cuenta" }).click();

    await expect(page.getByText("Escribe tu nombre")).toBeVisible();
    await expect(page.getByText("Escribe tu apellido")).toBeVisible();
    await expect(page).toHaveURL(/\/registro$/);
    // Sin request de registro no hay cuenta ni correo; Mailpit lo confirma.
    expect(registerRequests).toEqual([]);
    expect(await countMessagesTo(email)).toBe(0);
  });

  test("un nombre con texto que no es un nombre no se envía", async ({ page }) => {
    const email = uniqueEmail();
    const password = randomPassword();

    await page.goto("/registro");
    await field(page, "Nombre").fill("visita evil.cl");
    await field(page, "Apellido").fill(LAST_NAME);
    await field(page, "Email").fill(email);
    await field(page, "Contraseña").fill(password);
    await field(page, "Repite la contraseña").fill(password);
    await page.getByRole("checkbox", { name: /Acepto los términos y condiciones/ }).check();

    const registerRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/auth/register")) registerRequests.push(request.url());
    });
    await page.getByRole("button", { name: "Crear cuenta" }).click();

    await expect(page.getByText("Usa solo letras, espacios, guion o apóstrofo")).toBeVisible();
    await expect(page).toHaveURL(/\/registro$/);
    expect(registerRequests).toEqual([]);
  });
});
