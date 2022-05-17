## 画布和GL上下文

在网页上实时生成的图形（相对于图片的显示）总是被画进一个矩形的HTML画布元素。一个画布元素有一个上下文。上下文定义了图形的创建方式。有一个用于创建二维图形的API，我们在这里就不花时间讨论了。(对于WebGL编程，你需要获得WebGL上下文。上下文是一个JavaScript对象，它存储了画布中显示的图形的所有状态和行为。

### 获取画布元素

使用JavaScript，你需要获得你想画到的画布元素。如果网页上只有一个画布元素，你可以通过它的类型获得该元素。但一个更普遍的方案是为画布使用一个唯一的ID，它支持一个网页上的多个画布元素。定义画布元素的标准HTML代码如下所示。如果浏览器不支持画布元素，它将显示\<canvas>标签内的信息。否则，它将在页面上显示一个矩形区域。请注意，画布元素被分配了一个唯一的ID。

```js
<canvas id="W1_canvas">
  Please use a browser that supports "canvas"
</canvas>
```

在JavaScript中，在一个网页被加载后，你可以使用 **document.getElementById(id)** 函数获得一个画布元素。你应该适当地处理错误，所以像这样的函数是典型的。
```js
/**
 * Get a canvas element given its unique id
 *
 * @param canvas_id The HTML id of the canvas to render to.
 * @return the matching canvas element
 */
function getCanvas(canvas_id) {
  var canvas;

  canvas = document.getElementById(canvas_id);
  if (!canvas || canvas.nodeName !== "CANVAS") {
    console.log('Fatal error: Canvas "' + canvas_id + '" could not be found');
  }
  return canvas;
}
```

### 获取 WebGL 上下文

现在我们有一个代表画布元素的对象，我们使用该对象的一个名为 **getContext('webgl')** 的方法来获得一个代表画布的3D图形状态和行为的WebGL对象。同样，我们应该适当地处理错误。
```js
/**
 * Get a WebGL context from a canvas
 *
 * @param canvas The DOM element that represents the canvas.
 * @return The WebGL context for the canvas.
 */
function getWebglContext(canvas) {
  var context;

  context = canvas.getContext('webgl');
  if (!context) {
    console.log("No WebGL context could be found.");
  }

  return context;
};
```

### WebGL 上下文

WebGL上下文是一个JavaScript对象，用于存储图形库的当前状态。WebGL是一个状态机。这意味着，如果您将一个WebGL变量设置为一个特定的值，该值将不会改变，直到您改变它。例如，你可以设置一次用于清除画布背景的颜色。你不需要每次想清除窗口时都设置颜色值。

WebGL上下文对象还为整个WebGL API定义了方法。所有的WebGL功能都是通过上下文对象访问的。惯例是将上下文对象命名为`gl`。下面是一个典型的WebGL程序的开始。

```js
// Get the rendering context for the canvas
gl = getWebglContext( getCanvas(canvas_id) );
if (!gl) {
  return null;
}

// Initialize the state of the WebGL context
gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);
gl.clearColor(0.9, 0.9, 0.9, 1.0);
```

请注意，所有的WebGL功能都是通过`gl`对象访问的。

每个画布都有自己的WebGL上下文。如果您在一个网页上有4个画布元素，您将不得不存储4个独立的WebGL上下文。遗憾的是，对于WebGL 1.0来说，上下文不能在它们之间共享数据或着色器程序。据称，未来的WebGL版本将允许上下文之间共享资源。