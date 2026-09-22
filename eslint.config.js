import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tsParser from '@typescript-eslint/parser'

const isProduction = process.env.NODE_ENV === 'production'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'tests/e2e/**']
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['src/**/*.{js,vue}', 'tests/**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        global: 'readonly'
      }
    },
    rules: {
      'no-console': isProduction ? 'error' : 'off',
      'no-debugger': isProduction ? 'error' : 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }]
    }
  },
  {
    files: ['*.cjs', 'eslint.config.js', 'playwright.config.js', 'public/service-worker.js', 'scripts/**'],
    languageOptions: {
      globals: { module: 'writable', require: 'writable', process: 'readonly', console: 'readonly', __dirname: 'readonly' }
    }
  },
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tsParser }
    }
  },
  {
    files: ['src/components/cards/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }
]
