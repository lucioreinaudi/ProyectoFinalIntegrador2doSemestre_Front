import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Reportes que genera Playwright al correr los tests (no son codigo).
  globalIgnores(['dist', 'playwright-report', 'test-results']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // const { campo, ...resto } = obj es la forma comun de sacar un campo de un objeto
      // (ej. MiCuenta y Registro): "campo" no se usa a proposito, no es un error.
      'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
  // Tests de Playwright y su configuracion: corren en Node, no en el navegador
  // (usan process.env para el usuario de prueba).
  {
    files: ['playwright.config.js', 'tests/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
