module.exports = {
  plugins: ['stylelint-order'], // stylelint-order を使う
  extends: [
    'stylelint-config-standard', //ベースの設定ファイル
    'stylelint-prettier/recommended',
  ],
  rules: {
    'declaration-empty-line-before': 'never',
    'string-quotes': 'single',
    'order/properties-alphabetical-order': true, //ABC順に並べる
  },
};
