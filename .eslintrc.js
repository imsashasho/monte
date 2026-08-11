module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jquery: {
      globals: {
        $: true,
      },
    },
  },

  extends: ['airbnb-base', 'plugin:jest/recommended', 'eslint:recommended'],
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'class-methods-use-this': 0,
  },
};
