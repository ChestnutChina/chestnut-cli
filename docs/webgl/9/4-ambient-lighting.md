## 环境照明

本课讨论如何实现[环境光](https://en.wikipedia.org/wiki/Shading#Ambient_lighting)。

### 环境照明模型

环境光是“背景”光。它在各个方向到处反弹，并且来自没有特定的地方。环境光照亮模型的每个面，无论面朝向光源。所有面都获得相同数量的环境光。

环境光被建模为一个三分量矢量，其中每个值代表可见颜色的百分比。例如，环境“颜色”(0.2, 0.2, 0.2) 表示对象颜色的 20% 可见，而 (0.5, 0.5, 0.5) 表示对象颜色的 50% 可见。组件值通常都相同，但您可以通过使用独立值将一种颜色带出其他颜色。 (0.5, 0.1, 0.1) 的环境“颜色”会给人一种场景在背景某处有红色光源的印象。

### 环境光的数学

环境光的数学计算是微不足道的。表示对象颜色的 RGB 值乘以环境百分比以计算像素的最终颜色。

### 用于环境光的 WebGL 演示程序

通过修改环境光百分比来试验以下 WebGL 程序。您可以单独操作百分比，也可以同时操作所有百分比。

点击查看[交互式例子](http://learnwebgl.brown37.net/09_lights/lights_ambient.html#a-webgl-demo-program-for-ambient-light)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/09_lights/light_ambient/light_ambient.html)

在您试用演示程序时，请确保您观察到环境光的以下特征。

- 物体、光源和/或相机的相对位置对环境照明没有影响。
- 环境光是从任何方向可见的物体颜色的百分比。环境光永远不会使物体的颜色“更亮”；它只能使物体的颜色“变深”。环境照明的目的不是让物体“变暗”，而是确保脸部颜色的一定百分比始终可见，即使脸部没有来自光源的直射光。
- 通常的做法是对环境百分比的每个组成部分使用相同的值。这保持了场景中对象的相对颜色。但是您可以模拟任何颜色的“背景”光来创建特殊效果。
- 环境照明通常不单独使用。它通常与漫反射和镜面照明结合使用，这将在下一课中演示。

### 着色器程序中的环境照明

请研究以下着色器程序。然后将程序与下面的评论进行比较。

#### 顶点着色器

顶点着色器非常简单，因为它不必为片段着色器初始化“相机空间”几何值。
```JavaScript
// Vertex Shader
precision mediump int;
precision mediump float;

// Scene transformations
uniform mat4 u_PVM_transform; // Projection, view, model transform

// Light model
uniform vec3 u_Ambient_color;

// Original model data
attribute vec3 a_Vertex;
attribute vec3 a_Color;

// Data (to be interpolated) that is passed on to the fragment shader
varying vec4 v_Color;

void main() {

  // Pass the vertex's color to the fragment shader.
  v_Color = vec4(a_Color, 1.0);

  // Transform the location of the vertex for the rest of the graphics pipeline
  gl_Position = u_PVM_transform * vec4(a_Vertex, 1.0);
}
```

- 统一变量 `u_Ambient_color` 包含环境照明模型的颜色百分比。

#### 片段着色器

片段着色器将片段的颜色设置为对象颜色的百分比。请注意，当您在着色器语言中将两个向量相乘时，它会执行逐分量乘法。也就是说，假设 a = \<a0,a1,a2> 和 b = \<b0,b1,b2>。那么 a * b 等于一个 3 分量向量 \<a0*b0, a1*b1, a2*b2>。

```JavaScript
// Fragment shader program
precision mediump int;
precision mediump float;

// Light model
uniform vec3 u_Ambient_color;

// Data coming from the vertex shader
varying vec4 v_Color;

void main() {

  vec3 color;

  // Component-wise product; that is:
  // ambient_red * color_red, ambient_green * color_green, ambient_blue * color_blue
  color = u_Ambient_color * vec3(v_Color);

  // Ambient color does not affect the alpha value of the object's color.
  gl_FragColor = vec4(color, v_Color.a);
}
```
- 请注意，环境颜色不会影响像素颜色的 Alpha 分量。

### 光源类型

环境照明不基于场景中的光源类型。因此，上面的示例 WebGL 程序对于具有任何类型光源的任何场景都是相同的。