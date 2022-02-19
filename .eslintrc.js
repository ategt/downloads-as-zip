module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  "plugins": [   
    "require-jsdoc",  
  ],
  "rules": {   
    "require-jsdoc": 2,  
    "valid-jsdoc": 2,
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
  }
};
