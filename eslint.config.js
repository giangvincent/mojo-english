import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

const isProduction = process.env.NODE_ENV === 'production'

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
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
        navigator: 'readonly'
      }
    },
    rules: {
      'no-console': isProduction ? 'error' : 'off',
      'no-debugger': isProduction ? 'error' : 'off'
    }
  }
]
