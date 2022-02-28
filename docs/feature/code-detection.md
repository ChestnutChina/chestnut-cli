## Code Detection 代码检测

> Find and fix problems in your JavaScript code

引用官方的说法: 查找和修复你的**JavaScript**代码

能在项目开发中，为团队更好的规范代码和管理代码质量

本文约定如下:

- 默认配置文件表示`.eslintrc.js`
- 忽略文件表示`.eslintignore`

### 使用方法

选择此配置后

1. 首先选择配置的类型：**JavaScript** or **Typescript**

2. 然后会出现以下几种情况：

   - 如果当前项目中没有配置过，则创建一个默认配置文件
   - 如果当前项目中已存在默认配置文件，则提示是否文件替换
   - 如果其它优先级的配置文件存在，则提示是否创建一个默认配置文件进行优先级覆盖

3. 同时会有一个忽略文件，并出现以下两种情况:
   - 如果当前项目中没有，则创建
   - 如果当前项目存在，则提示是否替换

### 配置文件

如果选择的类型是**JavaScript**，脚手架生成默认配置文件内容大概如下:

```js
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
  ......
})

```

更多详情信息和配置可以移步[ESLint](https://eslint.org)查看
