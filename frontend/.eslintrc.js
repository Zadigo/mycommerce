module.exports = {
  env: {
    node: true,
    browser: true
  },

  parser: 'vue-eslint-parser',

  rules: {
    'vue/attribute-hyphenation': 'error',
    'vue/attributes-order': 'warn',
    'vue/html-quotes': 'warn',
    'vue/html-indent': 'warn',
    'vue/order-in-components': 'warn',
    'vue/require-explicit-emits': 'error',
    'vue/require-prop-types': 'error',
    'vue/this-in-template': 'error',
    'vue/v-on-style': 'warn',
    'vue/v-bind-style': [
      'error',
      'shorthand'
    ],

    'camelcase': 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-trailing-spaces': ['warn', { 'ignoreComments': true }]
  },

  root: true,

  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],

  parserOptions: {
    ecmaVersion: 2020
  }
}
