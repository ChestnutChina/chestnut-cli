## 缓冲区对象入门

缓冲对象是GPU中一个连续的内存块，可以被在GPU上执行的着色器程序快速访问。缓冲对象存储着色器程序在渲染时需要的数据。缓冲区对象的内容总是一个一维的数组。为了我们的目的，我们将考虑一个缓冲区对象总是同质的--也就是说，每个值都有相同的数据类型。(你可以用一些棘手的JavaScript代码来混合数据类型，但让我们保持简单)

缓冲对象为顶点着色器程序中的属性变量提供数据。请记住，WebGL是OpenGL的一个限制性子集，WebGL只允许属性变量是`float`、`vec2`、`vec3`、`vec4`、`mat2`、`mat3`和`mat4`类型。这些都是浮点值。因此，你创建的所有缓冲区对象都是浮点值的数组。

JavaScript不是一种强类型的语言，它不区分不同类型的数字。大多数编程语言都有shorts、ints、floats和doubles。JavaScript的只有一种数据类型用于数字值：number。为了处理二进制数据值，JavaScript通过添加 "类型化数组 "对象进行了修改。对于WebGL来说，你所有的缓冲区对象都将包含Float32Array数组。

```js
// Floating point arrays.
var f32 = new Float32Array(size); // Fractional values with 7 digits of accuracy
```

有两种方法可以把数据放入"类型化数组"：
- 包括一个正常的JavaScript数字数组作为构造函数的参数。
- 创建一定大小的数组，然后将单个元素设置为特定值。

下面的代码演示了这两个选项：
```js
// Create an array containing 6 floats. Notice the brackets around the array data.
var my_array = new Float32Array( [1.0, 2.0, 3.0, -1.0, -2.0, -3.0] );

// Create an array to hold 4 floating point numbers.
var an_array = new Float32Array(4);
an_array[0] = 12.0;
an_array[1] =  5.0;
an_array[2] = 37.0;
an_array[3] = 18.3;
```

### 创建和初始化缓冲区对象

请注意，缓冲区对象驻留在GPU中，但它们是使用WebGL API从JavaScript代码中创建、管理和删除的。下面是一个典型的命令序列，用于创建一个缓冲区对象并向其填充数据。

```js
//-----------------------------------------------------------------------
function createAndFillBufferObject(gl, data) {
  var buffer_id;

  // Create a buffer object
  buffer_id = gl.createBuffer();
  if (!buffer_id) {
    out.displayError('Failed to create the buffer object for ' + model_name);
    return null;
  }

  // Make the buffer object the active buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer_id);

  // Upload the data for this buffer object to the GPU.
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  return buffer_id;
}
```

请注意以下关于这个代码的内容：
- 创建一个对象缓冲区只不过是为一个新的缓冲区保留一个新的ID。
- 你通常会有许多对象缓冲区，其中只有一个是 "活动缓冲区"。当你对缓冲区对象发出命令时，你总是在操纵 "活动缓冲区"。bindBuffer函数只是将 "活动缓冲区 "改为使用buffer_id的特定缓冲区。
- bufferData函数将数据从你的JavaScript程序复制到GPU的缓冲区对象中。如果缓冲区对象中已经有数据，那么它的当前内容将被删除，新的数据将被添加。
- 当拷贝数据到GPU时，你将收到的主要错误是OUT_OF_MEMORY。上面的代码应该通过调用gl.getError()来检查gl错误，但我们将在后面担心捕捉错误的问题。

### 着色器、缓冲器和图形管道

着色器程序有时很难 "绕过你的大脑"，因为图形管道和着色器程序之间的关系并不明显，有时甚至从未解释过。让我们试着写一些伪代码来描述图形管道如何进行渲染。

每次你的JavaScript程序调用gl.drawArrays(mode, start, count)，'count'数量的顶点就会被送过图形管道。你的顶点着色器程序对于存储在缓冲对象中的顶点数组中的每个顶点都被调用一次。在图形管道中，有一个隐藏的算法正在做这个工作。

```js
for (j = start; j < count; j += 1) {
  call vertex_shader(vertex_buffer[j]);
}
```

如果要创建复杂的图形图像，顶点和片段着色器需要的不仅仅是位置数据。这些信息包括颜色、法线矢量、纹理坐标等。因为图形管道是为速度而优化的，所以其他数据必须按照与顶点数据相同的顺序组织在数组中。如果每个顶点都有额外的属性，上面的伪代码就变成了这样的东西。

```js
for (j = start; j < count; j += 1) {
  call vertex_shader(vertex_buffer[j], color_buffer[j], normal_vector_buffer[j], ...);
}
```

这是WebGL渲染的一个重要的基本原则。由于流水线的工作方式，所有数据都必须以 "每个顶点 "为基础进行组织。这意味着在某些情况下，你的数据必须在数组中重复多次，以便与顶点数据 "相匹配"。这对内存的使用是非常低效的，但它使渲染变得非常快。为了说明这个原理，假设你想用一种特定的颜色来渲染一个三角形。你必须创建一个数组来存储每个顶点的颜色，即使所有三个顶点都有相同的颜色。下面的代码显示了一个有9个值的数组，代表3个顶点。如果顶点的颜色来自一个缓冲对象中的数组，那么颜色必须被存储三次才能与顶点数据 "匹配"。在下面的例子中，颜色 "红色 "被存储了三次。

```js
var triangle_vertices = [0,0,0, 1,6,2, 3,4,1];
var triangle_color    = [1,0,0, 1,0,0, 1,0,0]
```