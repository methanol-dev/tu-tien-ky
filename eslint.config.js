import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
  },
  {
    // Engine layer must stay framework-agnostic (see docs/PLAN section 6).
    files: ['src/engine/**/*.ts', 'src/content/**/*.ts'],
    rules: {
      // Engine functions like usePill() are not React hooks.
      'react-hooks/rules-of-hooks': 'off',
      'no-restricted-imports': [
        'error',
        {
          paths: ['react', 'react-dom', 'zustand'],
          patterns: ['@/ui/*', '@/store/*', 'react/*'],
        },
      ],
    },
  },
])
