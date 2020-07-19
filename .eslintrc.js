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
  plugins: ['@typescript-eslint', 'prettier', 'react'],
  rules: {
    // eslint official
    quotes: ['error', 'single'],

    // @typescript-eslint
    // '@typescript-eslint/explicit-function-return-type': 'off', // すべての関数の戻り値型を明記
    '@typescript-eslint/explicit-module-boundary-types': 'off', // エクスポート関数の戻り値型を明記

    // prettier
    'prettier/prettier': 'error', //ESLintでPrettierの規則もエラーとして検出する設定

    // react
    'react/prop-types': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
