module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2021,
  },
  env: {
    node: true,
    browser: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    // Base ESLint recommended rules
    'eslint:recommended',

    // Uncomment any of the lines below to choose desired strictness,
    // but leave only one uncommented!
    // See https://eslint.vuejs.org/rules/#available-rules
    // 'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)
    'plugin:vue/vue3-strongly-recommended', // Priority B: Strongly Recommended (Improving Readability)
    // 'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)

    // https://github.com/prettier/eslint-config-prettier#installation
    // usage with Prettier, provided by 'eslint-config-prettier'.
    'prettier'
  ],
  plugins: [
    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-files
    // required to lint *.vue files
    'vue',

    // https://github.com/typescript-eslint/typescript-eslint/issues/389#issuecomment-509292674
    // Prettier has not been included as plugin to avoid performance impact
    // add it as an extension for your IDE

  ],
  globals: {
    cordova: 'readonly',
    __statics: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly'
  },
  rules: {
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
    "func-style": [
      "warn",
      "declaration"
    ],
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
    "vue/component-definition-name-casing": [
      "error",
      "PascalCase"
    ],
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
    "vue/no-irregular-whitespace": "warn",
    "vue/padding-line-between-blocks": "error",
    "vue/v-for-delimiter-style": [
      "error",
      "in"
    ],
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
    "vue/v-bind-style": [
      "error",
      "shorthand"
    ]
  }
}
