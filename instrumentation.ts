/**
 * Se ejecuta una vez al arrancar el servidor de Next.
 * En Node instala el gancho que guarda la IP del socket de cada petición
 * (`lib/auth/socket-ip.ts`), que los Route Handlers de auth reenvían al backend.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { installSocketIpCapture } = await import("@/lib/auth/socket-ip");
    installSocketIpCapture();
  }
}
