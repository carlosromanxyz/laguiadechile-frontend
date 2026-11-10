/**
 * Nombre de una persona usuaria (CLGDC-194). La API entrega `firstName` y `lastName` por separado;
 * este es el único lugar donde se arma el nombre para mostrar y sus iniciales.
 */
export interface PersonName {
  firstName: string;
  lastName: string;
}

/** «Ana Pérez». Sin espacio colgando si `lastName` está vacío (cuenta migrada de una palabra). */
export function formatPersonName(p: PersonName): string {
  return [p.firstName.trim(), p.lastName.trim()].filter(Boolean).join(" ");
}

/** Inicial del nombre más la del apellido, en mayúscula («AP»); una sola letra si falta el apellido. */
export function getPersonInitials(p: PersonName): string {
  return [p.firstName.trim(), p.lastName.trim()]
    .filter(Boolean)
    .map((part) => part.charAt(0).toLocaleUpperCase("es"))
    .join("");
}
