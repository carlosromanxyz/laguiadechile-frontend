import { LDCAboutWhyIllustrationScene } from "./ldc-about-why-illustration-scene";

/** Centros de los 5 puntos del tablero (x = 589.17) y color de cada uno en reposo. */
const DOTS: Array<{ cy: number; fill: string }> = [
  { cy: 361.1, fill: "#6c63ff" },
  { cy: 398.1, fill: "#ff6584" },
  { cy: 435.1, fill: "#6c63ff" },
  { cy: 472.1, fill: "#f2f2f2" },
  { cy: 509.1, fill: "#f2f2f2" },
];

/**
 * Copia de cada punto que el ciclo enciende o apaga, apagada (`opacity` 0) en
 * reposo: sobre los puntos marcados (1–3) es una tapa gris que los «desmarca»
 * en el reinicio; sobre los vacíos (4 y 5), el color con que se marcan.
 */
const DOT_COPIES = ["#f2f2f2", "#f2f2f2", "#f2f2f2", "#ff6584", "#6c63ff"];

/**
 * LDCAboutWhyIllustration - Ilustración de «¿Por qué estar en La Guía de Chile?»
 *
 * El SVG en línea de la antigua `public/images/about-why-illustration.svg`
 * (tablero con 5 líneas y 5 puntos, casilla con check, tarjeta con check y la
 * persona sentada que la señala), sin tocar colores ni el orden de pintado,
 * pasado por SVGO (`floatPrecision: 2`, transformaciones aplicadas a los trazos;
 * sin `collapseGroups`, `cleanupIds`, `removeUnknownsAndDefaults`,
 * `removeHiddenElems` ni `mergePaths`). La casilla con check va después de los
 * puntos (no se tocan) y el rectángulo girado 180° quedó como rectángulo sin
 * giro (es simétrico). Es de servidor: los trazos llegan como `children` a
 * `LDCAboutWhyIllustrationScene` (cliente), que solo anima los grupos.
 *
 * - `data-e="<grupo>"`: grupo del armado (tablero, líneas, puntos, casilla,
 *   sombra, tarjeta y persona).
 * - `data-l="<grupo>"`: grupo anidado del ciclo (puntos, check de la casilla,
 *   tarjeta, cabeza, ojos y brazo).
 * - `data-lit="dot<k>"`: copia de cada punto, apagada en reposo.
 *
 * Sin JavaScript o con `prefers-reduced-motion` queda idéntica a la imagen
 * estática.
 *
 * @example
 * <LDCAboutWhyIllustration className="relative w-full h-auto drop-shadow-2xl" />
 */
export function LDCAboutWhyIllustration({ className }: { className?: string }) {
  return (
    <LDCAboutWhyIllustrationScene
      label="¿Por qué estar en La Guía de Chile? - Crece tu negocio"
      className={className}
    >
      <g data-e="board">
        <path fill="#3f3d56" d="M670.67 650.6h-531a9 9 0 0 1-9-9v-327a9 9 0 0 1 9-9h531a9 9 0 0 1 9 9v327a9 9 0 0 1-9 9m-531-343a7 7 0 0 0-7 7v327a7 7 0 0 0 7 7h531a7 7 0 0 0 7-7v-327a7 7 0 0 0-7-7Z" />
      </g>
      {[365.6, 402.6, 439.6, 476.6, 513.6].map((y, k) => (
        <g key={y} data-e={`line${k + 1}`}>
          <path fill="#ccc" d={`M535.17 ${y}h-323a4.5 4.5 0 0 1 0-9h323a4.5 4.5 0 0 1 0 9`} />
        </g>
      ))}
      {DOTS.map(({ cy, fill }, k) => (
        <g key={cy} data-e={`dot${k + 1}`}>
          <g data-l={`dot${k + 1}`}>
            <circle cx="589.17" cy={cy} r="13" fill={fill} />
            <circle data-lit={`dot${k + 1}`} cx="589.17" cy={cy} r="13" fill={DOT_COPIES[k]} opacity={0} />
          </g>
        </g>
      ))}
      <g data-e="tick">
        <path fill="#3f3d56" d="M609.33 586.3h-42a2.5 2.5 0 0 1-2.5-2.5v-22a2.5 2.5 0 0 1 2.5-2.5h30.25a1.5 1.5 0 0 1 0 3h-28.25a1.5 1.5 0 0 0-1.5 1.5v18a1.5 1.5 0 0 0 1.5 1.5h38a1.5 1.5 0 0 0 1.5-1.5v-9.54a1.5 1.5 0 0 1 3 0v11.54a2.5 2.5 0 0 1-2.5 2.5" />
        <g data-l="tick">
          <path fill="#6c63ff" d="M588.83 579.26a2.8 2.8 0 0 1-1.98-.82l-8.87-8.87a1.5 1.5 0 0 1 0-2.12 1.54 1.54 0 0 1 2.12 0l8.38 8.37a.5.5 0 0 0 .7 0l27.89-27.87a1.54 1.54 0 0 1 2.12 0 1.5 1.5 0 0 1 0 2.12l-28.37 28.37a2.8 2.8 0 0 1-1.99.82" />
        </g>
      </g>
      <g data-e="shadow">
        <ellipse cx="588.83" cy="600.3" opacity={0.1} rx="69" ry="4" />
      </g>
      <g data-e="card">
        <g data-l="card">
          <path fill="#3f3d56" d="M79.75 245.92H4.48A4.5 4.5 0 0 1 0 241.44v-39.43a4.5 4.5 0 0 1 4.48-4.48h54.21a2.69 2.69 0 1 1 0 5.38H8.06a2.7 2.7 0 0 0-2.68 2.69v32.26a2.7 2.7 0 0 0 2.68 2.68h68.1a2.7 2.7 0 0 0 2.7-2.68v-17.1a2.69 2.69 0 0 1 5.37 0v20.68a4.5 4.5 0 0 1-4.48 4.48" />
          <path fill="#6c63ff" d="M43.01 233.3a5 5 0 0 1-3.55-1.47l-15.9-15.9a2.7 2.7 0 0 1 0-3.8 2.75 2.75 0 0 1 3.8 0l15.02 15.02a.9.9 0 0 0 1.27 0l49.96-49.97a2.75 2.75 0 0 1 3.8 0 2.7 2.7 0 0 1 0 3.8l-50.84 50.85A5 5 0 0 1 43 233.3" />
        </g>
      </g>
      <g data-e="person">
        <rect width="99" height="29" x="138.79" y="281.64" fill="#2f2e41" rx="4" />
        <path fill="#2f2e41" d="M231.79 280.64h-138a6 6 0 0 0-6 6v95a6 6 0 0 0 6 6h17a6 6 0 0 0 6-6v-72h22v73a6 6 0 0 0 6 6h17a6 6 0 0 0 6-6v-73h64a6 6 0 0 0 6-6v-17a6 6 0 0 0-6-6" />
        <path fill="#2f2e41" d="m266.43 311.2-131.15-2.76a6 6 0 0 1-5.73-7.34l31.94-139.8a6 6 0 0 1 5.84-4.66h34.35a49.15 49.15 0 0 1 48.1 39.09l22.65 108.24a6 6 0 0 1-6 7.23" />
        <g data-l="head">
          <circle cx="185.21" cy="90.65" r="53.52" fill="#6c63ff" />
          <path fill="#2f2e41" d="M160.93 61.84c-6.25-1.48-13-3.46-17.45-8.38-3.8-4.18-5.57-10.64-2.2-15.6 3.06-4.54 9.11-6.2 14.2-7.05 5.93-1 12.02-1.14 17.57-3.66a18 18 0 0 0 6.94-5.5 47 47 0 0 0 4.38-7.54 28 28 0 0 1 4.6-7.07 14 14 0 0 1 7.9-3.86c6.7-1.02 13.07 2.08 18.34 5.93a80 80 0 0 1 13.8 13.1 86.6 86.6 0 0 1 18.48 38.15c.4 1.9 3.29 1.1 2.9-.8a89.5 89.5 0 0 0-16.87-36.52 87 87 0 0 0-14.1-14.46C213.97 4.2 207.7.38 200.54.03a19.4 19.4 0 0 0-9.59 1.9 17.5 17.5 0 0 0-6.68 6.22c-3.37 5.11-5 11.72-10.43 15.17-5.5 3.5-12.4 3.54-18.64 4.51-5.56.87-11.74 2.7-15.5 7.16-4.16 4.93-4 11.66-.9 17.1 3.45 6.04 9.87 9.34 16.3 11.31q2.5.74 5.02 1.33c1.88.44 2.68-2.45.8-2.9" />
          <path fill="#2f2e41" d="M191 108.52c-3.32-.09-7.43-.2-10.6-2.52a8.1 8.1 0 0 1-3.2-6.07 5.5 5.5 0 0 1 1.86-4.5c1.66-1.4 4.07-1.72 6.68-.96l-2.7-19.72 1.98-.27 3.17 23.19-1.65-.76c-1.92-.88-4.55-1.33-6.19.05a3.5 3.5 0 0 0-1.15 2.9 6.2 6.2 0 0 0 2.38 4.53c2.47 1.8 5.75 2.03 9.47 2.13Z" />
          <g data-l="eyes">
            <rect width="10.77" height="2" x="162.47" y="76.45" fill="#2f2e41" />
            <rect width="10.77" height="2" x="196.47" y="76.45" fill="#2f2e41" />
          </g>
        </g>
        <g data-l="arm">
          <path fill="#6c63ff" d="M82.84 258.87a6.5 6.5 0 0 1-5.93-3.8l-6.12-13.43a6.5 6.5 0 0 1 3.22-8.61l111.95-51a6.5 6.5 0 0 1 8.61 3.22l6.12 13.43a6.5 6.5 0 0 1-3.22 8.61l-111.95 51a6.5 6.5 0 0 1-2.68.58" />
        </g>
      </g>
    </LDCAboutWhyIllustrationScene>
  );
}
