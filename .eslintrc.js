module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'prettier',
    'react'
  ],
  rules: {
    // eslint official
    quotes: ['error', 'single'],

    // prettier
    'prettier/prettier': 'error', //ESLintでPrettierの規則もエラーとして検出する設定

    // react
    'react/prop-types': 'off'
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
