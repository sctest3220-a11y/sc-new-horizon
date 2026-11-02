import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Generated output is gitignored but not ESLint-ignored by default:
  // work/ holds the inventory Worker build, coverage/ the test coverage reports.
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'work/**', 'coverage/**']),
]);

export default eslintConfig;
