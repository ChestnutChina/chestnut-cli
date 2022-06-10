## 结合环境光、漫反射光和镜面光

现在您已经了解了三种基本的光模型：环境光、漫反射光和镜面反射光，我们可以将这三种模型组合成一个通用模型来进行逼真的光建模。当我们组合灯光模型时，唯一的问题是如何将三种不同的颜色组合成一种颜色。答案很简单。由于光的颜色是相加的，我们所要做的就是将三种颜色加在一起。除了添加颜色，本课没有新的数学。

### 环境光、漫反射和镜面光照模型

对于场景内的点光源，我们需要以下数据来对灯光进行建模：

- 灯的位置
- 灯光的颜色
- 背景光的环境百分比

光与物体的表面相互作用。为了模拟光，我们还需要表面的基本属性，例如：

- 表面颜色
- 表面的位置
- 表面的方向（它的法线向量）
- 表面的光泽指数

#### 着色器：制服与属性

第 9.3 课中的镜面反射 WebGL 程序使用统一变量来存储“光泽度”值，但它实际上是模型表面的属性，而不是光源的属性。为什么不将光泽度存储为模型的属性变量？好吧，本来可以的。如果模型的每个三角形都有不同的光泽度，您将存储一组光泽度值，每个顶点一个。对于一个典型的模型，它的所有表面都具有相同的光泽度，我们将值存储在一个统一变量中一次。

### 组合照明模型的数学

没有新的数学要讨论。环境光、漫反射光和镜面光的计算按照我们在前面课程中讨论的方式进行，然后将生成的颜色加在一起以获得最终颜色。

### 一个 WebGL 演示程序

试验以下 WebGL 程序。有许多值需要试验，所以花点时间弄清楚这些设置是如何相互作用的。

点击查看[交互式例子](http://learnwebgl.brown37.net/09_lights/lights_combined.html#a-webgl-demo-program)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/09_lights/light_combined/light_combined.html)

在您试验演示程序时，请确保您观察到以下结合环境光、漫反射光和镜面光的特性。

- 如果没有直接光照在脸上，则脸部的颜色仅基于环境光计算。
- 如果光源没有反射到相机中，则颜色基于环境和漫反射计算的总和。
- 如果光源确实反射到相机中，则颜色基于环境、漫反射和镜面反射计算的总和。

### 组合照明模型的着色器程序

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
uniform vec3 u_Ambient_color;

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
- 请注意，光照模型现在由 4 个值定义：`u_Light_position`、`u_Light_color`、`u_Shininess`、`u_Ambient_color`。

#### 片段着色器
```JavaScript
// Fragment shader program
precision mediump int;
precision mediump float;

// Light model
uniform vec3 u_Light_position;
uniform vec3 u_Light_color;
uniform float u_Shininess;
uniform vec3 u_Ambient_color;

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
  vec3 diffuse_color;
  vec3 specular_color;
  vec3 ambient_color;
  vec3 color;

  // Calculate the ambient color as a percentage of the surface color
  ambient_color = u_Ambient_color * vec3(v_Color);

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
  diffuse_color = vec3(v_Color) * cos_angle;

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

  // The specular color is from the light source, not the object
  if (cos_angle > 0.0) {
    specular_color = u_Light_color * cos_angle;
    diffuse_color = diffuse_color * (1.0 - cos_angle);
  } else {
    specular_color = vec3(0.0, 0.0, 0.0);
  }

  color = ambient_color + diffuse_color + specular_color;

  gl_FragColor = vec4(color, v_Color.a);
}
```

- 计算的矢量 to_light 用于漫反射计算和反射矢量。
- specular_color 与表面漫反射颜色的百分比相结合。这与我们在第 9.3 课中使用的想法相同，但这次我们采用一定百分比的漫反射颜色而不是面部颜色。
- 请注意，像素的最终颜色只是环境光、漫反射和镜面反射计算的总和。这是一个分量方向的向量加法。也就是说，如果 a = \<a0,a1,a2> 且 b = \<b0,b1,b2>。那么 a + b 等于一个 3 分量向量 \<a0+b0, a1+b1, a2+b2>。
- 如果将操作组合成单个语句，则可以用更少的行编写此代码。例如，漫反射计算可以这样写成一行：
    ```JavaScript
    diffuse_color = vec3(v_Color) * clamp(dot(vertex_normal, to_light), 0.0, 1.0);
    ```
    鼓励您在学习的很晚之前不要写这样的复杂语句。 GLSL 编译器将优化您的代码，因此请尽可能清晰地为人类编写代码！为了清楚起见，使用描述性变量名称和多个不同的语句。

### 光源类型

上面的示例 WebGL 程序基于点光源。如果您有不同类型的光源，例如太阳光源，则必须更改着色器程序，因为您的光源的定义会改变，但基本数学将是相同的。