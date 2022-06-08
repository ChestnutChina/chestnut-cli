## 矩阵代码库

所有3D计算机图形的基础是4x4矩阵变换。在最初的OpenGL API中，所有的基本变换都在库的代码中为你实现。你所要做的就是以正确的顺序调用正确的函数。WebGL是为CPU和GPU功能有限的低功率移动设备实现的。变换矩阵的功能并不包括在WebGL的API中。因此，你必须在JavaScript中实现你自己的矩阵操作。但对于个人程序员来说，"重新发明轮子 "是没有意义的。本课为你介绍一个JavaScript矩阵库，并解释如何使用它。

### WebGL 转换矩阵

一个WebGL，4x4，变换矩阵是一个Float32Array类型的一维数组，包含16个浮点值。这些值代表一个二维数组，并以列为主的顺序存储。(早在20世纪60年代，Fortran以列为主的顺序存储二维数据。这一惯例已经传播到今天仍在使用的各种系统，包括OpenGL。大多数现代编程语言使用行为主的顺序）。

4x4 变换矩阵：

```html
┌                ┐  Eq1
│ 0    1   2   3 │
│ 4    5   6   7 |
| 8    9  10  11 │
| 12  13  14  15 |
└                ┘
```

将在 JavaScript 代码中创建，如下所示：
```JavaScript
var matrix = new Float32Array([0,4,8,12, 1,5,9,13, 2,6,10,14, 3,7,11,15]);
// Or
var m = new Float32Array(16);
m[0] =  0;  m[4] =  1;  m[ 8] =  2;  m[12] = 3;
m[1] =  4;  m[5] =  5;  m[ 9] =  6;  m[13] = 7;
m[2] =  8;  m[6] =  9;  m[10] = 10;  m[14] = 11;
m[3] = 12;  m[7] = 13;  m[11] = 14;  m[15] = 15;
```

在大多数情况下，上面的第二个例子被使用，因为如果你能将数据值可视化为一个二维数组，那么调试代码就会更容易。

注意：如果你重新格式化矩阵库的代码，你将失去 "每行多个语句 "的格式，这有助于4x4矩阵的可视化。建议你不要重新格式化这个代码文件。

### 矩阵库的设计决策

一个典型的类定义定义了一组数据和一组作用于这些数据的函数。类背后的一个重要想法是对类的实例中的一组数据值进行封装和保护。对于我们的矩阵库，我们并不真正需要数据保护。我们需要的是对矩阵操作的功能进行封装，这样我们就可以最大限度地减少创建和删除矩阵处理所需的抓取数组的过程。考虑到一个动画需要每秒至少30次的场景渲染。如果你每次渲染都要不断地创建新的对象实例，那么你将会创建大量的对象。JavaScript做了动态内存垃圾回收，所以很多程序员只是简单地忽略了内存问题。但如果你能尽量减少每次渲染时新对象的创建，你的动画就有可能运行得更流畅。

### Learn_webgl_matrix 类

一个名为Learn_webgl_matrix的类被定义在一个名为[Learn_webgl_matrix.js](http://learnwebgl.brown37.net/lib/learn_webgl_matrix.js)的文件中。它封装了我们在制作WebGL渲染时需要的矩阵功能。Learn_webgl_matrix对象并不存储矩阵。它封装了矩阵功能和该功能所需的抓取数组。而且，通过将矩阵功能与矩阵数据分开，代码的语法得到了简化。

你将创建一个库的实例，并将其用于你的整个程序。该库包含的功能有：
 - 创建变换。
 - 设置一个特定类型的变换值，以及
 - 执行矩阵操作。

转换存储为 Float32Array。 Learn_webgl_matrix 对象中的四个函数创建并返回新的变换，它们的名称都以 create 开头。不应在每个动画帧的渲染代码中调用这些函数。它们应该在您的设置代码中调用一次，以创建您在渲染期间需要的任何转换。创建新矩阵变换的四个函数是：

 - `create()`，它创建并返回一个新的 4x4 变换矩阵。
 - `createOrthographic()`，它创建一个新的正交投影变换矩阵。
 - `createPerspective()`，它创建一个新的透视投影变换矩阵。
 - `createFrustum()`，它创建一个新的透视投影变换矩阵。

设置变换矩阵值的函数必须发送一个变换矩阵作为第一个参数。例如:

 - `scale(M, sx, sy, sz)`将M设定为一个缩放变换。
 - `translate(M, tx, ty, tz)`将M设定为平移变换。
 - `rotate(M, angle, x_axis, y_axis, z_axis)`将M设为一个旋转变换。

执行矩阵计算的函数会改变其第一个参数的值，而其他所有的参数则保持不变。参数的排序类似于赋值语句，赋值语句总是改变其左侧的变量，但保留赋值语句右侧的所有值不变。比如说:
 - `multiply(R, A, B)` 将 `R` 设置为 `A` 与 `B` 的乘积。 `(R = A*B)`

函数 multiplySeries() 将任意数量的矩阵相乘以生成单个变换矩阵。它使用可变参数，并且将接受与您发送的参数一样多的参数。例如，m.multiplySeries(R,A,B,C,D,E) 将计算 A*B*C*D*E 的矩阵乘积并将结果存储在 R 中。在方程格式中，它执行 R = A *B*C*D*E；。乘法的顺序很关键。如果将变换 R 应用于一组顶点，则 R 的效果将是:

1. 变换E被应用于一个顶点。
2. 然后对变换后的顶点进行变换D。
3. 然后对变换后的顶点施加变换C。
4. 然后将变换B应用于变换后的顶点，再将变换A应用于变换后的顶点。
5. 最后将变换A应用于变换后的顶点。

从多个变换创建单个变换时，必须始终从右到左对变换进行排序。
### Learn_webgl_matrix 代码

下面的演示显示了 Learn_webgl_matrix 类。查看代码以熟悉其矩阵功能。许多功能的实现细节将在以后的课程中讨论。下面的代码不可编辑。您可能想稍后修改代码，但现在您只需要学习如何使用代码。

点击查看[交互式例子](http://learnwebgl.brown37.net/transformations2/matrix_library_introduction.html#the-learn-webgl-matrix-code)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/transformations2/simple_transform_example/simple_transform_example.html)


### 使用 Learn_webgl_matrix 的 HTML 代码

`Learn_webgl_matrix` 类使用其他两个类的代码：
 - `learn_webgl_point4.js`，它为 (x,y,z,w) 点定义了一个类。
 - `learn_webgl_vector3.js`，它为 \<dx,dy,dz> 向量定义了一个类。

这些文件必须与矩阵库一起加载到您的浏览器中。要使用矩阵库，请在 HTML 文件中包含如下所示的 \<script> 指令：
```javascript
<script src="../../lib/learn_webgl_point4.js"></script>
<script src="../../lib/learn_webgl_vector3.js"></script>
<script src="../../lib/learn_webgl_matrix.js"></script>
```
根据 JavaScript 代码文件与 HTML 文件的相对位置更改文件路径。如果 HTML 和 JavaScript 文件位于服务器上的同一文件夹中，则可以省略文件路径。