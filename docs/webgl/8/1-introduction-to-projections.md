## 投影简介

渲染 3 维计算机图形场景时，您会创建 3D 场景的 2 维图片。图片是场景中模型在二维“屏幕”上的投影。因此，将图形管线中的此操作称为投影是合乎逻辑的。

在计算机图形中，有两种标准投影。正射投影保持平行线，但不提供深度感。透视投影提供了一种深度感，但平行线会向消失点倾斜。正射投影用于工程领域，当需要准确表达一个模型的时候。当需要一个场景的 "现实生活 "视图时，则使用透视投影。透视投影模拟了人眼看到的真实世界。请研究以下两个例子并比较它们的输出。你可以用鼠标点击和拖动来旋转两个窗口中的视图。

点击查看[交互式例子](http://learnwebgl.brown37.net/08_projections/projections_introduction.html#introduction-to-projections)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/08_projections/ortho_example/ortho_example.html)

点击查看[交互式例子](http://learnwebgl.brown37.net/08_projections/projections_introduction.html#introduction-to-projections)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/08_projections/perspective_example/perspective_example.html)

图形管道中的每一步都在执行特定的任务，但也为后续步骤准备数据。这对于投影变换来说尤其如此。

- 投影变换的主要任务是将3D场景投影到2D屏幕上。
- 投影变换还为这些后续任务做准备：
    - 剪切 - 移除不在摄像机视线范围内的元素。
    - 视口映射 - 将摄像机的视窗转换成图像的像素。
    - 隐蔽面移除 - 确定哪些物体在其他物体的前面。

在投影操作之前，(x,y,z) 顶点表示 3 维空间中的位置。投影后，值的含义发生了变化：

- 顶点的（x,y）值代表它在二维屏幕上的位置。
- z值代表顶点与虚拟摄像机的距离，用于去除隐藏的表面。
- 所有这三个值，x、y和z，都用于剪裁，剪裁可以去除场景的虚拟摄像机看不到的点、线或三角形。

在我们进入投影的细节之前，我们需要讨论所有场景在渲染之前被映射到的标准剪贴卷。

### 裁剪量

当你把一个真实的相机对准某样东西拍照时，在相机的视野中只能看到真实世界的一部分。人的眼睛也是如此；你只看到你面前的东西。我们希望我们的虚拟场景也有同样的行为。确定哪些是可见的，哪些是不可见的，这个过程叫做剪裁。剪切是由WegGL自动完成的。为了使剪裁尽可能有效，剪裁是用一个以原点为中心的立方体完成的。

剪切体积是以归一化设备坐标（NDC）定义的，它是一个2单位宽的立方体，X轴从-1到+1，Y轴从-1到+1，Z轴从-1到+1，如图所示。
<center>
  <img src="/8/clipping_volume.png" />
</center>

你是否注意到，剪裁体积是在一个左手的坐标系中定义的？Z轴是指向页面的。哇！这下好了。以前的课程说过，WebGL总是使用右手坐标系，而现在却没有。这到底是怎么回事？

简而言之，产生图形的硬件GPU是为速度和效率设计的，而WebGL API是为程序员设计的。大多数人都是右手，所以对大多数人来说，右手的规则感觉很自然、很舒服，而图形硬件的内部工作原理通常可以忽略不计。投影矩阵是程序员控制下的最后一个操作，它操纵着场景的几何数据。因此，投影变换可以转换为左手坐标系，而不影响程序员对右手坐标系中的几何数据所做的任何操作。

你可以在下面的演示程序中直观地看到GPU的左手坐标系。观察一下当你包含一个投影矩阵和不包含投影矩阵时会发生什么。

点击查看[交互式例子](http://learnwebgl.brown37.net/08_projections/projections_introduction.html#the-clipping-volume)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/08_projections/viewing_volume/viewing_volume.html)

鉴于剪裁体积使用的是左手坐标系统，对图形程序员来说有两个非常重要的影响:

- `你必须始终在你的顶点变换中包括一个投影矩阵`，即使你认为你不需要一个。我们之前定义的所有变换都假定了一个右手坐标系。如果你不包含一个投影矩阵，所有其他的变换矩阵将不能正确工作。
- 如果你创建自己的投影矩阵，它应该否定所有顶点的Z值。

### 裁剪

考虑一下如何使用编程逻辑来完成剪裁点。为了确定一个定义为(x,y,z)的点是否在剪裁体积内，你可以写这样的代码:

```JavaScript
if (x >= -1 and x <= 1 and
    y >= -1 and y <= 1 and
    z >= -1 and z <= 1)
  point_is_visible = true;
else
  point_is_visible = false;
```

然而，由于剪裁体积是均匀的并且围绕原点对称的，我们可以用绝对值函数来简化这个代码:

```JavaScript
if (abs(x) <= 1 and abs(y) <= 1 and abs(z) <= 1)
     point_is_visible = true;
else
     point_is_visible = false;
```

此外，你可以只用一个简单的赋值来设置布尔值，比如这样:
```JavaScript
point_is_visible = (abs(x) <= 1 and abs(y) <= 1 and abs(z) <= 1)
```

实际上，剪裁是在同质坐标中进行的（你将在几节课中了解更多）。对于一个(x,y,z,w)顶点，剪裁测试将是
```JavaScript
point_is_visible = (abs(x) <= w and abs(y) <= w and abs(z) <= w)
```

但这些细节对大多数程序员来说并不重要。重要的是，剪裁体积的对称性设计有利于快速剪裁。请记住，WebGL实际上是一个带有软件API（应用程序员接口）的硬件规范。WebGL的设计是为硬件实现而优化的。

剪切算法
如果你真的想了解为什么WebGL只渲染点、线和三角形，那就研究一下[剪裁](https://gamedev.stackexchange.com/questions/8326/triangle-rectangle-intersection-in-2d)吧 即使对于简单的三角形来说，剪裁也是一个复杂的问题。

### 什么时候需要进行投影？

投影变换必须发生在场景被移动到虚拟摄像机前面之后，但在剪接发生之前。投影操作可以使用4乘4的矩阵乘法来执行，所以它通常与模型变换和摄像机（或视图）变换相结合，这些变换在管道的前几个阶段已经被概念化地执行了。在现实中，模型、视图和投影变换通常是用一个单一的矩阵乘法来执行。在你的JavaScript代码中，你通常会创建一个单一的变换矩阵并将其传递给你的顶点着色器。

```html
                   ┌                  ┐   ┌            ┐   ┌             ┐ Eq1
VertexTransform  = │ ProjectionMatrix │ * │ ViewMatrix │ * │ ModelMatrix │
                   └                  ┘   └            ┘   └             ┘
```

下面的课程描述了如何建立一个4乘4的投影矩阵。