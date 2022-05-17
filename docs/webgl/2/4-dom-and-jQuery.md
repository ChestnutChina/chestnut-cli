## DOM和jQuery

被下载到客户电脑上的HTML和CSS代码是纯文本。客户的浏览器根据文本描述创建一个可视化的网页。该网页可以由JavaScript代码动态修改，视觉表现也会自动更新。正如所有的计算机科学任务一样，一个好的数据结构可以使任务变得简单，而一个差的数据结构可以使任务变得非常困难。文本是人类指定网页的一种方便方式，但文本是一种非常差的数据结构，用于网页操作。

因此，文档对象模型（[DOM](https://en.wikipedia.org/wiki/Document_Object_Model)）被开发出来。DOM是一个标准惯例，用于创建描述网页的对象的层次结构。这为操作网页的元素提供了一种简单的方法。然而，DOM已经被不同的供应商以不一致的方式实现。之所以出现这种情况，是因为供应商不断试图 "突破 "网页设计的界限，也因为HTML和CSS规范留有解释的余地。网页设计者发现自己不断地写出类似这样的代码。

```js
if (the_browser == Chrome) {
  element.property = 5;
} else if (the_broswer == FireFox) {
  element.prop = 5;
} else if (the_broswer == IE) {
  element.props = 5;
} else if (the_browser == Opera) {
  ...
```

jQuery是一个第三方的JavaScript库，它提供了一种简单的方法来寻找网页上的元素，并以一种一致的方式来修改它们。与上述代码相当的jQuery可能看起来像：
```js
$(element_id).attr("property", 5)
```

### JavaScript 基础

在我们介绍jQuery之前，我们需要回顾一下JavaScript语言的一些方面。

JavaScript中的函数是对象。事实上，**JavaScript中的所有东西都是一个对象**! 一个对象有属性。与其他编程语言相比，这一切都很奇怪，但这就是JavaScript的设计方式。让我们看一个简单的例子：
```js
// Define a function called "example" that adds 2 numbers together
function example(a,b) {
  return (a+b);
}

// Add a property to the example object. The property is a reference to a function.
example.subtract = function (c,d) { return (c-d); };

var s = example(5,6);
var t = example.subtract(9,4);
console.log(s, t);
```

你可以将上述代码复制并粘贴到JavaScript控制台中，它可以如期工作。

再来一次! 函数是对象？对象有属性。一个属性可以容纳一个对象，这个对象是一个函数？这种功能的嵌套是没有限制的。

由于函数是对象，它们可以像其他值一样被分配到变量中。这使得函数别名成为可能，即用一个简单的赋值语句给一个函数起一个不同的名字。记住，JavaScript中的标识符必须以字母（A-Z,a-z）、下划线（_）或美元符号（$）开始，随后的字符是字母、数字、下划线或美元符号。因此，下面的代码用一个较短的名字来别名上面定义的示例函数，然后用这个别名调用该函数。

```js
// Alias the function example with a shorter name
var _ = example;

// Call the function to add to numbers together
var result;
result = _(4,5);
```

如果您感到困惑，请重新阅读本节。

### jQuery 语法

jQuery库只定义了一个单一的函数! 令人惊讶的是，这个函数被称为`jQuery`。但是`jQuery`被别名为更简单的名字$，几乎总是被使用。

jQuery函数需要一个参数，一个选择器，用来寻找DOM中的元素。该函数总是返回一个jQuery对象，其中包含一个匹配的DOM元素的数组。jQuery对象也有预定义的属性，允许DOM元素的任何属性被检索或修改。

让我们先讨论一下选择器。选择器通常是一个字符串，描述你想要访问的DOM元素的一些特征。字符串的第一个字符决定了具体的特征。下面是可能的选择器的一个子集。

| 选择器  | 使用方法 | 使用说明 |
| ----------- | -------- | --------- |
| #id | $('#alpha') | 查找所有 id 为“alpha”的元素 |
| .class | $('.beta') | 找到所有使用名为“beta”的 CSS 类的元素 |
| elementType | $('div') | 找到所有的“div”元素 |

这里有一个完整的选择器的[列表](https://www.w3schools.com/jquery/jquery_ref_selectors.asp)。`$()`函数总是返回一个jQuery对象，该对象定义了可以操作DOM元素的属性和函数，被返回。下面是这些函数的几个例子。

| 函数  | 使用方法 | 使用说明 |
| ----------- | -------- | --------- |
| .text() | $('#alpha').text() | 返回所有id为'alpha'的元素的文本（去掉任何HTML）。 |
| .text(‘abc’) | $('#alpha').text('abc') | 设置所有 id 为“alpha”的元素的文本 |
| .html() | $('#alpha').html() | 返回文本，包括id为'alpha'的第一个元素的任何HTML标签。 |
| .html(‘abc’) | $('#alpha').html('abc') | 设置所有id为'alpha'的元素的文本，包括任何HTML标签。 |
| .width() | $('#alpha').width() | 返回第一个 id 为“alpha”的元素的宽度 |
| .width(‘50%’) | $('#alpha').width('50%') | 设置所有 id 为“alpha”的元素的宽度 |

注意，参数的存在与否决定了该函数是获取还是设置元素的相关属性。下面是一个完整的操纵[函数列表](https://www.w3schools.com/jquery/jquery_ref_html.asp)。

因为所有的查询和操作函数都会返回一个jQuery对象，函数的调用可以是连锁的。例如，接下来的例子是设置一个网页上所有div元素的宽度，高度和颜色：
```js
$('div').width('50%').height('30px').css('color','red');
```

关于jQuery的最后一点说明。有一组不符合上述方案的实用函数。它们被定义为$()函数的属性，所以它们被这样调用：`$.inArray()` 或 `$.trim()`。每个函数都返回不同类型的返回值，所以这些函数不能被链起来。

### jQuery 备忘单

希望你能得到jQuery的工作原理的大概念。这张[小抄](http://learnwebgl.brown37.net/browser_environment/documents/jQuery-1.5-Visual-Cheat-Sheet.pdf)（[来源](http://www.cheat-sheets.org/saved-copy/jQuery-1.5-Visual-Cheat-Sheet.pdf)）可能对你有帮助。