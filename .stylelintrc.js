module.exports = {
  plugins: ['stylelint-order'], // stylelint-order を使う
  extends: [
    'stylelint-config-standard', //ベースの設定ファイル
    'stylelint-prettier/recommended',
  ],
  rules: {
    'string-quotes': 'double',
    'order/properties-alphabetical-order': true, //ABC順に並べる
  },
};
