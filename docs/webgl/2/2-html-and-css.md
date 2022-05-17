## HTML和CSS

HTML（超文本标记语言）和CSS（层叠样式表）是用来描述网页的。HTML描述的是网页的内容，而CSS描述的是网页上各种元素的格式化。如果网页设计得特别仔细，描述网页内容的HTML代码可以保持静态，而CSS样式表可能会根据目标屏幕尺寸而改变。也就是说，网页会有相同的内容，但在桌面电脑大屏幕上的布局与手机屏幕上的布局可能会有很大不同。

由于我们在这些教程中的目标是学习3D计算机图形，所以请不要试图在这个时候成为一个网页设计专家。要建立WebGL程序，你只需要了解HTML和CSS代码的基础知识。

与所有的软件开发一样，当你设计一个网页时，你应该从一个非常简单的HTML文档开始，然后每次增加一点复杂性。

### 教程

基本的HTML和CSS可以从许多在线教程中学习。请使用[code academy](https://www.codecademy.com/catalog)的教程来学习如何创建基本的HTML和CSS代码。请注意，你可以通过界面左下角的目录弹出式菜单从一个课程换到下一个课程。

### 资源

这些 "小抄 "将对你有所帮助：

- [HTML 4.0 Cheat Sheet](http://learnwebgl.brown37.net/browser_environment/documents/davechild_html4.pdf) (source: http://www.cheatography.com/davechild/cheat-sheets/html4/)
- [CSS 3.0 Cheat Sheet](http://learnwebgl.brown37.net/browser_environment/documents/css3-cheat-sheet.pdf) (source: http://gamifyedu.co/wd/epicquest/extras/css3-cheat-sheet.pdf)

### 任务

为你的3D俄罗斯方块游戏建立一个网页。关于游戏界面的具体要求，请参考作业。

### HTML 编码标准

这些编码标准在第1节已经介绍过了，但请在学习了HTML和CSS之后再学习。

- 始终将文档类型声明为文档的第一行：\<!doctype html>
- 使用小写的元素名称：\<p>、\<div>
- 关闭所有元素：\<p> ... \</p>
- 关闭空元素：\<br />
- 使用小写的属性名称：\<div class="...">
- 引用所有属性值以保持一致性：\<div class="...">
- 不要在等号周围使用空格：\<div class="...">
- 尽量避免超过 80 个字符的代码行
- 为了便于阅读，请添加空行来分隔大型或逻辑代码块。
- 为了可读性，在父元素内为代码添加 2 个缩进空格。不要使用 TAB 字符。
- 始终包含 \<html>、\<head> 和 \<body> 标签。
- 始终包括语言、字符编码和 \<title>：
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