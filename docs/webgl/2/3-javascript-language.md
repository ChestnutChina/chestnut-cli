## JavaScript语言

JavaScript语言是与HTML一起开发的，以便在网页被下载到客户端后能够对其进行操作。JavaScript在后台默默地运行，处理用户事件并动态地修改网页。如果JavaScript代码出现问题或产生错误，它被设计成无声无息地失败，这样普通用户就不会知道出了问题。

JavaScript和Java没有任何共同之处。它们是为不同目的而设计的完全不同的语言。

JavaScript 的主要区别是：

- 它是一种解释型编程语言；它没有被编译，尽管有一些及时的JavaScript编译器可以提高其执行速度。
- 变量是动态类型的。变量中的数据类型可以在任何时候改变。前一刻，一个变量可能包含一个字符串，后一刻则是一个数字。
- JavaScript从不 "崩溃"。如果发生错误，当前的执行线程会被终止，但这对网络浏览器的运行没有影响。
- JavaScript是面向对象的，而函数实际上就是对象!
- JavaScript是一种多范式语言，支持面向对象编程、命令式编程和函数式编程的思想。

JavaScript的语法与C编程语言密切相关。这张JavaScript[快速参考卡](http://www.cheat-sheets.org/saved-copy/jsquick.pdf)包含了你在进行WebGL编程时应该需要的大部分语言语法。请花一些时间来研究这张参考卡。卡片上的颜色编码的图例在文件的最后。

### Context(上下文)

JavaScript中的所有东西都是一个对象。对象是一个类的实例。对象包含数据，并有可以操作这些数据的函数。一个对象的函数有其工作的上下文。它们的上下文是由它们可以访问的数据和这些数据的当前状态定义的。JavaScript中的每个函数都是从一个 "上下文 "中执行的，这个想法对于理解JavaScript的工作原理至关重要。让我们来看看一些例子。如果一个函数被调用是因为用户点击了一个按钮，那么这个函数就在HTML按钮元素的上下文中执行。如果一个函数是由从JavaScript文件中加载的代码调用的，那么它就在全局地址空间的上下文中执行。如果一个函数是从一个对象内部调用的，那么它的上下文就是那个对象。在JavaScript中有一个关键词，它总是引用函数被调用的上下文。这个关键字被称为`this`。在Java、C++和其他面向对象的编程语言中，这个关键词的含义完全不同。不要把它们混淆了。

这一点非常重要，需要重复说明。在JavaScript中，关键词`this`引用了函数被调用的上下文。当你对JavaScript有了更多的经验时，你会看到如何以强大的方式使用它。

### JavaScript 中的类和对象

在JavaScript中定义类和对象可能会令人困惑，尤其是当你期望JavaScript的行为与你所知道的其他语言一样时。由于我们将把所有的WebGL代码都开发成对象，我们需要特别讨论一下JavaScript是如何实现面向对象编程的。

一个类的定义方式与普通函数的定义方式相同。函数的定义基本上就是类的构造函数。如果你以正常的方式调用该函数，它就会像一个正常的函数一样行动。如果你在函数调用前使用new命令，你就是在创建一个该类的对象。希望一个例子能让你更清楚地了解这一点。下面是一个简单的函数定义。

```js
function Example(a,b,c) {
  // Do some stuff
}
```

你可以以正常方式调用这个函数，它将进行一些处理，像这样：
```js
Example(alpha, beta, gamma);
```

或者，你可以像这样从定义中创建一个对象：
```js
var my_object = new Example(alpha, beta, gamma);
```

当你创建一个对象时，任何在函数内定义的数据都会保留在对象内，并且这些数据可以在以后的时间里被访问和修改。

### 类中的公共和私有数据

默认情况下，在定义类的函数内声明的变量是私有的。在下面的例子中，所有的数据和函数都是私有的：
```js
function ExampleClass(a,b,c) {
  // Private class variables
  var s,t,u;

  // Private functions
  function _innerOne() {
    // can manipulate s, t, and u
  }

  function _innerTwo() {
    // can manipulate s, t, and u
  }
}
```

这是JavaScript中不可变对象的一个例子。从这个类创建的对象不能被修改，因为它没有公共数据或公共函数。为了使变量或函数公开，你可以把它们作为属性添加到对象中。对象的属性是用点号来访问的，如**object.property**。由于JavaScript是一种解释型的动态语言，新的属性可以在任何时候被添加到一个对象中。如果你拼错了属性名称，这可能会导致难以找到的错误。拼错的属性名不是在操作一个现有的属性，而是在一个对象上添加一个新的不需要的属性。所以要注意你的拼写!

当通过调用`new`命令创建一个对象时，`this`关键字是对新对象的引用（就像在Java和C++中）。因此，你可以在任何变量或函数前加上`this`关键字，使它们成为公共的。下面是一个包括私有和公有数据及函数的类定义实例。

```js
function ExampleClass(a,b,c) {
  // Private class variables
  var s,t,u;

  // Public class variables (actually properties of the object)
  this.m = value1;
  this.n = value2;

  // Public function
  this.doSomething = function () {
    // can manipulate all private and public data
    // can call all private and public functions
  }

  // Private function
  function _innerOne() {
    // can manipulate all private and public data
    // can call all private and public functions
  }
}
```

如果我们像这样从这个例子类中制作一个对象:
```js
var my_object = new ExampleClass(alpha, beta, gamma);
```

那么下面的语句是有效的，因为它们是在访问对象的公共成员。
```js
my_object.doSomething();
my_object.m = 5;
```

然而，以下语句是无效的，因为它们试图使用对象的私有成员。
```js
my_object._innerOne();  // would cause an error
my_object.s = 5;        // would cause an error
```

但是，等等! 上面的例子有一个很大的缺陷。关键字`this`的值随上下文变化。当对象被实际使用时，除了对对象的引用外，关键字`this`将具有各种其他的值。这将导致代码的失败。解决方案是不使用关键字`this`来访问公共成员。我们将在构造函数中使用`this`来获取对象的引用，而不是在成员函数中使用它。

下面的例子显示了这是如何工作的。当构造函数被执行时，由于新的命令上下文，关键字`this`将是对新对象的一个引用。使用一个名为`self`的私有变量来存储对象本身内部对新对象的引用，这是一个相对标准的做法。然后，本地私有变量`self`在类定义的其余部分被使用。

```js
function ExampleClass(a,b,c) {

  var self = this; // store a local reference to the new object

  // Private class variables
  var s,t,u;

  // Public class variables (actually properties of the object)
  self.m = value1;
  self.n = value2;

  // Public function
  self.doSomething = function () {
    // can manipulate all private and public data using self.property
    // can call all private and public functions using self.property
  }

  function _innerOne() {
    // can manipulate all private and public data using self.property
    // can call all private and public functions using self.property
  }
}
```
我们鼓励你重新阅读上述描述。通常第二次阅读会更有意义。

### 一些例子

在下面的WebGL演示代码中，有两个JavaScript类定义的例子。现在不要试图去理解代码的功能，而是要研究类定义的结构。当你研究这些例子时，请注意：

- 所有不在成员函数内的代码构成了类的构造函数。这个代码在类的对象被创建时执行一次。
- 使用`严格模式`，要求所有的变量在使用前都被定义，这意味着构造函数的代码有时是不连续的。
- 注意变量`self`是如何被用来定义和访问对象的公共成员的。
- 在这些例子中，需要阅读的重要内容是`注释!`

点击查看[交互式例子](http://learnwebgl.brown37.net/browser_environment/javascript_language.html#some-examples)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/browser_environment/object_examples/object_examples.html)

### 编码标准

在离开这个关于JavaScript的讨论之前，请回顾一下我们将要使用的编码标准：

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
- 命名约定
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
    ```js
    /**
     * Reverse a string
    *
    * @param  {String} input_string String to reverse
    * @return {String} The reversed string
    */
    function reverseString(input_string) {
      // ...
      return output_string;
    };
    ```