module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-deprecated-slot-attribute': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'brace-style': 'error',
    'block-scoped-var': 'error',
    'consistent-return': 'warn',
    'curly': 'error',
    'eqeqeq': 'error',
    'arrow-spacing': [
      'error',
      {
        'before': true,
        'after': true
      }
    ],
    'default-case': 'error',
    'default-case-last': 'warn',
    'dot-notation': 'error',
    'func-style': ['warn', 'declaration'],
    'no-array-constructor': 'error',
    'no-use-before-define': 'error',
    'no-undef-init': 'error',
    'no-undefined': 'warn',
    'no-bitwise': 'error',
    'no-eq-null': 'error',
    'no-fallthrough': 'error',
    'no-floating-decimal': 'error',
    'no-loop-func': 'error',
    'no-param-reassign': 'error',
    'no-redeclare': 'error',
    'no-return-assign': 'error',
    'no-self-compare': 'warn',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'off',
    'no-unneeded-ternary': 'error',
    'prefer-const': 'error',
    'radix': 'warn',
    'vars-on-top': 'warn',
    'yoda': 'warn',

    // allow async-await
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    'one-var': 'off',
    'no-void': 'off',
    'multiline-ternary': 'off',

    'import/first': 'off',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
  }
}
