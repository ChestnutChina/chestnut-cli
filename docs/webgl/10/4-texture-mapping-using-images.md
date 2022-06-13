## 图片纹理映射

纹理映射是一种为组成三角形的每个片段指定唯一颜色的技术。颜色来自映射。让我们回顾一下第 3.7 课的讨论。在数学中，映射是将一组输入转换为输出值的函数。有两种基本方法可以做到这一点：

- 从一个可能的值的列表中查找输出值。这被称为 "表格查找"。
- 对输入进行计算以产生输出值。

本课介绍第一种映射技术：如何将三角形位置映射到 2D 图像中的颜色值。

### 硬件概述

纹理映射是创建逼真渲染的基础，GPU 的硬件包含支持纹理映射的纹理单元。当您在计算上下文中听到单元一词时，您应该想到处理单元。例如，CPU（中央处理单元）是为通用计算而设计的；一个GPU（Graphics Processing Unit）是为图形计算而设计的，一个纹理单元（强调单元）是为纹理贴图处理而设计的。符合 WebGL 的硬件必须至少有 8 个纹理单元；许多 GPU 的数量超过 8 个。您可以通过调用 gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) 查询 GPU 硬件以确定它有多少纹理单元。

纹理单元执行纹理映射处理。纹理对象存储纹理映射所需的数据。纹理单元和纹理对象一起可以在着色器程序中执行纹理映射。您可以根据需要创建任意数量的纹理对象，但 GPU 中纹理单元的数量决定了您可以在着色器程序中同时使用多少纹理贴图。这可能会令人困惑，所以让我们再次总结这些要点。

- 纹理单元
    - 执行纹理映射所需的处理。
    - 符合 WebGL 的硬件总是至少有 8 个纹理单元。
    - 纹理单元的数量决定了您可以在着色器程序中同时使用多少个纹理贴图。
    - 请记住，WebGL 程序在客户端的硬件上执行，而不是在服务器的硬件上。 JavaScript 程序可以使用 gl.getParameter() 查询客户端的硬件以确定有多少纹理单元可用，然后为硬件使用适当的着色器程序。

- 纹理对象
    - 存储纹理映射所需的数据。
    - 纹理对象存储在 GPU 的内存中。
    - 纹理对象不同于缓冲区对象。缓冲区对象存储模型的属性，并且始终是 FLOATS 的一维数组。纹理对象也是数据的缓冲区，但其结构更复杂，因为它存储了控制纹理映射执行方式的参数和纹理映射图像。
    - 纹理对象的大小与纹理映射图像的大小有关。您应该使纹理映射图像尽可能小以节省 GPU 内存。
    - 您可以创建的纹理对象数量的唯一限制是 GPU 内存的大小。

### 软件概述

纹理映射将 2D 图像中的位置映射到 3D 三角形上的位置。 WebGL 使用纹理坐标来执行此映射。与图形的许多其他方面一样，纹理坐标是百分比。纹理坐标的符号使用 (s,t) 来表示图像位置。 s 分量是图像宽度的百分比，而 t 分量是图像高度的百分比。每个模型顶点都分配有一个纹理坐标，这些坐标在三角形的表面上进行插值，以指定每个三角形片段在图像中的唯一位置。

创建纹理映射的基本步骤如下：
1. 构建模型时
    1. 为纹理映射选择合适的图像。
    2. 为三角形的每个顶点分配一个适当的纹理坐标 (s,t)。
2. 画布渲染的 JavaScript 预处理：
    1. 从服务器下载纹理贴图图像。
    2. 创建并使用图像填充 GPU 纹理对象。
    3. 设置控制纹理贴图图像使用方式的参数。
    4. 从着色器程序中获取统一 Sample2D 变量的位置。
3. 每次使用纹理贴图对模型进行渲染时的JavaScript设置
    1. 将纹理对象绑定到纹理单元
    2. 将纹理单元绑定到统一着色器变量
4. 着色器程序
    1. 在顶点着色器中，创建一个可变变量，该变量将在三角形表面上插入纹理坐标。
    2. 在片段着色器中，使用纹理坐标从纹理图像中查找颜色。

正如你所看到的，有许多与纹理贴图有关的问题，所以我们将按照上面列出的顺序一个一个地讨论。

#### 重要的

用于纹理映射的图像必须从服务器下载。 learn_webgl_02.js 代码已更新以下载纹理贴图图像。请确保将此 JavaScript 代码的更新版本保存到您的俄罗斯方块项目中。

#### 1.1 选择合适的图像

任何数字图像都可以用作纹理贴图，但如果图像的宽度和高度不是 2 的幂，则图像的使用方式会受到限制。最好使图像具有 2 的幂次方的尺寸，这样可以提高纹理映射的效率并消除对其使用的任何限制。因此，图像的每个维度应为 1、2、4、8、16、32、64、128、256、512、1024 或 2048 像素。有些设备支持更高的分辨率，但您应该使图像尽可能小，以节省下载时间并节省 CPU 和 GPU 内存。就将在画布上绘制的像素数而言，您应该尝试使图像分辨率与要渲染的对象的大小大致相同。


大多数图像编辑器都允许您更改图像的分辨率，但如果您不希望图像失真，则必须考虑图像的纵横比——即其宽度与高度的关系。通常，您应该裁剪图像以获得所需的内容，并使纵横比为 1/1、1/2、1/4、1/8 等。在图像的内容和纵横比正确后，然后将图像的分辨率（以像素为单位）更改为 2 的幂。

一些纹理贴图图像设计为平铺，这意味着可以将单个图像放置在其自身旁边，而您看不到它们连接的位置。右边缘与左边缘（以及上边缘到下边缘）匹配的图像对于设计和创建而言并非易事。值得庆幸的是，互联网上有许多网站提供可以平铺的免费图像。只需搜索“可以平铺的免费纹理贴图图像”。以下是一些为纹理映射提供免版税图像的网站：

- http://www.textures.com/
- http://www.mayang.com/textures/
- http://www.rendertextures.com/

纹理映射图像中的颜色可以使用 RGB 或 RGBA 颜色表示。如果您不关心透明度，则应使用 RGB 值，因为它可以节省内存。如果要使图像的某些部分透明（因为要使用图像来表示非矩形区域，则必须使用 RGBA 颜色并将每个要不可见的像素的 alpha 分量设置为零。这需要更复杂的图像编辑器，例如 Adob​​e Photoshop 或其开源等效产品 GIMP。

<center>
  <img src="/10/titled_example.png" />
</center>

#### 1.2 纹理坐标

分配给模型每个顶点的纹理坐标控制图像颜色到三角形面的映射。纹理坐标的概念很容易理解，但是将纹理坐标分配给各个顶点的任务可能很复杂。我们将在这里介绍这个大概念，下一课将简要讨论如何使用 Blender 分配纹理坐标。

纹理坐标是表示图像中位置的两个分数。第一个分数，称为 s，是图像左侧的百分比。第二个分数，称为 t，是距图像底部的百分比。 （WebGL 中图像的坐标系原点在左下角，+S 轴向右，+T 轴向上。） 右图中有几个纹理坐标示例.

<center>
  <img src="/10/example_texture_coordinates.png" />
</center>

#### 2.1 从服务器下载纹理图像

对于 OBJ 模型描述，纹理贴图图像的文件名存储在分配给模型的材料属性中。当您从 Blender 导出包含纹理贴图的模型时，纹理贴图图像的文件名存储为与 OBJ 文件关联的 MTL 文件中定义的材质的 map_Kd 属性。 （注意，Kd 是材质的漫反射属性。因此，纹理贴图图像有望用于三角形表面上位置的漫反射颜色。）必须下载纹理贴图图像文件，并将其存储在 GPU 纹理对象中，然后在渲染模型时由着色器程序使用。

文件 Learn_webgl_02.js 中的 JavaScript 对象 Learn_webgl 旨在下载 WebGL 程序所需的所有文件。该函数的第三个参数是场景的 OBJ 模型列表。从服务器检索 OBJ 文件时，还会检索任何关联的 MTL 文件。检索 MTL 文件后，检索任何关联的纹理图像文件。只有在从服务器检索到所有文件后，才会启动 WebGL 程序。如果您对详细信息感兴趣，请参阅 Learn_webgl 类中的 _downloadTextureMapImage 函数。

应该注意的是，图像有多种数据格式，例如 gif、png 和 jpeg。 Web 浏览器了解如何读取和解释所有标准图像编码。当您创建 JavaScript Image 对象并指定图像的 src（源）时，浏览器不仅会下载图像，还会对其进行正确解码。这是巨大的！您不必担心任何图像解码问题！

#### 纹理映射文件名：

在 Blender 中将纹理贴图应用于模型时，如果图像文件与 .obj 文件位于同一文件夹中，则纹理文件名将不包含文件路径。但是，如果您从硬盘驱动器上的某个任意文件夹位置获取图像，则当需要由 Web 服务器检索文件时，该文件的路径将无效。始终将纹理贴图图像存储在与模型相同的文件夹中。

#### 2.2 在 GPU 中创建纹理对象

当我们渲染模型时，我们希望模型数据存储在 GPU 的内存中，以便着色器程序可以直接访问它。要将图像用作颜色值的表查找，我们还需要从 GPU 的内存中访问图像。由于纹理映射与 gl.drawArrays() 相比是一种根本不同的操作，因此存储纹理映射图像的内存称为纹理对象而不是缓冲区对象。纹理对象存储图像和生成纹理映射所需的所有相关状态变量。您可以创建与 GPU 有内存要存储的纹理对象一样多的纹理对象。

创建纹理对象有三个基本步骤：

- 创建一个新的纹理对象
- 设置控制纹理对象使用方式的参数。
- 将图像复制到纹理对象中

以下函数创建一个纹理对象。请阅读并研究每个命令之前的注释:

```js
/**
 * Create and initialize a texture object
 * @param my_image Image A JavaScript Image object that contains the
 *                       texture map image.
 * @returns {WebGLTexture} A "texture object"
 * @private
 */
function _createTexture(my_image) {

  // Create a new "texture object"
  var texture_object = gl.createTexture();

  // Make the "texture object" be the active texture object. Only the
  // active object can be modified or used. This also declares that the
  // texture object will hold a texture of type gl.TEXTURE_2D. The type
  // of the texture, gl.TEXTURE_2D, can't be changed after this initialization.
  gl.bindTexture(gl.TEXTURE_2D, texture_object);

  // Set parameters of the texture object. We will set other properties
  // of the texture map as we develop more sophisticated texture maps.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // Tell gl to flip the orientation of the image on the Y axis. Most
  // images have their origin in the upper-left corner. WebGL expects
  // the origin of an image to be in the lower-left corner.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  // Store in the image in the GPU's texture object
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, my_image);

  return texture_object;
}
```

“绑定到对象”的概念不是现代编程语言的一部分，它值得一些详细的解释。请记住，WebGL 是硬件图形引擎的 API（应用程序接口）。如果您考虑硬件，则编程更有意义。想象一下，GPU 有许多纹理对象，并且您希望硬件将其中一个作为其“活动”纹理对象。然后，从概念上讲，GPU 必须连接到纹理对象。在硬件中，连接事物的方式是拨动开关。因此，当您“绑定对象”时，您在概念上是在“拨动开关”以连接硬件中的组件。

与上述每个 gl 命令相关的细节很多——太多细节无法在本概述中涵盖。我们将在后面的课程中回到这些命令来讨论一些细节。

<center>
  <img src="/10/binding_to_objects.png" />
</center>

#### 2.3 纹理参数

纹理贴图图像的分辨率很少与渲染的 3D 三角形的分辨率相同。例如，纹理贴图图像可能是 128 x 128 像素，使用此纹理贴图的三角形可能会覆盖渲染画布中的 20 像素。这是一个很大的区别。反之亦然。要渲染的三角形可能会覆盖渲染图像中的 100,000 个像素。这意味着必须放大或缩小纹理图图像以匹配 3D 三角形的大小。 WebGL 使用术语“放大”和“缩小”来表示这些想法，您可以控制“放大”和“缩小”的执行方式。你的选择是在速度或质量之间，但你不能两者兼得。选项名称基于相关算法的工作方式而不是结果：gl.NEAREST 选择离某个位置最近的像素并为您提供速度，而 gl.LINEAR 计算一个位置周围四个像素的加权平均值，从而产生更好的颜色，但会减慢渲染速度。以下示例代码将生成质量最好的图形，但渲染速度较慢。

```js
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
```

纹理坐标是介于 0.0 和 1.0 之间的百分比值。如果纹理坐标超出此范围，WebGL 应该怎么做？你有三个选择：

- `gl.REPEAT`：这将百分比的小数部分作为纹理坐标。例如，值 2.75 将变为 0.75。这具有在大面积上重复纹理贴图的效果。这就是“平铺”的方式。一个相同的纹理贴图图像在更大的区域上重复使用。
- `gl.CLAMP_TO_EDGE`：这会将所有大于 1.0 的值限制为 1.0，并将所有小于 0.0 的值限制为 0.0。因此，如果纹理坐标超出 0.0 到 1.0 的范围，则重复使用图像边界处的颜色。这是目视检查无效纹理坐标的好方法，但它的视觉用途非常有限。
- `gl.MIRRORED_REPEAT`：这会反转坐标的小数部分。例如，1.25 将映射到 0.75，因为 1.0 - 0.25 = 0.75。效果是围绕其边缘镜像图像。这使得原始图像和镜像图像的接缝“消失”。

这些参数可以针对纹理贴图的 s 轴和 t 轴进行不同的设置，例如：

```js
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
```

最后的预处理步骤是在将访问纹理贴图的着色器程序中获取变量的位置。这将是一个uniform Sampler2D 类型的变量。我们通常将此位置添加到着色器程序对象中，如下所示：
```js
program.u_Sampler = gl.getUniformLocation(program, "u_Sampler");
```

#### 3 纹理映射的 JavaScript 设置

您的着色器程序将在其片段着色器中有一个统一的 Sampler2D 变量。此变量必须指示用于纹理映射的纹理单元。但是纹理单元需要来自纹理对象的数据。所以我们将一个纹理对象绑定到一个纹理单元，然后我们将统一的 Sampler2D 变量设置为纹理单元。一个例子如下所示。
```js
// Make the "texture unit" 0 be the active texture unit.
gl.activeTexture(gl.TEXTURE0);

// Make the texture_object be the active texture. This binds the
// texture_object to "texture unit" 0.
gl.bindTexture(gl.TEXTURE_2D, texture_object);

// Tell the shader program to use "texture unit" 0
gl.uniform1i(program.u_Sampler, 0);
```

这三个命令可能非常令人困惑，因为它们使用不同的方式来指定纹理单元。当您激活纹理​​单元时，您必须使用枚举类型 (ENUM) 值：gl.TEXTURE0、gl.TEXTURE1、gl.TEXTURE2 等之一。但是，“指向”纹理单元的着色器变量只是一个整数、0、1、2 等。我不确定他们为什么会出现这种不一致，但这就是它的工作原理。枚举值 gl.TEXTURE0、gl.TEXTURE1、gl.TEXTURE2 等保证是连续的，因此您可以使用代码 gl.TEXTURE0 + j 指定第 j 个纹理单元。

#### 4 使用纹理映射的着色器程序

执行纹理映射的着色器程序是整个过程中最简单的部分。顶点着色器只是将顶点的纹理坐标复制到一个可变变量中，这样它们就可以在三角形的表面上进行插值。这是一个示例顶点着色器。

```js
// Vertex Shader
precision mediump int;
precision mediump float;

// Scene transformation
uniform mat4 u_PVM_transform; // Projection, view, model transform

// Original model data
attribute vec3 a_Vertex;
attribute vec2 a_Texture_coordinate;

// Data (to be interpolated) that is passed on to the fragment shader
varying vec2 v_Texture_coordinate;

void main() {

  // Pass the vertex's texture coordinate to the fragment shader.
  v_Texture_coordinate = a_Texture_coordinate;

  // Transform the location of the vertex for the rest of the graphics pipeline
  gl_Position = u_PVM_transform * vec4(a_Vertex, 1.0);
}
```

片段着色器使用片段的纹理坐标在纹理映射图像中查找颜色。这是 GLSL 功能中内置的常见操作。您只需调用 texture2D 函数并指定要使用的纹理单元和纹理坐标（这是一个 vec2，两个浮点值）。

```js
// Fragment shader program
precision mediump int;
precision mediump float;

// The texture unit to use for the color lookup
uniform sampler2D u_Sampler;

// Data coming from the vertex shader
varying vec2 v_Texture_coordinate;

void main() {

  gl_FragColor = texture2D(u_Sampler, v_Texture_coordinate);
}
```

### 一个例子

点击查看[交互式例子](http://learnwebgl.brown37.net/10_surface_properties/texture_mapping_images.html#an-example)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/10_surface_properties/simple_texture_image/simple_texture_image.html)