## 高级渲染简介

本节讨论以下更高级的渲染主题：

- 隐藏表面去除
    - 给定一个场景和一个相机位置，如何只渲染相机可见的图形基元？
- 对象选择
    - 给定包含多个对象的场景的渲染，用户如何选择单个对象？
- 透明度/阿尔法混合
    - 鉴于透明表面允许光线通过，您如何在渲染它们的同时仍然部分看到后面的对象？
- 阴影
    - 当光线被另一个物体阻挡时，缺少的反射称为“阴影”。如何在场景中渲染阴影？
- 粒子系统
    - 许多现象，如云、烟、火、水、尘埃和星星，都是由许多小粒子组成的，将这些物理事物建模为一组三角形是有问题的，原因有很多。我们如何才能渲染这些东西并获得可信的结果？

在讨论这些高级渲染主题之前，让我们讨论一下缓冲区的一般概念以及在渲染过程中如何使用缓冲区。

### 缓冲器

缓冲区是用于存储一组相关值的连续内存块。在之前的课程中，我们提到了三种类型的缓冲区：

- 缓冲区对象：一组与图元相关的属性。最常见的属性是使用 (x,y,z) 值的几何位置。其他属性包括颜色、法线向量和纹理坐标。基于“每个顶点”存储的任何数据都存储在缓冲区对象中。 （正式名称是顶点对象缓冲区，或 VOB。）
- 纹理对象：一组值，用于存储纹理贴图及其 2D 图像的渲染参数。
- 帧缓冲区：包含场景渲染输出的 2D 图像。

对于本节中的课程，我们需要更准确地使用术语。从技术上讲，帧缓冲区是用于渲染的缓冲区的集合。在 WebGL 程序中，帧缓冲区由以下三个二维数组组成：

- 颜色缓冲区：颜色值的二维数组。颜色缓冲区的每个元素使用三个值 RGB 或四个值 RGBA 定义像素颜色。每个颜色分量值的最小内存为 8 位。
- 深度缓冲区：表示“与相机的距离”的二维值数组。深度缓冲区用于去除隐藏表面。每个元素的最小内存为 16 位。
- 模板缓冲区：表示颜色缓冲区中可以更改的位置的二维值数组。每个元素的最小内存为 8 位。这个缓冲区定义了一个“模板掩码”，它决定了颜色缓冲区和深度缓冲区中的哪些元素可以被修改。

同样，这三个缓冲区组成一个帧缓冲区。 WebGL 帧缓冲区必须具有颜色缓冲区和深度缓冲区。模板缓冲区是可选的。像“这会更新帧缓冲区”这样的语句实际上意味着正在更新多个缓冲区。 WebGL 允许您创建多个帧缓冲区并以多种方式操作它们。当我们在接下来的课程中遇到对帧缓冲区对象的需求时，我们将解释它们的细节。

### 双缓冲和画布更新

双缓冲意味着您有两个用于渲染的缓冲区。一个缓冲区，即屏幕外帧缓冲区，用于创建新的渲染。当您发出 gl.clear() 和 gl.drawArrays() 命令时，此缓冲区会被修改。渲染不是即时创建的，而是随着各种像素设置为适当的颜色而逐步创建的。我们通常不希望用户看到这个过程，所以它是在“屏幕外”完成的。另一个屏幕缓冲区用于保存用户当前可见的图像。当图像的所有渲染在离屏帧缓冲区中完成时，它的颜色缓冲区会自动复制到屏幕缓冲区，以便用户可以看到它。

WebGL 将屏幕外帧缓冲区称为“绘图缓冲区”。

浏览器如何知道渲染何时完成？网页上的所有处理都是事件驱动的。当事件发生时，会调用 JavaScript“事件处理程序”来执行某些操作。当“事件处理程序”完成时，浏览器可以检测新的渲染是否在“屏幕外缓冲区*”中。如果存在新的渲染，它会在下一次刷新屏幕之前更新屏幕缓冲区。这意味着必须在事件的单次执行中执行渲染。有多种方法可以通过处理多个事件来创建渲染，但这不是设计意图。我们将假设在处理单个事件期间发生了一次画布渲染。