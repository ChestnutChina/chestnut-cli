const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      tsx: true
    }
  },
  env: {
    browser: true,
    node: true,
    jasmine: true,
    jest: true,
    es6: true
  },
  globals: {
    jest: "readonly"
  },
  plugins: ['@typescript-eslint', "prettier", "import"],
  extends: [
    "eslint:recommended",
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    indent: ['error', 2, {
      MemberExpression: 'off'
    }],
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'quote-props': 'off',
    'no-shadow': ['error'],
    'no-undef': 2,
    'vue/max-attributes-per-line': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/script-setup-uses-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: false
        },
        singleline: {
          delimiter: 'semi',
          requireLast: true
        }
      }
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    // 关闭冲突规则
    'prettier/prettier': [
      'error',
      {
        semi: true, // 句尾添加分号
        tabWidth: 2, // 缩进字节数
        printWidth: 120, // 超过最大值换行
        endOfLine: 'auto', // 结尾是 \n \r \n\r auto
        singleQuote: true, // 使用单引号代替双引号
        arrowParens: 'avoid', // (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
        trailingComma: 'all', // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
        bracketSpacing: true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
        proseWrap: 'never', // 不使用。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
        htmlWhitespaceSensitivity: 'ignore', // 包裹文字时候结束标签的结尾尖括号掉到了下一行
      },
      {
        usePrettierrc: false,
        fileInfoOptions: {
          withNodeModules: true,
        },
      },
    ]
  }
})
