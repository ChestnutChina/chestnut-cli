## 镜面照明

本课讨论如何实现光的[镜面反射](https://en.wikipedia.org/wiki/Specular_reflection)。

### 镜面光照模型

以与其入射角相等但相反的角度从表面反射的光线称为“镜面反射”。我们假设光反射的量等于入射光的强度。也就是说，我们假设反射矢量的大小等于入射光矢量的大小。反射光线由右图中的绿色矢量表示。请仔细研究图表。

<center>
  <img src="/9/specular_vector.png" />
  <p>镜面光反射</p>
</center>

如果镜面反射光线直接进入相机，就好像相机直接看到了光源，即使它已经从物体反射回来。相机看到的是光源的光，而不是物体的颜色。如果你有一个白色光源，镜面反射将是白色的。如果你有一个红色的光源，镜面反射将是红色的。因此，要模拟镜面反射，您需要在照明模型中指定光源的颜色。

<center>
  <img src="/9/specular_angle.png" />
  <p>镜面光强度</p>
</center>

我们假设反射矢量周围有少量的光散射，但并不多。如图所示，散射以反射矢量为中心。

<center>
  <img src="/9/specular_scattering.png" />
  <p>镜面光散射</p>
</center>

如果我们计算从片段到相机的向量，然后计算它与反射向量之间的角度，我们可以使用该角度来估计相机接收到的镜面反射量。如果角度为零，则相机正在接收整个反射光线。如果角度非常小，那么一定百分比的反射光线会进入相机。如果角度很大，则没有来自反射的光进入相机。如果角度介于大小之间，我们需要一种方法来计算进入相机的反射光的百分比。我们使用余弦函数来计算漫射光百分比，但余弦函数对于聚焦镜面反射来说太宽泛了。但是，如果我们将余弦函数提高一次幂，曲线会围绕 Y 轴折叠。在下面的 cos(angle)exp 函数图中使用各种指数进行实验。通过使用该方程的各种指数，我们可以模拟镜面反射矢量周围的各种光散射量。如果指数很大，例如 100，则 cos(angle)exp 会围绕 Y 轴收缩，只有非常小的角度才会返回显着的百分比值。如果指数较小，例如 1.0，则将模拟反射光线周围的大量光线

点击查看[交互式例子](http://learnwebgl.brown37.net/09_lights/lights_specular.html#a-specular-lighting-model)

### 镜面反射的数学

为了计算镜面反射，我们需要两个向量：

- 从片段位置到相机的向量。
- 反射光矢量

这两个向量之间的角度决定了镜面反射的量。

要计算从片段位置到相机的矢量，请从尾部（片段位置）中减去矢量的头部（相机）。正如我们之前所讨论的，我们在“相机空间”中执行这些计算，并且相机位于全局原点 (0,0,0)。因此，相机的向量是：

```JavaScript
to_camera[0] = 0 - fragment_position[0]
to_camera[1] = 0 - fragment_position[1]
to_camera[2] = 0 - fragment_position[2]
```

我们可以通过简单地将片段位置乘以 -1 来计算这个向量。

### 计算反射向量

为了计算反射向量，我们需要设置几个中间向量。在继续讨论之前，请研究一下右边的图。光源的位置可以投影到顶点的法向量上。这就是图中的 "p "向量。可以证明，法线矢量方向上的一个矢量，其长度可以通过取-L和归一化顶点法线矢量的点积来计算。点积可以计算出两个向量之间的角度，但只有当向量具有单位长度时才可以。注意，法线向量是正常化的，但-L向量不是。这为投影点的N向量提供了正确的长度。总而言之，为了计算N，我们:

- 归一化顶点的法向量，使其长度为一个单位。我们称它为n。
- 计算-L和n的点积。我们称这个值为 s。
- 将 n 缩放 s 以创建向量 N，该向量位于顶点法线向量的方向上，并且长度到光源的投影点。
- 从简单的向量加法，L + N === P。

<center>
  <img src="/9/reflection_vectors1.png" />
  <p>计算反射向量</p>
</center>

现在我们知道了向量 P。通过简单的向量加法观察，反射向量 R 等于 N + P。我们可以将 N 和 P 的计算代入这个方程，如下所示：

```JavaScript
R = N + P
R = n*dot_product(n,-L) + (L + N)
R = n*dot_product(n,-L) + (L + n*dot_product(n,-L))
R = 2*n*dot_product(n,-L) + L
```

如果你翻转 L 的方向并遵循相同的逻辑，你会得到：
```JavaScript
R = 2*n*dot_product(n,L) - L   // When L goes from the vertex to the light source
```

### 相机接收到的反射光线的百分比

我们有一个从顶点到相机的向量，我们有一个反射向量。这两个向量之间的角度表示有多少反射光线进入相机。该角度的余弦值（介于 0.0 和 1.0 之间的百分比）被提高到某个幂，以模拟反射光线周围的聚焦光束。该指数通常称为“光泽度”指数。指数越大，物体看起来越亮。闪亮的物体具有小而集中的镜面反射。暗淡的物体有大而分散的镜面反射。

### 用于镜面反射的 WebGL 演示程序

试验以下 WebGL 程序。移动光源和相机以查看它们之间的交互。在您的脑海中，将光源直观地投射到物体上，并将其反射到相机中。镜面反射有意义吗？请尝试该程序，直到它成功为止。

点击查看[交互式例子](http://learnwebgl.brown37.net/09_lights/lights_specular.html#a-webgl-demo-program-for-specular-reflection)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/09_lights/light_specular/light_specular.html)

在您试验演示程序时，请确保您观察到镜面反射的以下特征。

- 物体、光源和相机的相对位置会影响镜面反射。
- 该程序正在逐个像素地计算片段着色器中的镜面反射。
- 我们的简单光照模型不考虑场景中其他物体阻挡的光线。如果一个物体挡住了立方体的光，你仍然会在立方体上看到镜面反射。
- 镜面反射的颜色是来自光源的光的颜色。在来自光源的光直接反射到相机镜头的位置，相机看到的是光而不是物体的颜色。

### 着色器程序中的镜面反射

请研究以下着色器程序。然后将程序与下面的评论进行比较。

#### 顶点着色器

```JavaScript
// Vertex Shader
precision mediump int;
precision mediump float;

// Scene transformations
uniform mat4 u_PVM_transform; // Projection, view, model transform
uniform mat4 u_VM_transform;  // View, model transform

// Light model
uniform vec3 u_Light_position;
uniform vec3 u_Light_color;
uniform float u_Shininess;

// Original model data
attribute vec3 a_Vertex;
attribute vec3 a_Color;
attribute vec3 a_Vertex_normal;

// Data (to be interpolated) that is passed on to the fragment shader
varying vec3 v_Vertex;
varying vec4 v_Color;
varying vec3 v_Normal;

void main() {

  // Perform the model and view transformations on the vertex and pass this
  // location to the fragment shader.
  v_Vertex = vec3( u_VM_transform * vec4(a_Vertex, 1.0) );

  // Perform the model and view transformations on the vertex's normal vector
  // and pass this normal vector to the fragment shader.
  v_Normal = vec3( u_VM_transform * vec4(a_Vertex_normal, 0.0) );

  // Pass the vertex's color to the fragment shader.
  v_Color = vec4(a_Color, 1.0);

  // Transform the location of the vertex for the rest of the graphics pipeline
  gl_Position = u_PVM_transform * vec4(a_Vertex, 1.0);
}
```

- 这与上一课中用于漫反射照明的顶点着色器程序相同，但添加了两个新的统一变量：u_Light_color 和 u_Shininess。这些值增强了我们的照明模型。
- 片段着色器中的所有计算都将在“相机空间”中完成，因此顶点数据通过模型和相机转换进行转换，而不是投影转换。

### 片段着色器

片段着色器计算反射向量，然后确定是否应该使用任何反射光来为像素着色。
```JavaScript
// Fragment shader program
precision mediump int;
precision mediump float;

// Light model
uniform vec3 u_Light_position;
uniform vec3 u_Light_color;
uniform float u_Shininess;

// Data coming from the vertex shader
varying vec3 v_Vertex;
varying vec4 v_Color;
varying vec3 v_Normal;

void main() {

  vec3 to_light;
  vec3 vertex_normal;
  vec3 reflection;
  vec3 to_camera;
  float cos_angle;
  vec3 specular_color;
  vec3 object_color;
  vec3 color;

  // Calculate a vector from the fragment location to the light source
  to_light = u_Light_position - v_Vertex;
  to_light = normalize( to_light );

  // The vertex's normal vector is being interpolated across the primitive
  // which can make it un-normalized. So normalize the vertex's normal vector.
  vertex_normal = normalize( v_Normal );

  // Calculate the reflection vector
  reflection = 2.0 * dot(vertex_normal,to_light) * vertex_normal - to_light;

  // Calculate a vector from the fragment location to the camera.
  // The camera is at the origin, so negating the vertex location gives the vector
  to_camera = -1.0 * v_Vertex;

  // Calculate the cosine of the angle between the reflection vector
  // and the vector going to the camera.
  reflection = normalize( reflection );
  to_camera = normalize( to_camera );
  cos_angle = dot(reflection, to_camera);
  cos_angle = clamp(cos_angle, 0.0, 1.0);
  cos_angle = pow(cos_angle, u_Shininess);

  // If this fragment gets a specular reflection, use the light's color,
  // otherwise use the objects's color
  specular_color = u_Light_color * cos_angle;
  object_color = vec3(v_Color) * (1.0 - cos_angle);
  color = specular_color + object_color;

  gl_FragColor = vec4(color, v_Color.a);
}
```

- 计算相机的矢量和反射矢量之间的角度。计算与上面数学部分中的描述完全相同。
- 重要的是要注意，角度的余弦值在提升到光泽指数之前被限制在 0.0 和 1.0 之间的值。如果反射矢量和相机的矢量具有大于 90 度的角度，则该角度可以为负。将数字提高到幂可以使值变为正值。例如，(-2)2 是 +4。 （如果角度的余弦为负值，它将被钳制为零，这意味着 0% 的反射光到达相机，这就是我们想要的物理结果。）
- 如果 cos(angle) 的值为 1，我们需要此片段的光源颜色。如果 cos(angle) 的值为零，我们需要对象的颜色。如果 cos(angle) 是介于 0 和 1 之间的某个百分比，我们将取光颜色的这个百分比，以及对象颜色的剩余百分比 (1.0 - cos_angle)。 “颜色是相加的”，所以我们可以简单地将两个颜色值相加。

### 光源类型

上面的示例 WebGL 程序基于点光源。如果您有不同类型的光源，例如太阳光源，则必须更改着色器程序，因为您的光源的定义会改变，但基本数学将是相同的。