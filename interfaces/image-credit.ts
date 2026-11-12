/** Crédito de una foto que exige atribución (`GET /credits/images`, CLGDC-210). */
export interface IImageCredit {
  title: string;
  author: string;
  license: string;
  /** Enlace https a creativecommons.org, o `null` si la licencia no tiene uno válido */
  licenseUrl: string | null;
  /** Enlace https al archivo en commons.wikimedia.org, o `null` */
  filePage: string | null;
}
