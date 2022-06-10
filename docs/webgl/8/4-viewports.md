## 视口

投影变换后，您的模型已准备好进行裁剪，这将丢弃不在相机视野内的任何原始元素（点、线或三角形）。剪裁时间后创建图像！

本课介绍如何将场景的几何数据映射到 2D 图像。

### 视口转换

您的几何数据具有 (x,y,z) 值，这些值位于以原点为中心的 2×2×2 裁剪体积内。是时候让管道开始创建 2D 图像了。图像将被映射到 HTML 画布元素中，因此图像被创建为与画布元素相同的大小（以像素为单位）。 WebGL 图像使用以左下角为原点的坐标系，+X 轴向右，+Y 轴向上，如图所示。裁剪体积的顶点数据需要映射到图像位置。这是通过两个简单的转换完成的：
1. 将 (-1,-1) 到 (+1,+1) 的查看窗口缩放到图像的宽度和高度。
2. 将 (-width/2,-height/2) 处的左下角偏移到图像的原点。

<center>
  <img src="/8/image_coordinate_system.png" />
</center>

在矩阵格式中，这种变换是:

```html
┌                 ┐   ┌                       ┐   ┌   ┐  ┌        ┐ Eq2
│ 1 0 0  width/2  │   │ width/2 0        0  0 │   | x |  | xImage |
| 0 1 0  height/2 | * | 0       height/2 0  0 | * | y |= | xImage |
| 0 0 1  0        |   | 0       0        1  0 |   | z |  | xImage |
| 0 0 0  1        |   | 0       0        0  1 |   | 1 |  | 1      |
└                 ┘   └                       ┘   └   ┘  └        ┘
```

请注意，我们只是在转换每个顶点的 x 和 y 坐标，因为我们正在创建 2D 图像。 z 分量与顶点一起携带，但其值保持不变。

你没有实现视口转换。它是由图形管道内部完成的。但是你可以指定你只想让你的渲染填充画布的一部分。默认情况下，画布的宽度和高度是视口的宽度和高度。如果你想渲染一个较小的图像，你可以使用gl.viewport(x_offset,y_offset,width,height)函数为较小的图像指定一个偏移量和一个尺寸。x_offset和y_offset参数指定了从左下角开始的偏移量，宽度和高度指定了渲染图像的大小。这个较小图像的变换是。

```html
┌                 ┐   ┌                 ┐   ┌                       ┐   ┌   ┐  ┌        ┐ Eq3
│ 1 0 0  x_offset │   │ 1 0 0  width/2  │   │ width/2 0        0  0 │   | x |  | xImage |
| 0 1 0  y_offset | * | 0 1 0  height/2 | * | 0       height/2 0  0 | * | y |= | xImage |
| 0 0 1  0        |   | 0 0 1  0        |   | 0       0        1  0 |   | z |  | xImage |
| 0 0 0  1        |   | 0 0 0  1        |   | 0       0        0  1 |   | 1 |  | 1      |
└                 ┘   └                 ┘   └                       ┘   └   ┘  └        ┘
```

下面的演示程序将两个单独的图像渲染到一个画布中。第一个图像显示在整个画布中，而第二个图像显示在右下角。

点击查看[交互式例子](http://learnwebgl.brown37.net/08_projections/projections_viewport.html#the-viewport-transformation)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/08_projections/viewport_example/viewport_example.html)

为了在一个画布中完成两个渲染，你还必须使用gl.SCISSOR_TEST。所有WebGL命令的默认行为是对它所创建的整个图像进行操作。如果你想只改变图像的一部分，你可以启用gl.SCISSOR_TEST，并设置可以改变的图像的限制。如果你研究上述例子中的代码，程序的初始化代码在第266行启用了剪刀测试。

```js
gl.enable(gl.SCISSOR_TEST);
```

渲染整个画布时，在第 131-132 行将视口和剪刀限制设置为整个画布：
```js
gl.viewport(0, 0, canvas_width, canvas_height);
gl.scissor(0, 0, canvas_width, canvas_height);
```

当渲染较小的图像时，视口和剪刀限制设置为画布的右下角，第 195-196 行：
```js
gl.viewport(x_offset, y_offset, width, height);
gl.scissor(x_offset, y_offset, width, height);
```

### 鼠标事件进入世界位置

你有时需要将鼠标光标的位置转换为你的三维虚拟场景中的一个位置。由于你正在观看一个三维世界，一个鼠标的位置实际上确定了无数的点，这些点位于从摄像机通过鼠标的位置进入三维世界的射线上。你可以用简单的比例将鼠标位置转换成观察窗口的位置。研究一下下面的两张图。

<center>
  <img src="/8/mouse_to_world.png" />
</center>

鼠标使用的屏幕坐标的+Y轴是顺着屏幕走的，但如果你使用相同的距离来做比例，这并不重要。在这两张图中，我们测量的是左边和上面的距离。我们使用用于定义投影矩阵的左、右、底和顶的变量来描述世界观察窗口。让我们用canvas_width和canvas_height来描述画布窗口的大小。两个窗口中的相对距离必须是相同的。因此:
```js
x_mouse / canvas_width  === (x_world - left) / (right - left)
y_mouse / canvas_height === (top - y_world)  / (top - bottom)
```

如果你知道一个鼠标的位置，(x_mouse, y_mouse)，你可以解出上述方程，计算出虚拟世界中观察窗上的等效位置。就是说:
```js
x_world = [(x_mouse / canvas_width) * (right - left)] + left;
y_world = top - [(y_mouse / canvas_height) * (top - bottom)];
```

如果你想把观察窗口中的一个位置转换为鼠标的位置，你可以通过求解得到这些方程式:
```js
x_mouse = [(x_world - left) / (right - left)] * canvas_width;
y_mouse = [(top - y_world)  / (top - bottom)] * canvas_height;
```