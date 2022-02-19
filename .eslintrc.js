module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': ['plugin:jsdoc/recommended'],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    'jsdoc',
  ],
  'rules': {
    'jsdoc/require-jsdoc': 1,
    'valid-jsdoc': 2,
    'semi': ['error', 'always'],
    'quotes': ['error', 'double'],
  }
};
