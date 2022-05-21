## OBJ数据转换为缓冲器对象

为WebGL程序建立复杂的模型应该使用Blender等建模工具。然而，将模型从Blender中获取到WebGL程序中并不是一件容易的事。你可以使用下面描述的JavaScript类，将OBJ模型文件转换为适合GPU缓冲区对象的WebGL数组。

当你组织一个模型的数据进行渲染时，你有两个基本选择:

1. 优化速度:
    - 怎么做：
      - 最大限度地减少为渲染一个模型而发出的WebGL Javascript命令的数量。
      - 在你渲染场景时尽量减少上下文切换。
      - 通过调用gl.drawArrays()来渲染整个模型（或多个模型）。
    - 影响因素：
      - 一切都使用gl.TRIANGLE模式进行渲染。
      - 一个着色器程序需要的所有数据都在按顶点组织的缓冲对象中。
      - 一个着色器程序被用来渲染整个模型（或场景）。
      - 模型数据将被复制到各个顶点上，从而产生非常大的缓冲对象。
2. 最大限度地减少内存使用:
    - 怎么做：
      - 尽可能多地使用gl.TRIANGLE_FAN和/或gl.TRIANGLE_STRIP来渲染三角形的集合。
      - 在你的顶点着色器程序中使用统一变量，以获得对多个三角形恒定的值。
    - 影响因素：
      - 许多对WebGL Javascript命令的调用。
      - 许多对gl.drawArrays()的调用。
      - 许多上下文切换。
      - 渲染的速度会变慢。

组织模型数据以同时获得快速渲染和有效的内存使用是不可能的。你必须根据你所创建的应用程序做出权衡。

### 函数 createModelsFromOBJ()

JavaScript文件learn_webgl_obj_to_arrays.js包含了类定义和全局函数，它们将把一个在*.obj数据文件中定义的模型转换成一组适合缓冲区对象的一维数组。函数createModelsFromOBJ，（见下面的函数原型），接收一个或多个模型的文本描述，以及一组材料属性定义，并返回一组ModelArrays对象。

```js
/**
 * Given an OBJ text model description, convert the data into 1D arrays
 * that can be rendered in WebGL.
 * @param model_description String Contains the model data.
 * @param materials_dictionary Dictionary of material objects.
 * @param out An object that knows where to display output messages
 * @return Object A set of ModelArray objects accessible by name or index.
 */
function createModelsFromOBJ(model_description, materials_dictionary, out) {
```

ModelArrays对象中的数组是为了快速渲染而优化的，而不是为了有效使用内存。缓冲区是围绕gl.drawArrays()的渲染模式组织的。

- 一个 ModelArrays 对象包含 3 个子对象:
  - Points 对象，可以使用 gl.POINTS 模式渲染:
    - 顶点 1D数组。[x1,y1,z1, x2,y2,z2, ...] 。
    - 颜色 1D数组。[r1,g1,b1, r2,g2,b2, ...]。
    - 所有点的材料属性。
  - Lines 对象，可以使用 gl.LINES 模式渲染:
    - 顶点 1D数组。[x1,y1,z1, x2,y2,z2, ...] 。
    - 颜色 1D数组。[r1,g1,b1, r2,g2,b2, ...］
    - 纹理 1D数组。[t1, t2, t3, ...] 纹理
    - 所有线条的材料属性。
  - Triangle 对象，可以使用gl.TRIANGLES模式进行渲染：
    - 顶点 1D数组。[x1,y1,z1, x2,y2,z2, ...] 。
    - 颜色 1D数组。[r1,g1,b1, r2,g2,b2, ...］
    - flat_normals向量 1D数组。[dx1,dy1,dz1, dx2,dy2,dz2, ...］
    - Smooth_normals向量一维数组。[dx1,dy1,dz1, dx2,dy2,dz2, ...］
    - 纹理一维数组。[s1,t1, s2,t2, ...] 所有三角形的材料属性。
    - 所有三角形的材料属性。

请注意以下有关 ModelArrays 对象中的数组的内容：
- 如果 OBJ 文件包含法线向量，则使用文件中的向量。
- 如果OBJ文件不包含法向量信息：
  - 如果一个面被数据文件中的 "s on "行标记为 "平滑"，那么一个顶点的法线向量被计算为-使用该顶点的三角形的法线向量的平均值。
  - 如果一个面被数据文件中的 "s off "行标记为 "flat"，那么顶点的法向量就是该面的法向量。
- 如果文件中没有纹理坐标，纹理坐标数组将是空的。
- 顶点的颜色是活动材料属性的Kd值，它来自于一个*.mtl文件。Kd值是材料属性的漫反射颜色。在这个实现中，假定一个模型中的所有元素将使用相同的环境、镜面、镜面高光和其他材料属性。如果你在你的着色器程序中使用这些属性，它们可以在你的着色器中被设置为统一的值。(如果任何材料属性在顶点之间发生变化，而你想在着色器程序中使用它们作为属性，你将需要修改ObjToArrays类中的代码，为这些值创建一个适当的一维数组）。

### OBJ模型数据演示

Learn_webgl_matrix.js中的代码可以在下面的演示中学习。你不需要完全理解这些代码，但你应该对代码的完成情况有一个总体的概念。你从一个包含一个或多个模型描述的.obj文件中发送文本，它将向你返回一个ModelArray对象的数组。每个ModelArray对象包含一组一维数组，包含按顶点组织的模型数据。这些数组已经准备好被放入GPU缓冲区对象，然后链接到着色器程序变量。

点击查看[交互式例子](http://learnwebgl.brown37.net/rendering/obj_to_buffers.html#obj-model-data-demo)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/rendering/obj_to_arrays_demo/obj_to_arrays_demo.html)

由 createModelsFromOBJ 函数返回的对象包含一个或多个模型。这些模型可以被 "按名称 "或通过数组索引访问。要以数组形式访问模型。
```js
// Create ModelArrays objects from the obj data
models = createModelsFromOBJ(obj_text, obj_materials, out);

// Access the models by array index
for (j = 0; j < models.number_models; j += 1) {
  one_model = models[j];

  // Do something with one_model
}
```

如果你知道你的模型的确切名称，你可以用这些名称来访问它们。一个模型的 "名字 "来自于你在Blender中给一组几何体分配的名字。createModelsFromOBJ函数返回的对象有使用这些名字的属性。假设你将你的模型命名为 "熊"、"猴子 "和 "山羊"。你可以用这些名字访问各个模型，就像这样。

```js
// Create ModelArrays objects from the obj data
models = createModelsFromOBJ(obj_text, obj_materials, out);

models.Bear
models.Monkey
models.Goat
```

### 总结

关于渲染的课程到此结束。我们将在第9、10和11节中再次讨论着色器程序，因为所有的表面材料和照明效果都是在着色器程序中完成的。