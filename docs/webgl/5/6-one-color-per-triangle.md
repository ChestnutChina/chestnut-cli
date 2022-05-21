## 例2: 每个三角形一个颜色

我们希望对我们的模型的渲染有更多的控制，每个面有可能有不同的颜色。这可以通过调用gl.drawArrays()单独绘制每个三角形来实现，这就是我们之前版本的着色程序。代码会是这样的。
```js
// Draw each triangle separately
for (start = 0, color_index = 0; start < number_vertices; start += 3, color_index += 1) {
  // Set the color of the triangle
  gl.uniform4fv(u_Color_location, colors[color_index]);

  // Draw a single triangle
  gl.drawArrays(gl.LINE_LOOP, start, 3);
}
```

然而，如果一个模型是由100多个，甚至1000多个三角形组成的，我们就会有一个重大的速度问题。你的JavaScript程序中对WebGL命令的每一次调用都是一个巨大的时间消耗。如果我们想让图形变得快速，我们需要使用对gl.drawArrays的一次调用来绘制整个模型。

所以我们需要改变事情。当我们说改变事情时，我们的意思是改变几乎所有的事情!

### 模式介绍

你的模型数据的数据结构将影响你如何编写你的其他代码。有很多可能性，但让我们只在我们的每个 "三角形 "对象中存储一个颜色值。我们的三维模型的新版本显示在下面的例子中。请注意以下变化。

| 行数 | 说明 |
| -- | -- |
| 38-42 | 一个Triangle2对象现在可以存储一种颜色 |
| 72-75 | 定义了各种颜色值 |
| 78-81 | 每一个Triangle2对象的创建都会传递不同的颜色 |

点击查看[交互式例子](http://learnwebgl.brown37.net/rendering/render_example_02.html#the-model)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/rendering/simple_pyramid_color_triangle/simple_pyramid_color_triangle.html)

### 顶点着色器（Vertex Shader）

我们的着色器程序必须改变，因为我们模型的每个顶点现在都有两个属性：一个位置，（x,y,z），和一个颜色（r,g,b）。因此，我们的顶点着色器程序有两个属性变量：a_Vertex和a_Color。检查以下演示中的着色器程序，然后研究下面的描述。

点击查看[交互式例子](http://learnwebgl.brown37.net/rendering/render_example_02.html#the-shader-programs)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/rendering/simple_pyramid_color_triangle/simple_pyramid_color_triangle2.html)

| 行数 | 说明 |
| -- | -- |
| 7 | 对于这个着色器来说，只有一个变量在执行gl.drawArrays()时是恒定的，即统一模型转换矩阵u_Transform |
| 9-10 | 每个顶点有两个属性：一个位置和一个颜色 |
| 12 | 数值从顶点着色器传递到片段着色器，使用的是变化的存储量子。这在后面会更有意义。现在，我们需要一个 "变化的 "变量来将顶点的颜色传递给片段着色器。(注意，顶点的位置是通过gl_Position变量传递给frament shader的 |
| 18 | 将此顶点的RGB颜色值转换成RGBA颜色值，并将其传递给片段着色器 |

### 片段着色器（Fragment Shader）

| 行数 | 说明 |
| -- | -- |
| 7 | 使用与顶点着色器相同的名称声明一个变化的变量。当着色器被编译和链接时，这个变量将包含顶点着色器中设置的值 |
| 10 | 使用顶点的颜色来设置正在渲染的三角形内的每个像素的颜色 |

### 缓冲区对象

由于我们对每个顶点有两个属性，一个位置和一个颜色，我们将创建两个缓冲区对象。正如我们刚刚讨论的，每个顶点必须被分配一个颜色，尽管这需要相同的颜色值重复三次。研究以下例子中simple_model_render_02.js文件中的代码。确保你找到两个缓冲区对象的数据被收集的地方，然后在GPU中创建独立的缓冲区对象。

点击查看[交互式例子](http://learnwebgl.brown37.net/rendering/render_example_02.html#the-buffer-object-s)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/rendering/simple_pyramid_color_triangle/simple_pyramid_color_triangle3.html)

### 访问着色器变量

由于你的变量在着色器程序中发生了变化，你需要修改你的渲染代码来获得着色器变量的位置。上面的演示代码的第135-138行可以得到着色器变量的位置：
```js
// Get the location of the shader variables
u_Transform_location = gl.getUniformLocation(program, 'u_Transform');

a_Vertex_location    = gl.getAttribLocation(program, 'a_Vertex');
a_Color_location     = gl.getAttribLocation(program, 'a_Color');
```

### 将一个缓冲区对象与一个属性变量连接起来

我们现在有两个缓冲区对象，当我们渲染模型时，可以将变量链接到这些对象上。上述演示中的第170-181行进行了链接:
```js
// Activate the model's vertex Buffer Object
gl.bindBuffer(gl.ARRAY_BUFFER, triangles_vertex_buffer_id);

// Bind the vertices Buffer Object to the 'a_Vertex' shader variable
gl.vertexAttribPointer(a_Vertex_location, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(a_Vertex_location);

// Activate the model's color Buffer Object
gl.bindBuffer(gl.ARRAY_BUFFER, triangles_color_buffer_id);

// Bind the color Buffer Object to the 'a_Color' shader variable
gl.vertexAttribPointer(a_Color_location, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(a_Color_location);
```

请注意，在用gl.vertexAttribPointer()函数将缓冲区对象链接到一个变量之前，你必须用gl.bindBuffer()函数使其处于活动状态。

### 渲染

现在我们可以通过调用gl.drawArrays()来渲染整个模型。研究上面例子中第164-185行的渲染函数。

需要注意的是，我们不能再像上一课那样渲染三角形的边缘。为什么呢？现在着色器程序要求每个顶点都有一个缓冲对象的颜色。使用我们上面定义的着色器程序，我们可以通过创建第三个缓冲对象来渲染三角形的边缘，并为每个顶点重复使用黑色颜色。然后我们可以将a_Color变量连接到这个新的缓冲区，并像上一节课那样渲染边缘。这对内存来说是非常浪费的。另一个选择是有两个独立的着色器程序：用一个着色器程序绘制面，激活另一个着色器程序，然后再渲染边缘。这两种方案都有取舍之处。

您可以像这样更改活动着色器程序：
```js
gl.useProgram(program);
```

改变你的活动着色器程序会改变渲染环境，这需要时间，从而减慢渲染速度。因此，你应该尽可能少地在着色器程序之间切换。

### 总结

为了给一个模型的每个三角形使用不同的颜色，我们不得不修改模型的定义、着色器程序、缓冲器对象和渲染代码。这都是相互依赖的。这使得代码开发变得很困难，因为我们不得不在许多不同的地方做这么多的修改。在修改渲染代码时，理解 "大局 "是如此重要。