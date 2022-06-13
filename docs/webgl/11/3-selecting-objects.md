## 选择物体

交互式应用程序和游戏允许用户从 3D 渲染场景中选择对象。本课解释了识别用户选择对象的标准技术。

### “选择”算法

当用户点击渲染图像中的特定位置时，我们希望识别在该位置渲染的对象。如果您考虑一下，解决方案很简单：对于渲染图像中的每个像素，不要存储对象的颜色，而是存储该对象的唯一标识符。当用户点击一个像素时，返回为该像素存储的唯一标识符。当然我们不希望用户看到这些唯一标识符，所以我们渲染了两次场景，第一次使用唯一标识符，第二次使用正确的颜色。用户永远不会看到包含标识符的渲染图像，因为我们从未将它显示到画布窗口。该算法需要两个着色器程序。 “selection_program*”生成标识符的呈现，“visible_program”生成显示给用户的呈现。

假设我们想知道哪个对象在鼠标位置（mouse_x，mouse_y）。该算法在伪代码中遵循以下步骤：

- gl.useProgram(selection_program)
- 清除颜色缓冲区和 z 缓冲区。
- 渲染场景。
- 从标识对象的颜色缓冲区中读取位置 (mouse_x,mouse_y) 处的像素。
- gl.useProgram(visible_program)
- 清除颜色缓冲区和 z 缓冲区。
- 渲染场景。
- 颜色缓冲区的内容在画布窗口中变得可见，因为 JavaScript 代码终止了它的执行。 （参见第 11.1 课中关于双缓冲的讨论。）

在查看该算法的完整实现之前，我们需要讨论几个技术问题。

- 如何从特定位置的颜色缓冲区中读取值？
- 如何将唯一的对象标识符作为颜色值存储在颜色缓冲区中？
- 如何使用两个不同的着色器程序渲染模型？

### 从颜色缓冲区读取

渲染操作后，您可以使用 gl.readPixels() 函数访问生成的颜色缓冲区。这允许您将图像的矩形部分读入颜色分量值的一维数组。 OpenGL 支持多种图像格式，但 WebGL 1.0 仅支持一种图像格式：每个分量 8 位，每像素 4 个分量 (RGBA)。要检索从左下角 (x,y) 开始的尺寸为宽乘高的颜色缓冲区的矩形部分，您可以使用以下命令：

```js
pixels = new Uint8Array(width*height*4); // RGBA values for each pixel
gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
```

像素数据以行优先顺序存储在一维数组中。

我们只需要从颜色缓冲区中获取单个像素值，所以我们的命令是，

```js
pixels = new Uint8Array(4); // A single RGBA value
gl.readPixels(mouse_x, mouse_y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
```

但是，画布窗口和颜色缓冲区的坐标系并不相同。画布窗口的 Y 轴从左上角开始向下延伸到屏幕。颜色缓冲区的图像坐标系的 Y 轴从左下角开始向上移动。我们需要根据颜色缓冲区的高度反转 mouse_y 的值。花点时间向自己证明这个等式是正确的：
```js
mouse_y = image_height - mouse_y;
```
最后，请注意像素是一个 UNSIGNED_BYTE 数组，而不是浮点数。每个分量都是 0 到 255 范围内的 8 位无符号整数。

### 将标识符存储为颜色

不失一般性，我们可以假设对象标识符是整数。我们需要将整数 ID 存储到由浮点颜色值定义的颜色缓冲区中。在片段着色器中，您将片段的颜色设置为 vec4 值，如下所示，

```js
gl_FragColor = vec4(red, green, blue, alpha);
```

其中每个分量值都是 0.0 到 1.0 范围内的浮点值。但是，颜色缓冲区不存储浮点值；它以有限的精度存储整数值。我们可以使用这些 JavaScript 调用来获取颜色缓冲区中各个值使用的位数：
```js
red_bits   = gl.getParameter(gl.RED_BITS);
green_bits = gl.getParameter(gl.GREEN_BITS);
blue_bits  = gl.getParameter(gl.BLUE_BITS);
alpha_bits = gl.getParameter(gl.ALPHA_BITS);
total_bits = red_bits + green_bits + blue_bits + alpha_bits;
```

要将 [0.0, 1.0] 范围内的浮点值转换为有限精度整数，我们可以按允许的精度对其进行缩放，然后将其四舍五入为最接近的整数。设 f 是我们想要映射到整数范围 [0,n-1] 的浮点值，其中 n 是 2 的幂。例如，范围 [0,15]，其中 n = 16 = 24。这操作需要这个简单的方程，

```js
var i = Math.round(f * (n-1));
```

我们想用一系列整数来表示一个更大的整数。右图显示了颜色组件的概念布局。要计算单个整数值，我们需要将每个值缩放（或移位）到更大整数中的正确位置，其中比例因子是 2 的幂。每个值右侧的位数为我们提供所需的比例因子.最终结果是一个可以将由 4 个无符号整数组成的颜色值转换为单个整数标识符的函数：

<center>
  <img src="/11/bit_arrangement.png" />
  <p>单个整数值的位排列</p>
</center>

```js
/** ---------------------------------------------------------------------
 * Given a RGBA color value from a color buffer, where each component
 * value is an integer in the range [0,numBits-1].
 * @param r Number Red   component in the range [0,numBits-1]
 * @param g Number Green component in the range [0,numBits-1]
 * @param b Number Blue  component in the range [0,numBits-1]
 * @param a Number Alpha component in the range [0,numBits-1]
 * @returns Number An integer identifier.
 */
self.getID = function (r,g,b,a) {
  // Shift each component to its bit position in the integer
  return ( r * Math.pow(2, green_bits+blue_bits+alpha_bits)
         + g * Math.pow(2, blue_bits+alpha_bits)
         + b * Math.pow(2, alpha_bits)
         + a );
};
```

现在让我们反过来。给定一个整数 ID，将其转换为 RGBA 颜色。单个颜色分量值 (r,g,b,a) 可以通过除以 2 的幂来计算，以将它们移动到最低有效位，然后使用 floor 函数去除小数部分。在计算下一个值之前，我们从原始 ID 中删除第一部分的值。

```js
self.createColor = function (id) {
  var r, g, b, a;

  r = Math.floor(id / Math.pow(2,green_bits+blue_bits+alpha_bits));
  id = id - (r * Math.pow(2,green_bits+blue_bits+alpha_bits));

  g = Math.floor(id / Math.pow(2,blue_bits+alpha_bits));
  id = id - (g * Math.pow(2,blue_bits+alpha_bits));

  b = Math.floor(id / Math.pow(2,alpha_bits));
  id = id - (b * Math.pow(2,alpha_bits));

  a = id;

  return new Float32Array([ r/(Math.pow(2,red_bits)-1),
                            g/(Math.pow(2,green_bits)-1),
                            b/(Math.pow(2,blue_bits)-1),
                            a/(Math.pow(2,alpha_bits)-1) ] );
};
```

这两个函数 createColor() 和 getID() 非常重要，我们应该避免一遍又一遍地重新计算 2 的幂。将这些函数放入 JavaScript“类”中会很有意义。下面是一个 JavaScript 类定义，它预先计算了所需的比例和移位因子以简化计算。

```js
/** =======================================================================
 *
 * @param gl WebGLRenderingContext
 * @constructor
 */
window.ColorToID = function (gl) {

  var self = this;

  // Get the precision of each color component
  var red_bits   = gl.getParameter(gl.RED_BITS);
  var green_bits = gl.getParameter(gl.GREEN_BITS);
  var blue_bits  = gl.getParameter(gl.BLUE_BITS);
  var alpha_bits = gl.getParameter(gl.ALPHA_BITS);
  var total_bits = red_bits + green_bits + blue_bits + alpha_bits;

  var red_scale   = Math.pow(2, red_bits);
  var green_scale = Math.pow(2, green_bits);
  var blue_scale  = Math.pow(2, blue_bits);
  var alpha_scale = Math.pow(2, alpha_bits);

  var red_shift   = Math.pow(2, green_bits + blue_bits + alpha_bits);
  var green_shift = Math.pow(2, blue_bits + alpha_bits);
  var blue_shift  = Math.pow(2, alpha_bits);

  var color = new Float32Array(4);

  /** ---------------------------------------------------------------------
   * Given a RGBA color value, where each component is in the range [0.0,1.0],
   * create a integer ID.
   * @param r Number Red component in the range [0.0,+1.0]
   * @param g Number Green component in the range [0.0,+1.0]
   * @param b Number Blue component in the range [0.0,+1.0]
   * @param a Number Alpha component in the range [0.0,+1.0]
   * @returns Number An integer ID
   */
  self.createID = function (r, g, b, a) {
    // Change the color component values from the range (0.0, 1.0) to integers
    // in the range (0, 2^bits-1).
    r = Math.round(r * (red_scale   - 1));
    g = Math.round(g * (green_scale - 1));
    b = Math.round(b * (blue_scale  - 1));
    a = Math.round(a * (alpha_scale - 1));

    // Shift each component to its bit position in the integer
    return (r * red_shift + g * green_shift + b * blue_shift + a);
  };

  /** ---------------------------------------------------------------------
   * Given a RGBA color value from a color buffer, where each component
   * value is an integer in the range [0,numBits-1].
   * @param r Number Red   component in the range [0,numBits-1]
   * @param g Number Green component in the range [0,numBits-1]
   * @param b Number Blue  component in the range [0,numBits-1]
   * @param a Number Alpha component in the range [0,numBits-1]
   * @returns Number An integer identifier.
   */
  self.getID = function (r, g, b, a) {
    // Shift each component to its bit position in the integer
    return (r * red_shift + g * green_shift + b * blue_shift + a);
  };

  /** ---------------------------------------------------------------------
   * Given an integer ID, convert it into an RGBA color.
   * @param id
   * @returns Float32Array An RGBA color as a 4-component array of floats.
   */
  self.createColor = function (id) {
    var r, g, b, a;

    r = Math.floor(id / red_shift);
    id = id - (r * red_shift);

    g = Math.floor(id / green_shift);
    id = id - (g * green_shift);

    b = Math.floor(id / blue_shift);
    id = id - (b * blue_shift);

    a = id;

    color[0] = r / (red_scale - 1);
    color[1] = g / (green_scale - 1);
    color[2] = b / (blue_scale - 1);
    color[3] = a / (alpha_scale - 1);

    return color;
  };
};
```

### 使用两个着色器程序进行渲染

给定一个模型，我们希望使用不同的着色器程序以不同的方式渲染它。一个着色器程序会将“标识符”渲染到颜色缓冲区，而另一个着色器程序会将颜色渲染到颜色缓冲区。为了提高效率，您应该使用具有相同顶点属性数据的相同缓冲区对象。但是，不同的着色器程序的渲染初始化会有所不同。您可以通过使用参数 gl.CURRENT_PROGRAM 调用 gl.getParameter() 函数来确定当前正在使用哪个着色器程序，从而执行正确的初始化。例如：

```js
if (gl.getParameter(gl.CURRENT_PROGRAM) == select_program) {
  // Perform the initialization to render for the "select_program"
  // ...
} else {
  // Perform the initialization to render for the "visible_program"
  // ...
}
```

这在初始化着色器程序的统一变量时也很有用，因为您只能将数据传递给活动的着色器程序。尝试将值发送到未“使用”的着色器程序会产生 WebGL 错误。

### 实验

试用以下演示程序，然后按如下所述修改代码。

点击查看[交互式例子](http://learnwebgl.brown37.net/11_advanced_rendering/selecting_objects.html#experiment)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/11_advanced_rendering/selection_example/selection_example.html)

实验：

- 研究第 145-167 行中的 select 函数。请注意，它调用 render() 函数两次，每次启用不同的着色器程序。
- 不要通过注释掉第 165-166 行来渲染场景两次。这些行更改着色器程序，然后进行渲染。如果您不使用“visible_program”着色器进行渲染，您将看到包含编码 ID 的“标识符”渲染。
- 取消注释第 161-162 行以显示所选像素的值及其代表的标识符值。尝试选择各种球体并记下画布下方窗口的输出。请注意，（229,229,229,255）的“选定像素”颜色（转换为单个整数值 3,857,049,087）是背景的颜色，因此没有选择球体。背景应该是一个不会转换为有效 ID 的值。
- 请注意使用 gl.getParameter(gl.CURRENT_PROGRAM) 来控制执行哪些渲染代码。
- 请注意，在选择时渲染两次场景似乎不会影响动画的帧速率。如果在第 49 行将球体的数量从 30 个增加到 300 个会怎样？ 3000怎么样？ 30000怎么样？