module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  // https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
  // Must use parserOptions instead of "parser" to allow vue-eslint-parser to keep working
  // `parser: 'vue-eslint-parser'` is already included with any 'plugin:vue/**' config and should be omitted
  parserOptions: {
    parser: require.resolve('@typescript-eslint/parser'),
    extraFileExtensions: [ '.vue' ]
  },

  env: {
    browser: true,
    es2021: true,
    node: true
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    // Base ESLint recommended rules
    // 'eslint:recommended',

    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#usage
    // ESLint typescript rules
    'plugin:@typescript-eslint/recommended',

    // Uncomment any of the lines below to choose desired strictness,
    // but leave only one uncommented!
    // See https://eslint.vuejs.org/rules/#available-rules
    'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)
    // 'plugin:vue/vue3-strongly-recommended', // Priority B: Strongly Recommended (Improving Readability)
    // 'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)

    'standard'
    
  ],

  plugins: [
    // required to apply rules which need type information
    '@typescript-eslint',

    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-files
    // required to lint *.vue files
    'vue'
    
  ],

  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly'
  },

  // add your custom rules here
  rules: {
    
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

    // The core 'import/named' rules
    // does not work with type definitions
    'import/named': 'off',
    
    'prefer-promise-reject-errors': 'off',

    quotes: ['warn', 'single', { avoidEscape: true }],

    // this rule, if on, would require explicit return type on the `render` function
    '@typescript-eslint/explicit-function-return-type': 'off',

    // in plain CommonJS modules, you can't use `import foo = require('foo')` to pass this rule, so it has to be disabled
    '@typescript-eslint/no-var-requires': 'off',

    // The core 'no-unused-vars' rules (in the eslint:recommended ruleset)
    // does not work with type definitions
    'no-unused-vars': 'off',

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "brace-style": "error",
    "block-scoped-var": "error",
    "consistent-return": "warn",
    "curly": "error",
    "eqeqeq": "error",
    "arrow-spacing": [
      "error",
      {
        "before": true,
        "after": true
      }
    ],
    "default-case": "error",
    "default-case-last": "warn",
    "dot-notation": "error",
    "func-style": ["warn", "declaration"],
    "no-array-constructor": "error",
    "no-use-before-define": "error",
    "no-undef-init": "error",
    "no-undefined": "warn",
    "no-bitwise": "error",
    "no-eq-null": "error",
    "no-fallthrough": "error",
    "no-floating-decimal": "error",
    "no-loop-func": "error",
    "no-param-reassign": "error",
    "no-redeclare": "error",
    "no-return-assign": "error",
    "no-self-compare": "warn",
    "no-throw-literal": "error",
    "no-unneeded-ternary": "error",
    "prefer-const": "error",
    "radix": "warn",
    "vars-on-top": "warn",
    "yoda": "warn",
    "vue/comma-dangle": "error",
    "vue/attribute-hyphenation": "error",
    "vue/attributes-order": "warn",
    "vue/html-quotes": "warn",
    "vue/html-indent": "warn",
    "vue/order-in-components": "warn",
    "vue/require-explicit-emits": "error",
    "vue/require-prop-types": "error",
    "vue/this-in-template": "error",
    "vue/v-on-style": "warn",
    "vue/component-definition-name-casing": ["error", "PascalCase"],
    "vue/html-closing-bracket-spacing": "warn",
    "vue/block-spacing": "error",
    "vue/no-sparse-arrays": "error",
    "vue/no-useless-concat": "warn",
    "vue/object-shorthand": "warn",
    "vue/mustache-interpolation-spacing": "error",
    "vue/html-button-has-type": "warn",
    "vue/match-component-import-name": "error",
    "vue/require-emit-validator": "warn",
    "vue/v-on-function-call": "error",
    "vue/no-unused-refs": "warn",
    "vue/no-irregular-whitespace": "error",
    "vue/padding-line-between-blocks": "error",
    "vue/v-for-delimiter-style": ["error", "in"],
    "vue/prefer-separate-static-class": "error",
    "vue/no-multi-spaces": "error",
    "vue/no-template-target-blank": "error",
    "vue/no-this-in-before-route-enter": "error",
    "vue/no-unused-properties": "error",
    "vue/component-tags-order": [
      "error",
      {
        "order": [
          "docs",
          [
            "script",
            "template"
          ],
          "style",
          "i18n"
        ]
      }
    ],
    "vue/max-attributes-per-line": ["warn", {
      "singleline": {
        "max": 15
      },
    },
    ],
    "vue/v-bind-style": ["error", "shorthand"]
  }
}
