import { expect, test, type Page } from "@playwright/test";
import { htmlCheck, waitForMessage } from "./support/mailpit";

/**
 * Formulario de contacto con Mailpit (CLGDC-202).
 *
 * El backend guarda el mensaje (`ContactMessage`) y lo reenvía a `CONTACT_TO` con `Reply-To` a
 * quien escribe. El remitente de prueba es `e2e-contacto-<timestamp>@e2e.lgdc.test`:
 * `scripts/e2e.sh` borra esos `ContactMessage` al terminar. El correo no se borra, queda en Mailpit
 * para revisarlo, así que la prueba lo busca por su asunto, único por corrida. Ojo: el backend
 * limita `POST /contact` a 5 por hora por IP.
 */

const NAME = "Ana María Fuentes";
/** El mensaje trae HTML y comillas: en la parte HTML del correo tiene que quedar escapado. */
const MESSAGE = 'Línea 1\n<b>negrita</b> & "comillas"';

/** Los campos se buscan por su etiqueta visible: de paso comprueba que estén bien asociadas. */
const field = (page: Page, label: string) => page.getByLabel(label, { exact: true });

test.describe("formulario de contacto", () => {
  test("el formulario de contacto envía un correo HTML con el mensaje escapado", async ({ page }) => {
    const stamp = Date.now();
    const email = `e2e-contacto-${stamp}@e2e.lgdc.test`;
    const subject = `Prueba e2e ${stamp}`;

    await page.goto("/contacto");
    await field(page, "Nombre completo").fill(NAME);
    await field(page, "Correo electrónico").fill(email);
    await field(page, "Asunto").fill(subject);
    await field(page, "Mensaje").fill(MESSAGE);
    await page.getByRole("button", { name: "Enviar mensaje" }).click();

    await expect(page.getByRole("heading", { name: "Mensaje enviado" })).toBeVisible();

    const message = await waitForMessage(`subject:"[Contacto] ${subject}"`);
    expect(message.Subject).toBe(`[Contacto] ${subject}`);
    expect(message.ReplyTo.map((replyTo) => replyTo.Address)).toEqual([email]);
    expect(message.Text).toContain("Línea 1");
    expect(message.Text).toContain(`Email: ${email}`);
    // Parte HTML de React Email: el texto del usuario va escapado y el salto de línea, como <br>.
    expect(message.HTML).toContain("&lt;b&gt;negrita&lt;/b&gt;");
    expect(message.HTML).not.toContain("<b>negrita</b>");
    expect(message.HTML).toContain("<br");
    expect(await htmlCheck(message.ID)).toBe(200);
  });
});
