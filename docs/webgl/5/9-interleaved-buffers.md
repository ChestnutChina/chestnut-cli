## 交错的缓冲区

当你玩电子游戏时，当你进入一个新的关卡或新的场景时，游戏会暂停，屏幕经常会出现几秒钟的空白。视频游戏在做什么。也许你可以根据以前的课程来猜测？

一个GPU的内存是有限的。当你玩视频游戏并换到一个新场景时，游戏必须删除其当前所有的缓冲对象，创建新的缓冲对象，并将渲染新场景所需的模型数据上传到这些缓冲对象中。现在你知道了吧!

### 管理缓冲区对象

在将模型数据上传到缓冲区对象时，你有两种选择:
- 为每种类型的数据创建一个单独的缓冲区对象，就像在前面的课程中所做的那样。每个顶点着色器属性变量都链接到一个唯一的缓冲区对象。
- 为一个模型的所有数据创建一个缓冲区对象，并将数据交错排列。

你已经看到了第一个选项的几个例子。对于只有几个模型的简单场景，这种方法是足够的。当你想创建有100多个模型的复杂场景时，交错数据是更好的方法。

交错数据将所有模型数据放入一个单一的一维数组中，并将数据上传到一个缓冲对象中。当你将顶点着色器中的属性变量链接到缓冲区对象时，你必须告诉WebGL如何获得该变量的具体数据。这是用gl.vertexAttribPointer函数的参数来完成的。
```js
gl.vertexAttribPointer(uint index, int size, enum type, bool normalized, long stride, long offset);
```

参数含义如下：
i- ndex：要链接的属性变量的位置。
- size：属性值中的组件数量；1、2、3或4。
- type：每个组件值的数据类型；例如，gl.FLOAT。
- normalized : 如果为真，整数值将被规范化为-1.0到+1.0；对于WebGL，总是为假。
- stride : 一个属性值的开始与下一个属性值之间的字节数。
- offset : 跳过的字节数，以获得第一个值。

一个例子应该能让人明白。你的模型中的每个顶点都有一个(x,y,z)值，以及一个RGB颜色值，和一个(s,t)纹理坐标值。每个顶点的所有8个值将依次存储在一个1D数组中。这些数据看起来就像这样。

```js
[x1,y1,z1, r1,g1,b1, s1,t1, x2,y2,z2, r2,g2,b2, s2,t2, x3,y3,z3, r3,g3,b3, s3,t3,...]
```

让我们假设你的顶点着色器有以下三个属性变量，需要链接到单一缓冲区对象。

```js
attribute vec3 a_vertex;
attribute vec3 a_color;
attribute vec2 a_texture;
```

你需要让缓冲区对象处于活动状态，然后像这样调用gl.vertexAttribPointer函数三次。

```js
var buffer_data = new Float32Array(size);
bytes_per_float = buffer_data[0].BYTES_PER_ELEMENT;

gl.bindBuffer(gl.ARRAY_BUFFER, buffer_object_id);

gl.vertexAttribPointer(vertex_location,  3, gl.FLOAT, false, bytes_per_float*8, 0);
gl.vertexAttribPointer(color_location,   3, gl.FLOAT, false, bytes_per_float*8, bytes_per_float*3);
gl.vertexAttribPointer(texture_location, 2, gl.FLOAT, false, bytes_per_float*8, bytes_per_float*6);
```

