## 阴影

第 9 节中讨论的照明计算假设场景中的所有对象都接收到来自光源的光。对于包含多个对象的场景，通常某些表面会阻挡光线照射到其他表面。如果光线被物体挡住，我们就说不接收直射光的表面部分处于阴影中。人类严重依赖阴影来理解 3D 场景中对象的 3D 特性。没有阴影的场景更难理解。本课解释了如何使用传统的“阴影贴图”方法渲染阴影以及与“阴影贴图”相关的问题。

### 传统的“影子图”方法

为了渲染阴影，每次我们将一个片段渲染到颜色缓冲区时，我们都需要问一个问题，“这个像素是否接收来自光源的直射光？”如果答案是否定的，则只需为像素分配环境照明（或者可能是较低百分比的漫射照明）。

为了回答哪些表面接收直射光的问题，我们可以在光源处放置一个“相机”并渲染场景。我们想要的每个像素的信息是从光源到最近表面的距离。理论上这是一个简单的问题，因为 z 缓冲区（由隐藏表面去除算法创建）的内容是我们想要的信息。遗憾的是，WebGL 不允许访问默认的 z-buffer。但是 WebGL 确实允许您创建一个由纹理对象组成的单独帧缓冲区，然后将图像渲染到这个“屏幕外”帧缓冲区。这实际上是非常有利的，因为在我们从光源位置渲染场景后，我们需要在正常渲染期间使用该数据，而纹理贴图图像是在特定位置查找值的便捷方式。

传统的“阴影贴图”算法遵循以下步骤。请注意，我们将场景渲染两次，就像我们为对象选择所做的那样。第一次渲染确定哪些表面接收直射光。第二次渲染创建用户看到的视觉图像。

1. 将渲染目标设置为程序员创建的由纹理对象组成的帧缓冲区。
2. 在光源处放置一个“相机”并渲染场景。这会将距离光源最近的表面的 z 值放入深度缓冲区（即 z 缓冲区）。
3. 将渲染目标更改为普通帧缓冲区（称为绘图缓冲区）。
4. 从相机的位置和方向渲染场景
    - 顶点着色器计算与“光源”和“相机”相关的表面位置。这两个位置都被放置在不同的变量中，并在整个表面上进行插值。因此，对于每个片段，我们都知道它在“光照空间”和“相机空间”中的位置。
    - 片段着色器使用来自第 1 步和第 2 步的“光源渲染”的纹理贴图来确定像素是否处于全光或阴影中。

为了实现这个算法，我们需要讨论以下主题：

- 如何将场景渲染到纹理贴图。出于渲染阴影的目的，生成的纹理贴图称为“阴影贴图”。
- 如何从光源的位置和方向渲染场景。
- 如何使用“阴影贴图”来确定对象是否处于阴影中。

我们将在以下部分讨论如何实现这三个想法，但首先让我们讨论 WebGL 扩展。

### WebGL 扩展

WebGL 1.0 是一个不断发展的规范，它有一个标准机制供开发人员提出和实现新功能。您可以通过调用 gl.getSupportedExtensions() 获取特定浏览器支持的 WebGL“扩展”列表。扩展以可移植性为代价提供功能。请记住，WebGL 程序在客户端浏览器中的客户端计算机上运行。您通常无法控制您的 WebGL 程序可能执行的环境。如果你希望你的 WebGL 程序在任何平台上都能正确执行，你应该避免使用扩展。但是，对于某些算法，需要扩展才能使算法工作。在其他情况下，扩展可以使算法更容易实现，并且在某些情况下执行得更快。所以明智地使用扩展。

您可以通过以下函数调用获取有关正在执行的 WebGL 实现的基本信息：
```js
console.log('WebGL version: ', gl.getParameter(gl.VERSION));
console.log('WebGL vendor : ', gl.getParameter(gl.VENDOR));
console.log('WebGL supported extensions: ', gl.getSupportedExtensions());
```

这些命令的更典型用途是根据浏览器支持的 WebGL 版本修改 WebGL 程序的行为。代码可能类似于：
```js
var version = gl.getParameter(gl.VERSION); // "WebGL 1.0"
if (version.substring(6,9) === "1.0") {
  ...
} else {
  ...
}
```

如果我们使用允许我们渲染到由纹理对象表示的深度缓冲区的 WebGL 扩展，我们将能够以更简单和更有效的方式实现传统的“阴影贴图”算法。以下代码启用 WEBGL_depth_texture 扩展。如果调用 gl.getExtension(name) 返回 null，则启用扩展的请求失败。
```js
depth_texture_extension = gl.getExtension('WEBGL_depth_texture');
if (!depth_texture_extension) {
  console.log('This WebGL program requires the use of the ' +
    'WEBGL_depth_texture extension. This extension is not supported ' +
    'by your browser, so this WEBGL program is terminating.');
  return;
}
```

请注意，上述代码中的变量 depth_texture_extension 不需要或从未在其余代码中使用。但是，在某些情况下，调用 gl.getExtension() 返回的对象需要访问扩展的功能。

让我们讨论如何渲染到程序员创建的帧缓冲区的细节。

### 渲染到纹理贴图

请记住，帧缓冲区是一组用于渲染的三个缓冲区：

- 颜色缓冲区存储渲染图像的 RGBA 颜色值。
- 深度缓冲区（或 z 缓冲区）存储距离相机最近的表面的距离。
- 模板缓冲区存储一个可选的“掩码”，用于确定可以修改哪些像素。

WebGL 在创建上下文时会自动创建包含颜色缓冲区和深度缓冲区的帧缓冲区。帧缓冲区的大小与其关联的 HTML 画布的大小相匹配。 （模板缓冲区是可选的，不会自动创建。）

您可以渲染到程序员创建的帧缓冲区以创建特殊效果。我们想使用渲染的结果来产生阴影，所以缓冲区被创建为纹理对象，以便我们可以在渲染完成后使用它们。创建由纹理对象组成的程序员定义的帧缓冲区的步骤如下：

1. 创建一个新的帧缓冲区对象。 gl.createFramebuffer()
2. 创建一个纹理对象来存储颜色缓冲区值。纹理对象的大小决定了渲染的分辨率。它的内部格式是 RGBA（红、绿、蓝、阿尔法），其中每个值都是一个无符号字节，gl.UNSIGNED_BYTE。 （这是 WebGL 1.0 支持的唯一格式。） gl.createTexture()、gl.bindTexture()、gl.texImage2D()、gl.texParameteri()
3. 创建第二个纹理对象来存储深度缓冲区值。此纹理对象的大小必须与第一个纹理对象的大小相匹配。它的内部格式是 gl.DEPTH_COMPONENT，每个值都是一个 32 位整数 gl.UNSIGNED_INT，它表示 [0.0, +1.0] 范围内的深度值。 （整数值被缩放，使得 0.0 代表 z 近剪裁平面，1.0 代表 z 远剪裁平面。）
4. 将第一个纹理对象附加到帧缓冲区的“颜色附件”，并将第二个纹理对象附加到帧缓冲区的“深度附件”。 gl.bindFramebuffer(), gl.framebufferTexture2D()
5. 验证帧缓冲区对象是否有效。 gl.checkFramebufferStatus()

这是一个典型的帧缓冲区创建函数。

```js
/** ---------------------------------------------------------------------
 * Create a frame buffer for rendering into texture objects.
 * @param gl WebGLRenderingContext
 * @param width Number The width (in pixels) of the rendering (must be power of 2)
 * @param height Number The height (in pixels) of the rendering (must be power of 2)
 * @returns WebGLFramebuffer object
 */
function _createFrameBufferObject(gl, width, height) {
  var frame_buffer, color_buffer, depth_buffer, status;

  // Step 1: Create a frame buffer object
  frame_buffer = gl.createFramebuffer();

  // Step 2: Create and initialize a texture buffer to hold the colors.
  color_buffer = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, color_buffer);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
                                  gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // Step 3: Create and initialize a texture buffer to hold the depth values.
  // Note: the WEBGL_depth_texture extension is required for this to work
  //       and for the gl.DEPTH_COMPONENT texture format to be supported.
  depth_buffer = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, depth_buffer);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, width, height, 0,
                                  gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // Step 4: Attach the specific buffers to the frame buffer.
  gl.bindFramebuffer(gl.FRAMEBUFFER, frame_buffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, color_buffer, 0);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,  gl.TEXTURE_2D, depth_buffer, 0);

  // Step 5: Verify that the frame buffer is valid.
  status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    console.log("The created frame buffer is invalid: " + status.toString());
  }

  // Unbind these new objects, which makes the default frame buffer the
  // target for rendering.
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return frame_buffer;
}
```

请注意，仅当 WEBGL_depth_texture 扩展可用并启用时，上述帧缓冲区定义才有效。另请注意，此功能可能因多种原因而失败，最常见的错误是缓冲区内存不足。以下演示程序中包含的此功能的版本包含错误检查和功能失败时的相应错误消息。

另外，请特别注意控制纹理贴图的参数。重要的是，通过将缩小和放大过滤器设置为 gl.LINEAR，对纹理贴图的查找在离散值之间进行插值。这使得对纹理贴图的查找尽可能准确。您可以尝试下面的演示代码并将过滤器更改为 gl.NEAREST，但结果会很差。

纹理贴图的“包裹”参数也很重要。如果我们尝试访问纹理贴图之外的值，那么适当的行为是什么？没有好的选择，但最不坏的选择是在边缘重复阴影贴图的值。因此 gl.CLAMP_TO_EDGE 的设置。

### 从光源渲染

我们需要从光源的有利位置渲染场景以确定哪些表面接收直射光。只有最靠近光源的表面才能接收直射光，因此深度缓冲区的 z 分量可以告诉我们最近的表面有多远。让我们定义一些术语，以免我们感到困惑。让我们称从光源渲染场景的相机为“光源相机”。我们将渲染可见场景的相机称为“视图相机”。

为了从光源的有利位置渲染场景，我们需要关于相机的两条信息：1）它的位置，以及 2）它的方向（即它的局部坐标系）。位置很简单：就是光源的位置。方向是一个更难的问题——光源处的相机应该指向哪个方向？事实证明，确切的方向并不重要。关键是场景中从“观察相机”可见的所有模型都包含在“光源相机”的渲染中。因此，“光源相机”使用的视线和投影是算法的关键部分，因为它们共同定义了渲染的裁剪体积。以下是有关用于阴影贴图渲染的投影的关键点：

- 如果使用正交投影渲染“视图相机”，则应该使用正交投影来渲染阴影贴图。同样适用于透视渲染。
- 投影应定义为足够大以包含场景中的所有可见对象。
- 投影应尽可能小，以将浮点计算误差降至最低。

因此，计算良好阴影贴图数据的关键部分是设置适合特定场景的大小的投影变换。

现在让我们假设每个相机都是使用发送到 LookAt() 函数的标准参数定义的，这些参数是：

- 摄像头的位置；眼睛位置。
- 相机前方沿视线方向的点的位置；中心位置。
- 指向“向上”的大致方向的向量。

以下演示程序使用以下约定来设置相机：

- 两个相机使用相同的中心点。如果中心点选择得当，这将允许两个渲染都包含正确的模型。 （请注意，对于由 LookAt() 函数定义的普通相机，中心点的确切位置并不重要，因为它简单地定义了相机的视线。对于阴影贴图，中心点的确切位置很关键。）
- 两个相机使用相同的向上矢量。这使阴影贴图的方向与可见场景保持同步。

### 使用阴影贴图确定阴影

当我们从“观察相机”渲染场景时，我们需要对每个片段提出这个问题，“这是离光源最近的表面吗？”如果是，片段将获得全光照。如果不是，则片段处于阴影中。我们可以使用阴影贴图来回答这个问题，它是一种纹理贴图，其中每个分量值都是从光源到最近片段的距离。 “诀窍”是从阴影贴图中获得正确的距离。

当我们从“观察相机”渲染场景时，我们将在表面上插入两个不同的 (x,y,z) 位置。

1. 由“光源相机”变换矩阵计算的表面的 (x,y,z) 位置。我们使用这个位置从“阴影贴图”中查找“与灯光的距离”值​​。
2. 由“观察相机”变换矩阵计算的表面的 (x,y,z) 位置。我们使用这个位置来渲染场景。

这是一个计算 3D 空间中这两个不同位置的顶点着色器：

```js
// Vertex shader
// Scene transformations
uniform mat4 u_PVM_transform; // Projection, view, model transform
uniform mat4 u_Shadowmap_transform; // The transform used to render the shadow map

// Original model data
attribute vec3 a_Vertex;

// Data (to be interpolated) that is passed on to the fragment shader
varying vec4 v_Vertex_relative_to_light;

void main() {

  // Calculate this vertex's location from the light source. This is
  // used in the fragment shader to determine if fragments receive direct light.
  v_Vertex_relative_to_light = u_Shadowmap_transform * vec4(a_Vertex, 1.0);

  // Transform the location of the vertex for the rest of the graphics pipeline.
  gl_Position = u_PVM_transform * vec4(a_Vertex, 1.0);
}
```

使用这两个 3D 位置很简单，但需要注意的是，您必须了解转换如何工作的确切细节，因为必须将值转换为适当的单位。以下 GLSL 片段着色器函数执行计算和转换。请研究代码并特别注意描述每个语句的注释。

```js
// Fragment shader
//-------------------------------------------------------------------------
// Determine if this fragment is in a shadow. Returns true or false.
bool in_shadow(void) {

  // The vertex location rendered from the light source is almost in Normalized
  // Device Coordinates (NDC), but the perspective division has not been
  // performed yet. Perform the perspective divide. The (x,y,z) vertex location
  // components are now each in the range [-1.0,+1.0].
  vec3 vertex_relative_to_light = v_Vertex_relative_to_light.xyz / v_Vertex_relative_to_light.w;

  // Convert the the values from Normalized Device Coordinates (range [-1.0,+1.0])
  // to the range [0.0,1.0]. This mapping is done by scaling
  // the values by 0.5, which gives values in the range [-0.5,+0.5] and then
  // shifting the values by +0.5.
  vertex_relative_to_light = vertex_relative_to_light * 0.5 + 0.5;

  // Get the z value of this fragment in relationship to the light source.
  // This value was stored in the shadow map (depth buffer of the frame buffer)
  // which was passed to the shader as a texture map.
  vec4 shadowmap_color = texture2D(u_Sampler, vertex_relative_to_light.xy);

  // The texture map contains a single depth value for each pixel. However,
  // the texture2D sampler always returns a color from a texture. For a
  // gl.DEPTH_COMPONENT texture, the color contains the depth value in
  // each of the color components. If the value was d, then the color returned
  // is (d,d,d,1). This is a "color" (depth) value between [0.0,+1.0].
  float shadowmap_distance = shadowmap_color.r;

  // Test the distance between this fragment and the light source as
  // calculated using the shadowmap transformation (vertex_relative_to_light.z) and
  // the smallest distance between the closest fragment to the light source
  // for this location, as stored in the shadowmap. When the closest
  // distance to the light source was saved in the shadowmap, some
  // precision was lost. Therefore we need a small tolerance factor to
  // compensate for the lost precision.
  if ( vertex_relative_to_light.z <= shadowmap_distance + u_Tolerance_constant ) {
    // This surface receives full light because it is the closest surface
    // to the light.
    return false;
  } else {
    // This surface is in a shadow because there is a closer surface to
    // the light source.
    return true;
  }
}
```

### “Shadowmap”方法的演示

当您尝试以下演示程序时，阴影应该对您有意义。在您确信阴影是正确的之后，尝试创建阴影失败的场景。你能辨别出错误的原因吗？
重新开始

点击查看[交互式例子](http://learnwebgl.brown37.net/11_advanced_rendering/shadows.html#a-demo-of-the-shadowmap-approach)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/11_advanced_rendering/shadows_example/shadows_example.html)

### 处理阴影贴图中的错误

由于以下原因，阴影将被错误地渲染：
1. 阴影贴图不包括一些可见表面。
    - 如果您的片段着色器程序从其阴影贴图查找 z 值并且该位置位于纹理贴图之外，这意味着该位置位于阴影贴图渲染的投影之外。我们将纹理贴图设置为在这种情况下使用边缘值（即 gl.CLAMP_TO_EDGE），但这通常是错误的。
2. 阴影贴图的 z 值与“观察相机”渲染期间计算的 z 值不同。
    这个问题不可能准确地弥补，但在很多情况下，我们可以通过一个简单的“容差系数”得到合理的结果。场景的正确“容差系数”不一定与上述演示的“容差系数”相同。您可能必须进行试验才能找到合理的值。

    以下是透视投影的细节。 （有关详细信息，您可以返回第 8.3 节。）

    渲染阴影贴图时，透视投影会将以下值放在顶点着色器的 gl_Position 输出变量中。

    ```js
    gl_Position[2] = c1 + (-z)*c2  // z component (distance from the camera)
    gl_Position[3] = -z;           // w component (the perspective divide)
    ```

    c1 和 c2 常数由 z 剪切平面之间的距离定义：

    ```js
    c1 = 2*near*far / (near-far);
    c2 = (far+near) / (far-near);
    ```

    深度缓冲区分配了特定数量的位，用于存储每个片段与相机的距离。在透视除法之后，z 值在归一化的设备坐标中，它们是介于 -1.0 和 +1.0 之间的浮点数。要将这些值映射到深度缓冲区，这些值将按 0.5 缩放并移动 0.5 以介于 0.0 和 +1.0 之间，然后转换为无符号整数。确切的数学是：

    ```js
    depth_buffer[x][y] = ((z * 0.5) + 0.5) * (2^bits_per_value - 1);
    ```

    这些深度值是深度缓冲区的确切内容。因此，这是作为渲染到程序员定义的帧缓冲区的结果而存储在阴影贴图纹理中的值。请注意，深度值不是线性的。靠近相机的值具有更高的分辨率（精度），而远离相机的值具有较低的分辨率。另请注意，用于深度缓冲区的位数限制了值的准确性。对于上面的演示代码，纹理贴图的“深度分量”被指定为 gl.UNSIGNED_INT，它提供了可能的最大分辨率，即每个值 32 位。

    底线：创建阴影贴图时，会丢失一些深度值的准确性。如果准确性的损失是一致的，那就太好了，但事实并非如此。误差取决于与相机的距离和 z 值本身。右图显示了各种 z 值的误差，其中近裁剪平面为 -4，远裁剪平面为 -50。如您所见，对于某些 z 值，误差的大小会变大，但对于某些较大的 z 值，误差可能接近于零。误差不一致的事实意味着使用单个恒定的“容差值”将无法正确补偿阴影计算中的所有误差。

    <center>
      <img src="/11/shadow_error.png" />
      <p>阴影计算中的错误</p>
    </center>

### 总结

正确渲染阴影是一个引人入胜的主题，您可能会喜欢更详细地研究它。关于[阴影贴图](https://en.wikipedia.org/wiki/Shadow_mapping)的维基百科文章是实现阴影渲染的其他算法的一个很好的参考。