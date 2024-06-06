// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default withNuxt({
  files: ['**/*.mjs', '**/*.js', '**/*.ts', '**/*.vue'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
      },
    ],
    'block-spacing': 'error',
    'no-console': 'off',
    'vue/no-v-html': 'off',
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
    'no-undef': 'off',
    'vue/html-self-closing': 'off', // prettier conflict
  },
}).prepend(eslintPluginPrettierRecommended)
