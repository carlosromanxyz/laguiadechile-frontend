import "server-only";

/**
 * Error de un servicio externo con el estado HTTP y el mensaje que debe devolver el route
 * handler que lo envuelve.
 */
export class ExternalServiceError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ExternalServiceError";
  }
}
