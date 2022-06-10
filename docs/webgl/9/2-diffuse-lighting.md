## 漫反射照明

本课讨论如何实现光的[漫反射](https://en.wikipedia.org/wiki/Diffuse_reflection)。

### 一个简单的漫射照明模型

直接照射到物体上，然后向各个方向反射的光被称为 "漫射 "光。光的反射量是由光线和表面法线矢量之间的角度决定的。在物理学中，[朗伯的余弦律](https://en.wikipedia.org/wiki/Lambert%27s_cosine_law)提供了一个计算漫反射颜色的方程式。

<center>
  <img src="/9/diffuse_light.png" />
</center>

### 漫反射的数学

要执行漫射照明计算，定义三角形的每个顶点都必须具有关联的法线向量。法线向量定义了从三角形前侧突出的方向。法线向量定义了光线将如何从顶点定义的表面反射。法线向量可能与三角形表面成 90 度角，也可能是其他角度以模拟曲面

下图标注了计算漫反射所需的部分。我们需要计算顶点的法向量与从顶点指向光源的向量之间的角度。这个角度在图中被标记为“theta”。

<center>
  <img src="/9/diffuse_angle.png" />
</center>

两个向量的点积定义为它们相关项的乘积之和。 3D 向量通常存储为数组，其中 (v[0], v[1], v[2]) 是向量的 \<dx, dy, dz> 值。因此，向量 v0 和 v1 的点积为：

```JavaScript
function dotProduct (v0, v1) {
  return v0[0] * v1[0]  +  v0[1] * v1[1]  +  v0[2] * v1[2];
};
```

可以证明，两个向量的点积等于两个向量夹角的余弦除以两个向量的长度。在代码格式中，这意味着：
```JavaScript
dotProduct(v0, v1) === cos(angle_between_v0_and_v1) / (length(v1) * length(v2))
```

如果 v0 和 v1 都是长度为 1 的法向量，则点积会给出角度的余弦值而无需任何除法。

检查一下右边的余弦曲线图。注意，当角度为零时，零的余弦为1.0。随着角度的增加，角度的余弦曲线为零。当角度为90度时，90的余弦为0.0。这就是兰伯特的余弦律。余弦值被视为颜色的百分比。当角度为零时，cos(0)为1.0，你得到100%的颜色。当角度为90度时，cos(90)为零，你得到0%的颜色。当角度变得大于90或小于-90时，余弦会变成负数。这表明三角形的前侧指向远离光源的地方。你不能有一个负的光的百分比，所以我们把角度的余弦夹在0.0和1.0之间的值。

<center>
  <img src="/9/cos_function.png" />
</center>

### 用于漫射照明的 WebGL 演示程序

试验以下 WebGL 程序。移动光源并检查模型上的颜色如何变化。

点击查看[交互式例子](http://learnwebgl.brown37.net/09_lights/lights_diffuse.html#a-webgl-demo-program-for-diffuse-lighting)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/09_lights/light_position/light_position.html)

在您试验演示程序时，请确保您观察到以下漫反射特性。

- 移动相机对漫反射没有影响。计算中涉及的唯一元素是对象的顶点和点光源的位置。
- 如果您将光源移动到靠近特定面部的位置，则面部上的每个像素都可能具有不同的颜色。该程序正在逐个像素地计算片段着色器中的漫反射。
- 请注意，一些被光线“阻挡”的面仍然具有明亮的颜色。也就是说，脸部应该没有光线，因为在它和光源之间有一个物体。然而，我们简单的光照模型并没有考虑场景中其他物体阻挡的光线。大多数人从来没有注意到这个事实！
- 此照明模型不考虑从灯光到表面的距离。在现实世界中，物体离光源越远，它接收到的光就越少。我们将在后面的课程中对此进行研究。

### 着色器程序中的漫反射

请研究以下着色器程序。然后将程序与下面的评论进行比较。

####  顶点着色器
```JavaScript
// Vertex Shader
precision mediump int;
precision mediump float;

// Scene transformations
uniform mat4 u_PVM_transform; // Projection, view, model transform
uniform mat4 u_VM_transform;  // View, model transform

// Light model
uniform vec3 u_Light_position;

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

- 片段着色器中的所有计算都将在“相机空间”中完成，因此顶点数据通过模型和相机转换进行转换，而不是投影转换。
- 着色器基于三个统一变量:
    - u_PVM_transforms：包含模型、视图和投影变换的单个变换矩阵。
    - u_VM_transforms：包含模型和视图变换的单个变换矩阵。
    - u_Light_position：包含点光源在“相机空间”中的位置的单个位置 (x,y,z)。 （这个位置已经放置在场景中并乘以视图变换。）
- 该顶点的位置 (x,y,z,1)、法线向量 \<dx,dy,dz,0> 和颜色 (red,green,blue,1)原始元素。因此，我们将这些数据放入与该顶点相关的不同变量中。
- 3 分量值和 4 分量值之间有多种转换。您需要一个 4 分量值来执行 4x4 矩阵和顶点或向量之间的矩阵乘法。请注意，顶点的第 4 分量始终为 1.0，而向量的第 4 分- 量值始终为 0。这是因为顶点可以平移，而向量没有位置且无法平移。

#### 片段着色器

```JavaScript
// Fragment shader program
precision mediump int;
precision mediump float;

// Light model
uniform vec3 u_Light_position;

// Data coming from the vertex shader
varying vec3 v_Vertex;
varying vec4 v_Color;
varying vec3 v_Normal;

void main() {

  vec3 to_light;
  vec3 vertex_normal;
  float cos_angle;

  // Calculate a vector from the fragment location to the light source
  to_light = u_Light_position - v_Vertex;
  to_light = normalize( to_light );

  // The vertex's normal vector is being interpolated across the primitive
  // which can make it un-normalized. So normalize the vertex's normal vector.
  vertex_normal = normalize( v_Normal );

  // Calculate the cosine of the angle between the vertex's normal vector
  // and the vector going to the light.
  cos_angle = dot(vertex_normal, to_light);
  cos_angle = clamp(cos_angle, 0.0, 1.0);

  // Scale the color of this fragment based on its angle to the light.
  gl_FragColor = vec4(vec3(v_Color) * cos_angle, v_Color.a);
}
```

- 这计算了一个向量到灯光和顶点法线向量之间的角度。
- 着色器实现向量和矩阵数学，因此当您减去两个 vec3 变量时，它会创建一个 vec3 结果。
- 顶点法线向量的值是三角形顶点的法线向量的插值。很容易证明，这个插值向量可能没有单位长度。因此，必须对每个片段的 v_Normal 向量进行归一化。
- 颜色的百分比必须介于 0% 和 100% 之间。由于余弦函数可以计算负值，因此百分比值被限制在 0.0 和 1.0 之间的值。
- 颜色值是（红、绿、蓝、阿尔法）值。我们希望减少颜色量但不改变 alpha 值。这就是为什么颜色被转换为 vec3，按百分比缩放，然后转换回 vec4，原始 alpha 值不变。

### 光源类型

上面的示例 WebGL 程序基于“点光源”。如果您有不同类型的光源，例如太阳光源，则必须更改着色器程序，因为您的光源的定义会改变，但基本数学将是相同的。