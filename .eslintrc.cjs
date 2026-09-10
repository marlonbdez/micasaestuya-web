module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: ['@nuxtjs/eslint-config-typescript', 'plugin:prettier/recommended'],
  plugins: ['prettier', 'vitest'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    complexity: ['error', 10]
  },
  overrides: [
    {
      files: ['*.cy.js'],
      rules: {
        'no-unused-expressions': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'space-before-function-parentheses': 'off'
      }
    }
  ]
}
