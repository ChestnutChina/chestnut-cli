## 软件编码标准

从WebGL程序开发的一开始，你就应该使用良好的编程标准。这是一个 "先有鸡还是先有蛋 "的问题。在你了解一种语言之前，你怎么能讨论编码标准呢？你真的不能，但在你学会一门编程语言后再讨论编码标准就太晚了。因此，答案是在你学习一种新语言之前、期间和之后讨论编码标准。而这正是我们在这些教程中要做的。

这些教程中的示例代码遵循以下超链接文档中定义的良好编程标准。在您开发自己的WebGL程序时，请使用这些编码标准。主要目的是使您的命名方案保持一致。

- [HTML(5) Style Guide and Coding Conventions](https://www.w3schools.com/html/html5_syntax.asp)
- [JavaScript Naming Conventions](http://www.j-io.org/Javascript-Naming_Conventions)
- [OpenGLSL (Open Graphics Language Shader Language)](https://www.khronos.org/opengl/wiki/GLSL_:_recommendations)

为了简洁起见，下面列出了这些编码标准中的主要建议。如果你想了解任何规则的完整理由，请参考原始参考文件。

### HTML 编码标准

- 始终将文档类型声明为文档的第一行：\<!doctype html>;
- 使用小写的元素名称：\<p>、\<div>
- 关闭所有元素：\<p> ... \</p>
- 关闭空元素：\<br />
- 使用小写的属性名称：\<div class="...">
- 引用所有属性值以保持一致性：\<div class="...">
- 不要在等号周围使用空格：\<div class="...">
- 尽量避免超过80个字符的代码行
- 为了提高可读性，添加空行来分隔大型或逻辑性的代码块。
- 为了提高可读性，在父元素内的代码要增加2个空格的缩进。不要使用TAB字符。
- 始终包括一个\<html>、\<head>和\<body>标签。
- 总是包括语言、字符编码和\<title>。
```js
<!doctype html>
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <title>HTML5 Syntax and Coding Style</title>
</head>
```
- 包括适当的评论。\<!-- This is a comment -->
- 使用简单的语法来链接样式表。\<link rel="styleheet" href="styles.css">。
- 使用简单的语法来加载外部脚本。\<script src="myscript.js">
- 在HTML中使用与JavaScript相同的命名规则
- 始终使用小写的文件名
- 使用一致的文件名扩展名：.html, .css, .js, .frag, .vert, .obj, .mtl

### Javascript 编码标准

- 始终包括 "use strict"；以强制声明变量。
- 尽可能避免使用全局变量。
- 使用JSLint来检查错误。(Pycharm IDE会帮你做这个。)
- 使用两个空格的缩进。
- 在适当的地方使用条件语句的缩写：var results = (test ==5) ? alert(1) : alert(2)。
- 闭合括号应与原始语句保持相同的缩进。
```js
function func() {
  return {
    "name": "Batman"
  };
}
```
- 命名约定：
  - 构造函数以大写字母开头。
  - 方法/函数以小写字母开头。
  - 方法/函数应使用骆驼字母大小写。 thisIsAnExample
  - 变量应该总是在单词之间使用下划线。 this_is_an_example
  - 适当时，在名称中包括变量类型。 value_list
  - 元素的ID和类的名称应该总是在单词之间使用下划线。
  - 私有方法应该使用前导下划线来与公共方法分开。
  - 名称中不应该使用缩略语。
  - 指定名称时不应使用复数。
  - 应在合理范围内使用注释。
  - 使用[YUIDoc](https://clarle.github.io/yui3/projects/)来记录函数。

### GLSL 编码标准

- 在代码中包含适当的注释
  - 在顶点着色器的顶部写上//VERTEX SHADER。
  - 在你的片段着色器的顶部写上 //FRAGMENT SHADER。
- 把WebGL的版本号放在每个着色器的顶部。#version 103
- 避免使用 "一体式着色器"。根据需要编写单独的着色器。

如有需要，请参考这一页。编码的连贯性很重要。