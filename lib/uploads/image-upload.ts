/**
 * Subida de imágenes desde el navegador a `POST /api/uploads` (route handler del front, que la
 * reenvía al backend con el JWT de la cookie httpOnly).
 *
 * Sin React ni `server-only`: lo usan `LDCImageUpload` y `LDCImageGallery`. Usa
 * `XMLHttpRequest` porque `fetch` no informa el avance de la subida.
 */

/** Tipos que acepta el backend (los vuelve a validar por sus bytes iniciales). */
export const IMAGE_UPLOAD_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const IMAGE_UPLOAD_ACCEPT = IMAGE_UPLOAD_TYPES.join(",");
/** 5 MB, igual que `MAX_UPLOAD_BYTES` del backend. */
export const IMAGE_UPLOAD_MAX_BYTES = 5 * 1024 * 1024;

export interface IUploadedImage {
  /** Clave en el bucket: `u/<userId>/<uuid>.<ext>` */
  key: string;
  /** URL pública: `/media/u/<userId>/<uuid>.<ext>` */
  url: string;
}

const sizeFormat = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 1 });

/** «2,1 MB» / «850 KB». */
export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${sizeFormat.format(bytes / (1024 * 1024))} MB`;
  return `${sizeFormat.format(Math.max(1, Math.round(bytes / 1024)))} KB`;
}

/** Mensaje de error si el archivo no se puede subir (tipo o tamaño), o `null` si sirve. */
export function validateImageFile(file: File): string | null {
  if (!(IMAGE_UPLOAD_TYPES as readonly string[]).includes(file.type)) {
    return `${file.name} no es una imagen. Usa JPG, PNG o WebP.`;
  }
  if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
    return `${file.name} pesa ${formatFileSize(file.size)}. El máximo es 5 MB.`;
  }
  return null;
}

export class ImageUploadError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

/** Mensaje para el usuario según la respuesta del route handler. */
function messageFor(status: number, fileName: string): string {
  if (status === 400) return `No pudimos subir ${fileName}: el archivo no es una imagen válida.`;
  if (status === 413) return `${fileName} pesa más de 5 MB.`;
  if (status === 429) return "Subiste muchas imágenes seguidas. Espera un minuto y vuelve a intentarlo.";
  if (status === 401 || status === 403) return "Tu sesión expiró. Vuelve a ingresar para subir imágenes.";
  return `No pudimos subir ${fileName}. Revisa tu conexión e inténtalo de nuevo.`;
}

export interface IUploadHandle {
  promise: Promise<IUploadedImage>;
  /** Cancela la subida; la promesa se rechaza con `AbortError`. */
  abort: () => void;
}

/** Sube un archivo y avisa el avance (0–100). */
export function uploadImage(file: File, onProgress?: (pct: number) => void): IUploadHandle {
  const xhr = new XMLHttpRequest();
  const promise = new Promise<IUploadedImage>((resolve, reject) => {
    xhr.open("POST", "/api/uploads");
    xhr.responseType = "json";
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.min(100, Math.round((e.loaded / e.total) * 100)));
    };
    xhr.onload = () => {
      const body = xhr.response as Partial<IUploadedImage> | null;
      if (xhr.status === 201 && body?.url && body.key) {
        resolve({ key: body.key, url: body.url });
      } else {
        reject(new ImageUploadError(messageFor(xhr.status, file.name), xhr.status));
      }
    };
    xhr.onerror = () => reject(new ImageUploadError(messageFor(0, file.name), 0));
    xhr.onabort = () => reject(new DOMException("Subida cancelada", "AbortError"));
    const data = new FormData();
    data.append("file", file);
    xhr.send(data);
  });
  return { promise, abort: () => xhr.abort() };
}
