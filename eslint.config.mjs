import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Matriz de imports de Atomic Design (ver CLAUDE.md, «Component Architecture»).
// `ui` cuenta como átomo. En error: un import prohibido rompe el lint.
const levelImport = (level, why) => ({
  group: [`@/components/${level}/**`, `**/components/${level}/**`],
  message: why,
});

const restrictLevels = (files, levels, who) => ({
  files,
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: levels.map((level) =>
          levelImport(level, `${who} no pueden importar ${level}.`),
        ),
      },
    ],
  },
});

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Atoms (y ui): solo ui, lib e interfaces.
  restrictLevels(
    ["components/atoms/**", "components/ui/**"],
    ["molecules", "organisms", "templates"],
    "Los átomos",
  ),
  // Molecules: solo atoms y ui.
  restrictLevels(
    ["components/molecules/**"],
    ["organisms", "templates"],
    "Las moléculas",
  ),
  // Organisms: organisms, molecules y atoms; nunca templates.
  restrictLevels(
    ["components/organisms/**"],
    ["templates"],
    "Los organismos",
  ),
  // Templates: pueden importar todo (sin datos).
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
