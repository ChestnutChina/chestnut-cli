## 透明度（和 Alpha 混合）

用于执行隐藏表面去除的 z-buffer 算法将距离相机最近的对象的颜色存储在帧缓冲区的颜色缓冲区中。当实体对象阻挡其他实体对象的视图时，这是所需的行为。但是那些部分透明的物体又可以让它们后面的物体部分可见呢？本课解释了渲染包含透明表面的对象的标准技术。

### 透明度

如果一个物体允许光穿过它，观察者会看到一些从物体反射的光和一些从表面后面的物体反射的光。因此，透明度需要结合来自两个光源的光。让我们回顾一下 z-buffer 算法——它看起来像这样：
```js
void renderPixel(x, y, z, color) {
  if (z < zbuffer[x][y]) {
    zbuffer[x][y] = z;
    colorbuffer[x][y] = color;
  }
}
```

请注意，我们在此算法中表示了两种颜色：1）颜色缓冲区中已经存在的颜色，colorbuffer[x​​][y]，以及 2）正在渲染的对象的颜色，color。如果我们仔细设置渲染上下文，图形管道可以使用对象的透明度来组合颜色。渲染算法更改为：
```js
void renderPixel(x, y, z, color) {
  if (z < zbuffer[x][y]) {
    zbuffer[x][y] = z;
    colorbuffer[x][y] = (colorbuffer[x][y] * percent_left_over) + (color * percent_of_reflection);
  }
}
```

“百分比”从何而来？给定一个 RGBA（红、绿、蓝、alpha）颜色值，“alpha”值表示反射的光量。如果 alpha 为 1.0，则所有光都会被反射，并且对象是“不透明的”。如果 alpha 值为 0.75，则对象反射 75% 的照射到它的光，这意味着 25% 的光通过。所以百分比值来自颜色值，如下所示：

```js
percent_of_reflection = color.alpha; // or color[3]
percent_left_over     = 1.0 - percent_of_reflection;
```

要设置图形管道来执行这种“颜色混合”，您需要调用两个 JavaScript 函数：第一个启用颜色混合，第二个使用预定义的枚举常量指定混合百分比。希望常量的名称是不言自明的。

```js
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
```

请注意，如果透明对象位于其他对象后面，则它们是不可见的。因此，我们不想关闭隐藏表面移除。但是，如果一个场景中有多个透明对象并且光线穿过其中一个以上怎么办？在这种情况下，我们需要为光通过的每个对象执行颜色组合。为了计算正确的最终颜色，我们需要首先处理离相机最远的对象，最后处理离相机最近的对象！这意味着我们需要对透明对象进行排序！我们将在几分钟内详细讨论排序。考虑到所有这些问题，以下是处理透明表面的渲染算法的主要步骤：

1. 清除颜色缓冲区和 z 缓冲区 - gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
2. 渲染场景中不透明的所有对象。 （顺序无关紧要。）
3. 根据与相机的距离对场景中的透明对象进行排序。 （从最大到最小距离。）
4. 根据与相机的距离对模型中的图形基元进行排序。 （从最大到最小距离。）
5. 启用混合并设置混合百分比
    ```js
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    ```
6. 保持 z-buffer 算法处于活动状态，但禁用对 zbuffer 数组的更改。 (gl.depthMask(false)) （这仅适用于透明模型占据相同 3D 空间的情况。这将在下面更详细地讨论。）
7. 渲染排序后的透明对象和图元，从相机的最大距离到最小距离。

使该算法非常低效的是排序。但在我们讨论排序之前，请认识到有关特定场景的先验知识可能会让您完全忽略排序。以下是一些您可以安全地忽略排序的特定场景：

- 一个场景中只有一个透明模型。模型中的图元必须排序，但您可以简单地在场景中最后渲染透明模型。
- 一个场景中有多个透明对象，但您知道它们都不会从特定的摄像机角度相互重叠。因此，您可以简单地最后渲染这些模型（但以任何顺序）。
- 如果您的模型包含一些不透明表面和一些透明表面，则可能适用以下情况：
  - 你知道透明表面永远不会面对相机。因此，您不必担心透明表面。
  - 该模型定义了一个完全封闭的 3D 区域，任何透明表面后面的表面都是同一模型的面。因此，假设其他模型在 3D 空间中不相交，您只需关心对特定模型中的面进行排序。

总而言之，如果您可以使用场景知识来避免排序，那是值得的。这是所有计算机图形的一般原则——如果某些东西不可见，不要担心正确渲染它。

### 透明度排序

为了渲染场景，我们渲染了一组模型，其中每个模型都由三角形组成。当我们讨论排序时，我们有两个问题：

- 相对于彼此对模型进行排序，以及
- 对模型中的图元（点、线和三角形）进行排序。

#### 对模型的基元进行排序

给定模型的图元，我们需要根据它们与相机的距离对它们进行排序。这是有问题的，因为快速渲染背后的重要思想是将原始数据放入永远不会改变的 GPU 对象缓冲区中。通常，模型使用变换矩阵以不同的大小、位置和方向在场景中渲染，而模型数据保持静态。但是现在必须重新排序数据。我们有两个基本选择：

- 保持 GPU 对象缓冲区中的模型数据不变，并使用对 gl.drawArrays() 的单独调用来渲染每个图元（三角形），或者
- 重新排序 GPU 对象缓冲区中的三角形数据。

第一种方法产生较慢的渲染速度，但更易于实现。第二种方法渲染速度更快，但需要更多的 JavaScript 代码来实现。本课中的演示程序使用第一种方法。

对于实际排序，您应该使用插入排序。为什么？请注意，您必须对每个渲染操作进行排序；你不是只排序一次。如果场景从一次渲染到下一次渲染变化很小，那么场景中模型的相对顺序不会发生太大变化。因此，假设您重新使用之前的排序结果，您需要对几乎已排序的基元列表进行排序。插入排序是对几乎已排序的列表进行排序的最快方法。 （永远不要对像这样的排序任务使用快速排序或归并排序。这些排序算法是常用的最快的通用排序方法，但它们不能“提前退出”，而且运行不佳-排序数据的时间行为。）

为了对构成模型的三角形进行排序，我们需要在模型和视图变换应用到它之后三角形的顶点。另外，我们不想移动内存中的数据，我们只想找到它们的排序顺序。因此，我们可以执行“索引排序”，我们使用值数组中的索引来跟踪排序顺序，但实际上从不重新排列数据值。这是对构成模型的三角形进行排序的通用算法：

1. 对于模型的每个三角形
    - 通过当前的 ModelView 变换来变换三角形的每个顶点。
    - 确定离相机最远的顶点。 （由于相机向下看 -Z 轴，这是 z 的最小值。）
    - 将此顶点的 z 分量存储为三角形到相机的距离。
2. 使用距离相机最远的顶点的 z 分量作为排序键，对三角形执行插入排序。
3. 渲染模型
    - 如果您保持 GPU 对象缓冲区不变，则循环遍历三角形并为每个三角形调用一次 gl.drawArrays()。
    - 如果您按排序顺序创建一个新的 1D 模型数据数组并将其复制到 GPU 对象缓冲区，则对 gl.drawArrays() 进行一次调用。

以下函数初始化索引值数组以准备排序。
```js
var sort_indexes = null;

//-----------------------------------------------------------------------
/**
 * Initialize the sort_indexes array for sorting the model's triangles.
 * This array is re-sorted before each render of a transparent model.
 * @private
 */
function _initialize_sorting() {
  var j;

  if (number_triangles  > 0) {
    sort_indexes = new Array(number_triangles);
    for (j = 0; j < number_triangles; j += 1) {
      sort_indexes[j] = [j, 0.0];  // [index to triangle, distance from camera]
    }
  }
}
```

假设一个模型由一组三角形定义，其顶点存储在一个一维浮点数组中——每个三角形 9 个浮点数，每个顶点 3 个浮点数。数组的组织方式如下：
```js
vertices = [v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z, ...]
```

以下函数将索引排序到这个浮点数组中。模型的顶点乘以 ModelView 变换，该变换将相机置于原点并向下看 -Z 轴。对于给定的三角形，z 值最小的顶点距离相机最远。
```js
//-----------------------------------------------------------------------
/**
 * Sort the triangles of a model, back to front, based on their distance
 * from the camera.
 * @param vm_transform Float32Array The transformation to apply to the model vertices.
 */
function _sort_triangles (vm_transform) {
  var j, k, n, which_triangle, vertices, max_z, temp;

  // Step 1: Transform each vertex in a model by the current *ModelView* transformation.
  // Step 2: For each triangle, determine its maximum distance from the camera.
  vertices = model.triangles.vertices;
  for (j = 0; j < number_triangles; j += 1) {

    which_triangle = sort_indexes[j][0];
    k = which_triangle * 3 * 3;
    max_z = 10e10;
    for (n = 0; n < 3; n += 1, k += 3) {
      one_vertex[0] = vertices[k];
      one_vertex[1] = vertices[k + 1];
      one_vertex[2] = vertices[k + 2];
      matrix.multiply(transformed_vertex, vm_transform, one_vertex);

      if (transformed_vertex[2] < max_z) {
        max_z = transformed_vertex[2];
      }
    }

    // Remember this triangle's distance from the camera
    sort_indexes[j][1] = max_z;
  }

  // Step 3: Perform an insertion sort on the triangles, using the vertex
  // that is farthest from the camera as the sorting key.
  for (j = 0; j < number_triangles; j += 1) {
    temp = sort_indexes[j];
    k = j - 1;
    while (k >= 0 && sort_indexes[k][1] > temp[1]) {
      sort_indexes[k + 1] = sort_indexes[k];
      k -= 1;
    }
    sort_indexes[k + 1] = temp;
  }
}
```

#### 排序模型

我们需要从后到前渲染场景中的透明模型。如果模型在 3D 空间中不重叠，则只需根据模型与相机的距离对模型进行排序即可。由于模型不重叠，您可以使用模型上的任何顶点或模型的中心点来计算距离。对于下面显示球体的 WebGL 演示程序，使用每个球体的中心点计算距离。

如果两个或多个透明模型在 3D 空间中重叠，则无法将它们正确渲染为独立模型。要正确渲染它们，您必须组合模型，对它们组合的三角形进行排序，然后从后到前渲染三角形。这是一个难题！我们将模型保留为单独的实体，以便它们可以独立转换。但是对于渲染，我们需要将模型组合成一个基元列表。如果您将模型组合为预处理步骤，则无法独立转换模型。如果在渲染时组合模型，它会大大降低渲染帧速率。

### 实验 1（非重叠模型）

请通过禁用动画和旋转模型以研究透明度来试验以下 WebGL 演示程序。旋转到一个视图，该视图允许您通过多个透明模型查看背景中的不透明模型。渲染是否正确？您是否看到任何渲染不正确的模型？ （如果任何球体重叠，则会出现错误。）

点击查看[交互式例子](http://learnwebgl.brown37.net/11_advanced_rendering/alpha_blending.html#experimentation-1-non-overlapping-models)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/11_advanced_rendering/transparency_example/transparency_example.html)

在 transparent_example_render_js 代码上的实验：

- 如果您重新启动程序，您将获得随机球体的不同组合。
- 在第 49-50 行中，您可以设置要渲染的球体数量和透明球体的数量。尝试不同的模型组合
    - 如果增加数字，您可能会看到重叠的球体，因此渲染不正确。
    - 在继续之前将数字设置回 10 和 5。
- 在第 200 行，注释掉 gl.enable(gl.BLEND);。请注意，所有透明度现在都消失了。没有颜色“混合”，就没有透明度。 （在继续之前启用混合。）
- 不要通过注释掉第 211 行来对模型进行排序。你会得到一些奇怪的视觉效果，因为透明球体的运动与你对它们在 3D 世界中位置的心理理解不匹配。 （在继续之前重新打开排序。）

在 learn_webgl_model_render_41.js 代码上的实验：
- 在第 299 行，注释掉对 _sort_triangles 函数的调用。注意渲染球体上的“斑点”效果。这是因为三角形是按照它们在缓冲区对象中定义的顺序渲染的。这会导致在三角形后面的对象具有正确颜色之前渲染一些最接近相机的三角形。这会导致错误的颜色混合在一起。

### 实验 2（重叠模型）

该演示程序允许您可视化透明模型重叠时会发生什么。禁用动画并手动旋转视图。请注意，当一个球体比其他球体更接近相机时，渲染会发生巨大变化。不可能独立渲染每个球体并以正确的从后到前的顺序渲染所有三角形。

点击查看[交互式例子](http://learnwebgl.brown37.net/11_advanced_rendering/alpha_blending.html#experimentation-2-overlapping-models)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/11_advanced_rendering/transparency_example2/transparency_example2.html)

请通过注释掉第 204 行中的 gl.depthMask(false) 来尝试启用和禁用“写入 zbuffer”。在正常操作中，z-buffer 算法会更新 zbuffer 以保持距离相机最近的物体距离特定像素。因此，启用“写入 zbuffer”gl.depthMask(true) 后，只有在渲染更靠近相机的对象时，颜色缓冲区才会更新为新颜色。如果您已将模型从后到前排序并按此顺序渲染它们，则可以启用“写入 zbuffer”，一切正常，除非两个或多个透明模型在 3D 空间中重叠。

当“写入 zbuffer”被禁用时，gl.depthMask(false)，你会得到一个合理的渲染，但是渲染是错误的，并且随着模型改变它们与相机的相对位置，对象将被渲染不同。

当启用“写入 zbuffer”时，gl.depthMask(true)，您可以更准确地渲染模型的交叉点，但是您会丢失一些内部表面，因为 zbuffer 不允许渲染“后面”表面.

总之，当透明模型重叠时，无论您启用还是禁用“写入 zbuffer”，都会得到错误的结果。对于特定情况，您需要确定哪个结果可以提供“更好”的视觉效果。

### 实验 3（组合模型）

该演示程序显示了三个重叠球体的正确渲染。它是通过将模型组合成一个模型来创建的，该模型从后到前渲染所有三角形。为了实现这种渲染，每个顶点必须存储一个唯一的 RGBA 值。请注意，当您旋转单个模型时，在三个球体的交点处会出现一些视觉伪影。这是因为在交叉点位置有一些三角形以错误的顺序呈现。可以通过细分交叉点周围的三角形来消除视觉伪影——代价是渲染速度较慢。

点击查看[交互式例子](http://learnwebgl.brown37.net/11_advanced_rendering/alpha_blending.html#experimentation-3-combined-models)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/11_advanced_rendering/transparency_example3/transparency_example3.html)

### Alpha 混合（所有细节）

将已经在颜色缓冲区中的颜色与来自渲染模型的新颜色混合的概念已被推广，以允许各种混合因素。当您在图形管道中启用混合时，渲染算法如下所示：
```js
void renderPixel(x, y, z, color) {
  if (z < zbuffer[x][y]) {
    zbuffer[x][y] = z;
    colorbuffer[x][y] = (colorbuffer[x][y] * percent1) + (color * percent2);
  }
}
```

颜色缓冲区中的颜色称为“目标颜色”。要渲染的对象的颜色称为“源颜色”。百分比值称为“因子”。因此，上述伪代码中突出显示的等式变为：
```js
colorbuffer[x][y] = (colorbuffer[x][y] * dst_factor) + (color * src_factor);
```

其中 dst_factor 和 src_factor 每个都是 3 分量因子，并且乘法是逐分量的。例如，如果颜色为 (0.2, 0.3, 0.4)，src_factor 为 (0.5, 0.6, 0.7)，则乘法颜色 * src_factor 的结果为 (0.10, 0.18, 0.28)。希望它是显而易见的，但是当您看到 src 时，它指的是“源颜色”或“源因素”。同样，dst 指的是“目标颜色”或“目标因子”。

我不喜欢“源”和“目的地”这两个名称，但我们需要使用它们，以便您了解用于指定百分比的常量。您没有明确指定因素；您指定一个方程来计算颜色值的因子。我们将为颜色值的组件使用以下名称：

```js
colorbuffer[x][y] --> (dst_red, dst_green, dst_blue, dst_alpha)
color             --> (src_red, src_green, src_blue, src_alpha)
```

您可以从以下等式中选择用于计算“因子”。这些中的任何一个都可用于 dst_factor 和/或 src_factor。

| WebGL 枚举常量 | 结果因素 | Alpha 值 |
| -- | -- | -- |
| gl.ZERO	| (0.0, 0.0, 0.0)	| 0.0 |
| gl.ONE	| (1.0, 1.0, 1.0)	| 1.0 |
| gl.SRC_COLOR	| (src_red, src_green, src_blue)	| src_alpha |
| gl.ONE_MINUS_SRC_COLOR	| (1 - src_red, 1 - src_green, 1 - src_blue)	| 1 - src_alpha |
| gl.DST_COLOR	| (dst_red, dst_green, dst_blue)	| dst_alpha |
| gl.ONE_MINUS_DST_COLOR	| (1 - dst_red, 1- dst_green, 1- dst_blue)	| 1 - dst_alpha |
| gl.SRC_ALPHA	| (src_alpha, src_alpha, src_alpha)	| src_alpha |
| gl.ONE_MINUS_SRC_ALPHA	| (1 - src_alpha, 1- src_alpha, 1 - src_alpha)	| 1 - src_alpha |
| gl.DST_ALPHA	|(dst_alpha, dst_alpha, dst_alpha)	| dst_alpha |
| gl.ONE_MINUS_DST_ALPHA	| (1 - dst_alpha, 1 - dst_alpha, 1 - dst_alpha) | 1 - dst_alpha |
| gl.CONSTANT_COLOR	| (constant_red, constant_green, constant_blue) | constant_alpha |
| gl.ONE_MINUS_CONSTANT_COLOR	| (1 - constant_red, 1 - constant_green, 1 - constant_blue) | 	1 - constant_alpha |
| gl.CONSTANT_ALPHA	| (constant_alpha, constant_alpha, constant_alpha) | constant_alpha |
| gl.ONE_MINUS_CONSTANT_ALPHA	| (1 - constant_alpha, 1 - constant_alpha, 1- constant_alpha) | 1 - constant_alpha |
| gl.SRC_ALPHA_SATURATE	| a = min(src_alpha, 1 - dst_alpha); (a,a,a) | 1.0 |

您可以像这样调用 blendFunc 在 JavaScript 中设置混合因子：
```js
gl.blendFunc(enum src_factor, enum dst_factor);
```

对于使用恒定颜色的因子，您可以使用此函数设置该颜色：
```js
void glBlendColor​(GLclampf red​, GLclampf green​, GLclampf blue​, GLclampf alpha​);
```

为了使事情进一步复杂化，您还可以使用 blendEquation 函数将颜色的加法更改为减法。这三个选项是：
```js
gl.blendEquation(gl.FUNC_ADD);
gl.blendEquation(gl.FUNC_SUBTRACT);
gl.blendEquation(gl.FUNC_REVERSE_SUBTRACT);
```

这使得管道的计算成为以下之一：
```js
colorbuffer[x][y] = (colorbuffer[x][y] * dst_factor) + (color * src_factor);
colorbuffer[x][y] = (colorbuffer[x][y] * dst_factor) - (color * src_factor);
colorbuffer[x][y] = (color * src_factor) - (colorbuffer[x][y] * dst_factor);
```

为了增加更多的复杂性，您可以将颜色分量的混合与 Alpha 值的混合分开。如果您使用以下功能：
```js
gl.blendFunc(enum src_factor, enum dst_factor);
gl.blendEquation(enum equation_mode);
```

然后颜色分量和 alpha 值以相同的方式处理。如果您使用以下功能：
```js
gl.blendFuncSeparate(enum src_factor, enum dst_factor, enum src_alpha, enum dst_alpha);
gl.blendEquationSeparate(enum equation_rgb_mode, enum equation_alpha_mode);
```

然后分别处理颜色分量和 alpha 值。所有这些选项都可能非常令人困惑，因此让我们将它们全部放在伪代码中以使其更清晰。 （请记住，这是在图形管道中实现的。您无法更改此实现，也无法在片段着色器中实现此功能。）
```js
vec3 getColorFactor(mode, src_color, dst_color, constant_color) {
  switch (mode) {
    case gl.ZERO:                     factor = (0.0, 0.0, 0.0);
    case gl.ONE:                      factor = (1.0, 1.0, 1.0);
    case gl.SRC_COLOR:                factor = (    src_color[0],     src_color[1],     src_color[2]);
    case gl.ONE_MINUS_SRC_COLOR:      factor = (1.0-src_color[0], 1.0-src_color[1], 1.0-src_color[2]);
    case gl.DST_COLOR:                factor = (    dst_color[0],     dst_color[1],     dst_color[2]);
    case gl.ONE_MINUS_DST_COLOR:      factor = (1.0-dst_color[0], 1.0-dst_color[1], 1.0-dst_color[2]);
    case gl.SRC_ALPHA:                factor = (    src_color[3],     src_color[3],     src_color[3]);
    case gl.ONE_MINUS_SRC_ALPHA:      factor = (1.0-src_color[3], 1.0-src_color[3], 1.0-src_color[3]);
    case gl.DST_ALPHA:                factor = (    dst_color[3],     dst_color[3],     dst_color[3]);
    case gl.ONE_MINUS_DST_ALPHA:      factor = (1.0-dst_color[3], 1.0-dst_color[3], 1.0-dst_color[3]);
    case gl.CONSTANT_COLOR:           factor = (constant_color[0], constant_color[1], constant_color[2]);
    case gl.ONE_MINUS_CONSTANT_COLOR: factor = (1.0-constant_color[0], 1.0-constant_color[1], 1.0-constant_color[2]);
    case gl.CONSTANT_ALPHA:           factor = (constant_color[3], constant_color[3], constant_color[3]);
    case gl.ONE_MINUS_CONSTANT_ALPHA: factor = (1.0-constant_color[3], 1.0-constant_color[3], 1.0-constant_color[3]);
    case gl.SRC_ALPHA_SATURATE:       a = min(src_color[3], 1.0-dst_color[3]);
                                      factor = (a,a,);
  }
  return factor;
}

vec3 getAlphaFactor(mode, src_color, dst_color, constant_color) {
  switch (mode) {
    case gl.ZERO:               alpha_factor = 0.0;
    case gl.ONE                 alpha_factor = 1.0;
    case gl.SRC_COLOR           alpha_factor =     src_color[3];
    case gl.ONE_MINUS_SRC_COLOR alpha_factor = 1.0-src_color[3]);
    case gl.DST_COLOR           alpha_factor =     dst_color[3];
    case gl.ONE_MINUS_DST_COLOR alpha_factor = 1.0-dst_color[3];
    case gl.SRC_ALPHA           alpha_factor =     src_color[3];
    case gl.ONE_MINUS_SRC_ALPHA alpha_factor = 1.0-src_color[3];
    case gl.DST_ALPHA           alpha_factor =     dst_color[3];
    case gl.ONE_MINUS_DST_ALPHA alpha_factor = 1.0-dst_color[3];
    case gl.SRC_ALPHA_SATURATE  alpha_factor = 1.0;
  }
  return alpha_factor;
}

void renderPixel(x, y, z, color) {
  if (z < zbuffer[x][y]) {
    zbuffer[x][y] = z;

    dst_color = colorbuffer[x][y];
    src_color = color;

    dst_factor[0,1,2] = getColorFactor(dst_mode, src_color, dst_color, constant_color);
    dst_factor[3] = getAlphaFactor(dst_mode, src_color, dst_color, constant_color);

    src_factor[0,1,2] = getColorFactor(src_mode, src_color, dst_color, constant_color);
    src_factor[3] = getAlphaFactor(src_mode, src_color, dst_color, constant_color);

    switch (blendEquation) {
      case gl.FUNC_ADD:              dst_color = dst_color * dst_factor + src_color * src_factor;
      case gl.FUNC_SUBTRACT:         dst_color = dst_color * dst_factor - src_color * src_factor;
      case gl.FUNC_REVERSE_SUBTRACT: dst_color = src_color * src_factor - dst_color * dst_factor;
    }
    colorbuffer[x][y] = dst_color;
  }
}
```

### 实验 4（Alpha 混合百分比）

请通过选择混合因子的各种组合来试验以下 WebGL 演示程序。

点击查看[交互式例子](http://learnwebgl.brown37.net/11_advanced_rendering/alpha_blending.html#experimentation-4-alpha-blending-percentages)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/11_advanced_rendering/transparency_example4/transparency_example4.html)

### 总结

与透明度相关的简单视觉效果可以使用 Alpha 混合来实现。精确渲染在 3D 空间中相交的透明模型需要结合涉及模型定义、排序和图形管道配置的技术。您通常会实现实现特定场景所需结果所需的最少功能。