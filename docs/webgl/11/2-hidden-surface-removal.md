## 隐藏表面去除

[隐藏表面去除](https://en.wikipedia.org/wiki/Hidden_surface_determination)的问题是确定场景中的哪些三角形可以从虚拟相机中看到，以及哪些三角形是隐藏的。这是一个很难有效解决的问题，尤其是在三角形相交或整个模型相交的情况下。已经开发了许多算法来解决这个问题。让我们只讨论其中的两个。

### 画家的算法

人类艺术家通过首先绘制背景然后逐层绘制直到最后要绘制的是前景中的元素来创建一幅画。这可以在计算机中模拟，方法是根据场景中的模型与相机的距离进行排序，然后从后到前渲染它们。这是一个简单的算法，但存在以下问题：

- 排序很费时间。如果相机或模型正在移动，则在每次渲染之前都需要进行排序。
- 构成模型的各个三角形也必须根据它们与相机的关系进行排序。快速渲染依赖于模型的数据存储在 GPU 的内存中并且永远不会被修改。对模型的三角形进行排序打破了这个方案。
- 如果三角形相交，则无法对它们进行排序，以便其中一个比另一个更靠近相机。为了准确地渲染它们，它们的交点却要被发现，或者三角形必须被分割成可以排序的更小的三角形。

这称为[画家算法](https://en.wikipedia.org/wiki/Painter%27s_algorithm)，在实践中很少使用，除了渲染透明模型，我们将在第 11.4 课中讨论。

### Z-缓冲区算法

“z 缓冲区”是一个 2D 值数组，其大小与存储渲染图像的像素颜色的颜色缓冲区相等。 z 缓冲区中的每个值都表示在该像素处渲染的对象与相机之间的距离。请记住，相机始终位于原点，向下看 -Z 轴。因此，一个元素的 Z 值表示从该元素到相机的距离。

要渲染场景，z-buffer 中的每个值都设置为每个元素可以容纳的最大值。在渲染组成图形基元的每个像素时，将其几何图形的 z 分量与 z 缓冲区中的当前值进行比较。如果 z 分量小于 z 缓冲区中已有的值，则该对象更靠近相机，因此其颜色被放置在帧缓冲区中，并且 z 缓冲区的值更新为这个新的 z 值。如果对象的 z 值大于当前的 z 缓冲区值，则该对象对相机不可见，因为它前面有一个更近的对象。下面的伪代码很好地解释了这个算法。 clearBuffers 函数被调用一次以初始化渲染。渲染的每个图元的每个像素都会调用 renderPixel 函数。 （这些函数是在图形管道中为您实现的；您不必实现它们。）

```JavaScript
void clearBuffers() {
  for (x = 0; x < image_width; x++) {
    for (y = 0; y < image_height; y++) {
      zbuffer[x][y] = maximum_z_value;
      colorbuffer[x][y] = background_color;
    }
  }
}

void renderPixel(x, y, z, color) {
  if (z < zbuffer[x][y]) {
    zbuffer[x][y] = z;
    colorbuffer[x][y] = color;
  }
}
```

[z-buffer算法](https://en.wikipedia.org/wiki/Z-buffering)是解决隐藏表面问题最广泛使用的方法。与其他隐藏表面去除算法相比，它具有以下主要优点：
- 不需要排序。模型可以按任何顺序呈现。
- 不需要几何交叉计算。即使对于相交或重叠的三角形，该算法也会产生正确的输出。
- 该算法实现起来非常简单。

z-buffer算法的缺点包括：

- z 缓冲区需要大量内存。例如，假设 z-buffer 中的每个值都是 32 位浮点值，则 1024x768 像素的渲染图像需要 3MB 内存来存储其 z-buffer。
每个原始元素的每个像素都必须被渲染，即使它们中的许多从未将它们的颜色写入帧缓冲区。
- 如果两个基元在 3D 空间中位于完全相同的位置，因为它们的位置在它们各自的表面上进行插值，由于浮点舍入误差，每个对象的 z 值通常会有非常小的差异。- 这些微小的差异将在相邻像素的基元之间交替，从而在渲染中产生随机和奇怪的图案。这被称为“z-fighting”，可以通过从不将两个图元放置在 3D 空间中的同一位置来避免这种情况。

### Z-buffer 算法的 WebGL 实现

WebGL 图形管道不会自动执行隐藏表面移除。您必须使用以下命令启用它：

```js
gl.enable(gl.DEPTH_TEST);
```

由于 WebGL 是一个“状态机”，你只需要执行一次这个命令，除非你想为特殊类型的渲染打开和关闭隐藏表面移除。要禁用隐藏表面移除，请调用 gl.disable(gl.DEPTH_TEST);

在渲染开始之前，通常需要清除三个缓冲区。这些是使用 WebGL 库中定义的枚举类型常量来标识的。 （切勿使用数值；始终使用常量名称。）这些值是“位标志”。请注意，每个值都有一个位集。您可以使用按位或运算将“位标志”组合成单个值，在 JavaScript 中是单个竖线“|”。 （请注意，任何以 0x 开头的值都是十六进制值（以 16 为基数）。）

```js
const GLenum DEPTH_BUFFER_BIT   = 0x00000100;
const GLenum STENCIL_BUFFER_BIT = 0x00000400;
const GLenum COLOR_BUFFER_BIT   = 0x00004000;
```

要在渲染开始时清除帧缓冲区和 z 缓冲区，请调用 gl.clear() 函数。输入参数是一个包含“位标志”的整数，指示要清除哪些缓冲区。您可以同时清除一个、两个或三个缓冲区。命令
```js
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
```

清除颜色和深度缓冲区，或者更具体地说，清除颜色缓冲区和 z 缓冲区。颜色缓冲区中的每个像素都设置为背景颜色。 z 缓冲区中的每个元素都设置为可能的最大 z 值。

### WebGL 详细信息

请注意，根据您的 WebGL 上下文的属性，默认行为是在每次刷新屏幕画布窗口后自动清除屏幕外帧缓冲区。因此，您实际上不需要在每次渲染之前调用 gl.clear() 。但是，您可以通过将 WebGL 上下文的 preserveDrawingBuffer 属性设置为 true 来修改 WebGL 上下文的属性以防止这种自动清除操作。这必须在最初创建上下文时完成，如下所示：

```js
context = canvas.getContext('webgl', { preserveDrawingBuffer : true } );
```

（有关 WebGL 上下文的所有可能属性的列表，请参阅此 [WebGL API 页面](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext)。）即使您关闭了画布帧缓冲区的自动清除，大多数浏览器似乎仍然会在页面刷新时清除它们。因此，在浏览器中执行非标准渲染技术可能很困难。为了保证可预测的行为，您应该始终清除帧缓冲区和 z 缓冲区作为任何渲染操作的第一步。

对于一般渲染 gl.enable(gl.DEPTH_TEST);和 gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);命令是您唯一需要的命令。但是，WebGL 为您提供了一些工具来以更精细的细节级别控制 z 缓冲区，以解决特殊的渲染问题。您可能永远不需要以下命令，但您应该知道它们存在。

- gl.depthMask(bool flag) ：启用或禁用写入 z 缓冲区。这允许您将模型渲染到帧缓冲区，但不更新这些像素的深度。如果您渲染一个透明模型并且您希望远离相机的对象仍然被渲染，您可能想要这样做。这只有在渲染过程中混合颜色时才有意义。请参阅第 11.4 课中的 alpha 混合讨论。
- clearDepth(float depth)，其中 depth 是介于 0.0 和 1.0 之间的值。这将设置用于清除 z 缓冲区的值。 “深度”是可以存储在 z 缓冲区中的值范围的百分比。默认值为 1.0，它将 z 缓冲区清除为其最大值。
- depthFunc(enum func)，其中参数可以是以下之一：gl.NEVER、gl.ALWAYS、gl.LESS、gl.EQUAL、gl.LEQUAL、gl.GREATER、gl.GEQUAL、gl.NOTEQUAL。这使您可以对确定颜色是否写入帧缓冲区的测试进行精细控制。

鉴于能够为 z-buffer 算法设置这些额外的值，我们可以使用以下伪代码更详细地描述该算法：

```js
void clearBuffers() {
  for (x = 0; x < image_width; x++) {
    for (y = 0; y < image_height; y++) {
      zbuffer[x][y] = maximum_z_value * depthPercentage;
      colorbuffer[x][y] = background_color;
    }
  }
}

void renderPixel(x, y, z, color) {
  if (depth_text_is_enabled) {
    switch (depthFuncMode) {
      case NEVER:    condition = false;
      case ALWAYS:   condition = true;
      case LESS:     condition = (z <  zbuffer[x][y]);
      case EQUAL:    condition = (z == zbuffer[x][y]);
      case LEQUAL:   condition = (z <= zbuffer[x][y]);
      case GREATER:  condition = (z >  zbuffer[x][y]);
      case GEQUAL:   condition = (z >= zbuffer[x][y]);
      case NOTEQUAL: condition = (z != zbuffer[x][y]);
    }
    if (condition) {
      if (zbufferWriteEnabled) { zbuffer[x][y] = z; }
      colorbuffer[x][y] = color;
    }
  else {
    // No hidden surface removal
    colorbuffer[x][y] = color;
  }
}
```

### 实验

使用上一课中的 WebGL 演示程序，进行以下建议的更改，以查看这些 z-buffer 命令对渲染的影响。

- 在第 128 行，更改 gl.enable(gl.DEPTH_TEST);到 gl.disable(gl.DEPTH_TEST);。这将关闭隐藏的表面移除。重新启动程序后，注意奇怪的效果图。您基本上看到的是没有任何排序的“画家算法”。三角形是一个接一个地绘制的，而您看到的是最后绘制的三角形。
- 注释掉清除缓冲区的第 67 行。多么混乱！
- 启用深度缓冲区，清除颜色缓冲区，但不清除深度缓冲区。渲染的结果有意义吗？

点击查看[交互式例子](http://learnwebgl.brown37.net/11_advanced_rendering/hidden_surface_removal.html#experimentation)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/transformations2/scale_about_origin/scale_about_origin.html)