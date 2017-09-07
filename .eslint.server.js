module.exports = {
  parser: 'espree',
  rules: {
    strict: 0
  },
  env: {
    browser: false,
    commonjs: true,
    es6: true
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    indent: [
      'error', 2,
      {
        'SwitchCase': 1,
        'MemberExpression': 0
      }
    ],

    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-trailing-spaces': ['error'],
    'spaced-comment': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 1 }],
    // 'no-param-reassign': ['error', { 'props': false }],
  }
};
