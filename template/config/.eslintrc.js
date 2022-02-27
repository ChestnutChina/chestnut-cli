const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
  root: true,
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
    ecmaVersion: 2020
  },
  env: {
    browser: true,
    node: true,
    jasmine: true,
    jest: true,
    es6: true,
  },
  globals: {
    jest: "readonly"
  },
  plugins: ["prettier", "import"],
  extends: [
    "eslint:recommended",
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    indent: ['error', 2, {
      MemberExpression: 'off'
    }],
    quotes: [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'quote-props': 'off',
    'no-shadow': ['error'],
    'prettier/prettier': [
      'error',
      {
        semi: true,
        tabWidth: 2,
        printWidth: 120,
        endOfLine: 'auto',
        singleQuote: true,
        arrowParens: 'avoid',
        trailingComma: 'all',
        bracketSpacing: true,
        proseWrap: 'never',
        htmlWhitespaceSensitivity: 'ignore',
      },
      {
        usePrettierrc: false,
        fileInfoOptions: {
          withNodeModules: true,
        },
      },
    ],
    'no-case-declarations': 0,
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.js'],
      env: {
        jest: true
      },
      rules: {
        'node/no-extraneous-require': 'off'
      }
    }
  ]
})
