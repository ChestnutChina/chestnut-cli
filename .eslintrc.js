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
    // 强制使用使用两个空格进行缩进
    indent: ['error', 2, { SwitchCase: 1 }],
    // 强制使用除需要转义的情况外，字符串统一使用单引号
    quotes: ['error', 'single'],
    // 不要定义未使用的变量
    'no-unused-vars': [
      'error',
      {
        args: 'after-used', // 检查参数。
        caughtErrors: 'all',
      },
    ],
    // 关键字后面加空格
    'keyword-spacing': ['error', { after: true }],
    // 函数声明时括号与函数名间加空格
    'space-before-function-paren': ['error', { anonymous: 'always',
      named: 'never' }],
    // 始终使用 === 替代 ==
    eqeqeq: ['error', 'always'],
    // 字符串拼接操作符之间要留空格
    'space-infix-ops': 'error',
    // 逗号后面加空格
    'comma-spacing': ['error', { after: true }],
    // else 关键字要与花括号保持在同一行
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    // 多行 if 语句的的括号不能省
    curly: ['error', 'all'],
    // 不要丢掉异常处理中err参数
    'handle-callback-err': 'error',
    // 不允许有连续多行空行
    'no-multiple-empty-lines': ['error', { max: 1 }],
    // 对于三元运算符** `?` 和 `:` 与他们所负责的代码处于同一行
    'operator-linebreak': ['error'],
    // 每个 var 关键字单独声明一个变量。
    'one-var': ['error', 'never'],
    // 条件语句中赋值语句使用括号包起来
    'no-cond-assign': ['error', 'except-parens'],
    // 单行代码块两边加空格
    'block-spacing': ['error'],
    // 对于变量和函数名统一使用驼峰命名法
    camelcase: ['error'],
    // 为了和prettier搭配，允许有多余的行末逗号
    'comma-dangle': ['error', 'always-multiline'],
    // 始终将逗号置于行末
    'comma-style': ['error', 'last'],
    // 点号操作符须与属性需在同一行
    'dot-location': ['error', 'property'],
    // 文件末尾留一空行
    'eol-last': ['error', 'always'],
    // 函数调用时标识符与括号间不留间隔
    'func-call-spacing': ['error', 'never'],
    // 键值对当中冒号与值之间要留空白
    'key-spacing': 'error',
    // 构造函数要以大写字母开头
    'new-cap': 'error',
    // 无参的构造函数调用时要带上括号
    'new-parens': 'error',
    // 对象中定义了存值器，一定要对应的定义取值器
    'accessor-pairs': 'error',
    // 子类的构造器中一定要调用 super
    'constructor-super': 'error',
    // 使用数组字面量而不是构造器
    'no-array-constructor': 'error',
    // 避免使用 arguments.callee 和 arguments.caller
    'no-caller': 'error',
    // 避免对类名重新赋值
    'no-class-assign': 'error',
    // 避免修改使用 const 声明的变量
    'no-const-assign': 'error',
    // 避免使用常量作为条件表达式的条件（循环语句除外）
    'no-constant-condition': 'error',
    // 正则中不要使用控制符
    'no-control-regex': 'error',
    // 生产环境下不使用debugger
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 生产环境下不使用console
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 不要对变量使用 delete 操作
    'no-delete-var': 'error',
    // 不要定义冗余的函数参数
    'no-dupe-args': 'error',
    // 类中不要定义冗余的属性
    'no-dupe-class-members': 'error',
    // 对象字面量中不要定义重复的属性
    'no-dupe-keys': 'error',
    // switch 语句中不要定义重复的 case 分支
    'no-duplicate-case': 'error',
    // 同一模块有多个导入时一次性写完
    'no-duplicate-imports': 'error',
    // 正则中不要使用空字符
    'no-empty-character-class': 'error',
    // 不要解构空值
    'no-empty-pattern': 'error',
    // 不要直接使用 eval()
    'no-eval': ['error', { allowIndirect: true }],
    // catch 中不要对错误重新赋值
    'no-ex-assign': 'error',
    // 避免不必要的布尔转换
    'no-extra-boolean-cast': 'error',
    // 不要使用多余的括号包裹函数
    'no-extra-parens': 'error',
    // switch 一定要使用 break 来将条件分支正常中断
    'no-fallthrough': 'error',
    // 不要省去小数点前面的0
    'no-floating-decimal': 'error',
    // 避免对声明过的函数重新赋值
    'no-func-assign': 'error',
    // 不要对全局只读对象重新赋值
    'no-global-assign': 'error',
    // 注意隐式的 eval()
    'no-implied-eval': 'error',
    // 嵌套的代码块中禁止再定义函数
    'no-inner-declarations': 'error',
    // 不要向 RegExp 构造器传入非法的正则表达式
    'no-invalid-regexp': 'error',
    // 不要使用非法的空白符
    'no-irregular-whitespace': 'error',
    // 禁止使用 __iterator__
    'no-iterator': 'error',
    // 外部变量不要与对象属性重名
    'no-label-var': 'error',
    // 不要使用标签语句
    'no-labels': 'error',
    // 不要书写不必要的嵌套代码块
    'no-lone-blocks': 'error',
    // 不要混合使用空格与制表符作为缩进
    'no-mixed-spaces-and-tabs': 'error',
    // 除了缩进，不要使用多个空格
    'no-multi-spaces': 'error',
    // 不要使用多行字符串
    'no-multi-str': 'error',
    // new 创建对象实例后需要赋值给变量
    'no-new': 'error',
    // 禁止使用 Function 构造器
    'no-new-func': 'error',
    // 禁止使用 Object 构造器
    'no-new-object': 'error',
    // 禁止使用 new require
    'no-new-require': 'error',
    // 禁止使用 Symbol 构造器
    'no-new-symbol': 'error',
    // 禁止使用原始包装器
    'no-new-wrappers': 'error',
    // 不要将全局对象的属性作为函数调用
    'no-obj-calls': 'error',
    // 不要使用八进制字面量
    'no-octal': 'error',
    // 字符串字面量中也不要使用八进制转义字符。
    'no-octal-escape': 'error',
    // 使用 __dirname 和 __filename 时尽量避免使用字符串拼接
    'no-path-concat': 'error',
    // 使用 getPrototypeOf 来替代 __proto__
    'no-proto': 'error',
    // 不要重复声明变量
    'no-redeclare': 'error',
    // 正则中避免使用多个空格
    'no-regex-spaces': 'error',
    // return 语句中的赋值必需有括号包裹
    'no-return-assign': 'error',
    // 避免将变量赋值给自己
    'no-self-assign': 'error',
    // 避免将变量与自己进行比较操作
    'no-self-compare': 'error',
    // 避免使用逗号操作符
    'no-sequences': 'error',
    // 不要随意更改关键字的值
    'no-shadow-restricted-names': 'error',
    // 禁止使用稀疏数组
    'no-sparse-arrays': 'error',
    // 不要使用制表符
    'no-tabs': 'error',
    // 正确使用 ES6 中的字符串模板
    'no-template-curly-in-string': 'error',
    // 使用 this 前请确保 super() 已调用
    'no-this-before-super': 'error',
    // 用 throw 抛错时，抛出 Error 对象而不是字符串
    'no-throw-literal': 'error',
    // 行末不留空格
    'no-trailing-spaces': 'error',
    // 不要使用 undefined 来初始化变量
    'no-undef-init': 'error',
    // 循环语句中注意更新循环变量
    'no-unmodified-loop-condition': 'error',
    // 如果有更好的实现，尽量不要使用三元表达式
    'no-unneeded-ternary': 'error',
    // return，throw，continue 和 break 后不要再跟代码
    'no-unreachable': 'error',
    // finally 代码块中不要再改变程序执行流程
    'no-unsafe-finally': 'error',
    // 关系运算符的左值不要做取反操作
    'no-unsafe-negation': 'error',
    // 避免使用不必要的计算值作对象属性
    'no-useless-computed-key': 'error',
    // 禁止多余的构造器
    'no-useless-constructor': 'error',
    // 禁止不必要的转义
    'no-useless-escape': 'error',
    // import, export 和解构操作中，禁止赋值到同名变量
    'no-useless-rename': 'error',
    // 属性前面不要加空格
    'no-whitespace-before-property': 'error',
    // 禁止使用 with
    'no-with': 'error',
    // 对象属性换行时注意统一代码风格
    'object-property-newline': 'error',
    // 代码块中避免多余留白
    'padded-blocks': 'error',
    // 展开运算符与它的表达式间不要留空白
    'rest-spread-spacing': 'error',
    // 遇到分号时空格要后留前不留
    'semi-spacing': 'error',
    // 代码块首尾留空格
    'space-before-blocks': 'error',
    // 圆括号间不留空格
    'space-in-parens': 'error',
    // 一元运算符后面跟一个空格
    'space-unary-ops': 'error',
    // 注释首尾留空格
    'spaced-comment': 'error',
    // 模板字符串中变量前后不加空格
    'template-curly-spacing': 'error',
    // 检查 NaN 的正确姿势是使用 isNaN()
    'use-isnan': 'error',
    // 用合法的字符串跟 typeof 进行比较操作
    'valid-typeof': 'error',
    // 自调用匿名函数 (IIFEs) 使用括号包裹
    'wrap-iife': 'error',
    // yield * 中的 * 前后都要有空格
    'yield-star-spacing': 'error',
    // 请书写优雅的条件语句
    yoda: 'error',
    // 需要分号
    semi: ['error', 'always'],
    // prettier关闭
    'prettier/prettier': 'off',
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
