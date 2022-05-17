## 异步文件加载

请记住，WebGL程序存储在服务器上，下载到客户端的计算机上，然后执行。由于WebGL程序是由多个文件组成的，您的WebGL程序需要等待，直到它得到所有需要的文件，然后才开始渲染。这有点麻烦，因为这些文件是通过互联网传输的，不能保证按照请求的相同顺序到达。浏览器也不需要按特定顺序下载文件。你可能已经看到了包含许多大型图片的网页的这种行为。有些浏览器会先下载页面上当前可见的图片，而不管它们在HTML文档中的顺序如何。这种做法的技术名称是异步文件加载。

### 请求文件下载

有两种基本方法可以让网页从服务器上请求一个文件。最直接的方法是在页面的HTML描述中包括对它的引用。下面是几个文件下载的例子。
```js
<script src="../../lib/jquery.js"></script>
<link rel="stylesheet" href="../../lib/webglcode.css" />
<img src="picture.jpg">
<object width="400" height="400" data="model.obj"></object>
```

这并不明显，但这些文件下载的某些类型成为网页上的可见元素，而另一些则不是。在上面的例子中，从脚本和链接标签中下载的数据在页面上永远不可见。然而，从img和object标签下载的数据则成为页面上可见的一部分。你可以在HTML元素上设置特殊的属性来隐藏它们，但既然有第二种使用JavaScript下载文件的方法，为什么还要这么麻烦呢。

在JavaScript中，你可以请求下载一个文件，然后要求JavaScript在文件准备好进行处理时 "请调用这个特定的函数"。这个 "处理函数 "被称为回调函数，因为它是在未来某个时间，当某个事件发生后被调用。本例中的事件是成功下载了一个文件。为什么必须这样做呢？因为文件是以异步方式从服务器下载的，你不希望你的JavaScript代码 "挂起 "来等待文件下载，特别是在文件很大的情况下。

jQuery的$.get(url, callback(data))函数将从服务器上获取一个文件，然后在文件完全下载并准备好进行处理时调用callback(data)函数。一个参数，数据，是文件的内容。除了回调函数只能有一个参数data之外，这一切都相当简单。如果你要下载多个文件，你将不得不为每个下载的文件设置一个单独的函数，这是不现实的。这时，JavaScript上下文的概念就非常有用了。记住，JavaScript函数总是在一个上下文中执行。考虑一下下面的代码例子。

```js
function getFile(file_url, storage) {
  $.get(file_url, function (data) { storage.push(data); });
}
```

$.get()函数有两个参数。1）一个包含通用资源定位器的字符串，如".../lib/example.txt"，和2）一个回调函数，用于接收数据并对其进行处理。回调函数是一个匿名函数--它没有明确的名字--因为它不需要一个名字。但这里有一个奇怪的部分。回调函数将在 getFile() 函数的上下文中被调用。这意味着回调函数可以访问 getFile() 所知道的所有变量。因此它可以访问存储变量并改变它。

这种语言特性的技术名称是闭包。没有必要成为封闭代码的专家，但由于JavaScript的工作方式，封闭往往是完成异步任务的唯一途径。

### Learn_webgl 对象

对于一个WebGL程序，我们需要从服务器下载几种类型的数据文件：

- 我们的三维场景对象的模型数据
- 定义模型表面属性的材料描述，包括纹理图，以及
- 用于渲染的WebGL着色器程序。

这些文件的数量将取决于你的场景的复杂性和渲染的复杂性。我们将使用一个叫做Learn_webgl的JavaScript对象来下载所有这些文件。当你创建一个Learn_webgl对象的时候，你要传递给它一个着色器文件名的列表和一个模型文件名的列表。构造函数通过将每个列表中的文件数量相加来确定它需要下载的文件数量。

```js
downloads_needed = shader_list.length + model_list.length;
number_retrieved = 0;
```

然后，它继续为每个需要的文件调用$.get()。在每次成功下载后，它都会将数据保存在一个对象中，将number_retrieved增加1，并调用一个名为_initializeRendering()的函数。这个函数只有在所有需要的文件都被检索到时，才开始对其画布进行WebGL渲染。该函数看起来像这样。

```js
function _initializeRendering() {

  if (number_retrieved >= downloads_needed) {
    // Pre-process the model data
    // Start rendering the canvas
  }
}
```