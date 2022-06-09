## 移动相机

在上一课中，我们讨论了摄像机如何移动。有些运动需要平移，有些运动需要旋转，而有些运动则两者都需要。这节课的重点是摄像机的平移。请记住，几乎所有摄像机的运动都是相对于摄像机的参照系而言的。

### 搬运

搬运摄像机是指在摄像机的视线方向不变的情况下，横向移动摄像机的位置（左或右）。你可以向左移动或向右移动。这是沿摄像机的u轴进行的平移。

有两种基本方法来实现搬运摄像机的运动。

- 修改对lookat函数的调用参数，然后调用lookat来创建一个摄像机变换矩阵，或者
- 直接修改一个摄像机的位置和坐标轴的定义。

让我们以两种方式解决问题。

### 使用lookat参数

函数LookAt需要两个点和一个矢量来设置一个摄像机的变换矩阵。具体来说，它需要1）摄像机的位置，2）沿着它的视线的一个点的位置，以及3）什么方向是向上的。卡车的移动显然会改变摄像机的眼睛位置。但是摄像机的方向不能改变，所以中心点也需要移动。这两个点都需要沿着摄像机的u局部坐标系轴定义的路径移动。图中说明了一辆卡车的移动:

<center>
  <img src='/7/trunk.png' />
</center>

卡车函数应该允许将卡车运动的距离作为一个参数来指定。如果距离是正的，函数应该是 "卡车向右"，这将使摄像机向+u轴的方向移动。如果距离为负数，函数应该是 "卡车向左"，这将使摄像机向-u轴的方向移动。该函数必须改变眼睛和中心点的位置。基本步骤是:

- 计算摄像机的u轴。
- 使用u轴方向的单位矢量，将该矢量按移动距离进行缩放，然后将该矢量加到眼睛和中心点。

下面的演示代码定义了一个LookAtCamera类，它包含一个眼点、一个中心点和一个向上的矢量，以及一个名为truck的函数，该函数将为 "卡车 "摄像机运动改变它们。请执行以下操作:

- 操纵演示中的控制器，将虚拟摄像机移动到不同的位置和方向，然后反复点击 "卡车 "按钮来 "卡车 "摄像机。注意运动是如何相对于摄像机的参考框架的。
- 然后检查LookAtCamera类中的代码。
- 然后研究演示下面的代码描述。(如果你想对代码进行实验，演示代码是可以编辑的）。

点击查看[交互式例子](http://learnwebgl.brown37.net/07_cameras/camera_linear_motion.html#use-lookat-parameters)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/07_cameras/camera_trunk_lookat/camera_trunk_lookat.html)

#### 代码说明：“卡车”功能

卡车函数使用Learn_webgl_point3和Learn_webgl_vector3类中的功能来简化点和向量的加减和缩放。如果你对这些代码的作用感到困惑，请在浏览器的调试器中打开这些代码文件。代码注释是理解代码的关键。请确保你阅读这些注释，并将它们与上面的 "卡车 "运动图进行比较。

#### 代码说明：“LookAtCamera”类

该类的构造函数创建了存储摄像机的表示方法所需的值。它还创建了Learn_webgl_matrix、Learn_webgl_point3和Learn_webgl_vector3类的实例，这样它们就可以在卡车函数中进行处理。你应该只创建一次这些对象，然后根据需要重新使用它们。

eye、center和up_vector被创建为公共变量，以便演示代码可以很容易地操纵它们。如果你想使用更好的软件工程设计，你可以将这些变量作为类的私有变量，只允许通过 "getter "和 "setter "函数来操作它们。

### 修改相机的定义

让我们使用相机的基本定义来操作相机：一个位置和三个坐标轴。我们定义了一个名为 AxesCamera 的类，它存储有关相机的以下数据：

```js
// Camera definition at the default camera location and orientation.
self.eye = P.create(0, 0, 0);  // (x,y,z), origin
self.u   = V.create(1, 0, 0);  // <dx,dy,dz>, +X axis
self.v   = V.create(0, 1, 0);  // <dx,dy,dz>, +Y axis
self.n   = V.create(0, 0, 1);  // <dx,dy,dz>, +Z axis
```

请注意，眼睛值存储了相机的位置，而三个向量存储了相机的方向。如果我们不改变这三个向量，相机的方向将不会改变。因此，要执行卡车摄像机移动，我们只需要修改眼睛值。我们的卡车功能的新版本如下所示：

```js
function Truck(distance) {
  // Scale the u axis to the desired distance to move
  V.scale(u_scaled, self.u, distance);

  // Add the direction vector to the eye position.
  P.addVector(self.eye, self.eye, u_scaled);

  // Set the camera transformation. Since the only change is in location,
  // change only the values in the 4th column.
  self.transform[12] = -V.dotProduct(self.u, self.eye);
  self.transform[13] = -V.dotProduct(self.v, self.eye);
  self.transform[14] = -V.dotProduct(self.n, self.eye);
}
```

您可以使用以下演示来试验此版本的代码。

点击查看[交互式例子](http://learnwebgl.brown37.net/07_cameras/camera_linear_motion.html#modify-a-camera-s-definition)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/07_cameras/camera_trunk_axes/camera_trunk_axes.html)

### 总结

涉及相机位置平移的相机移动遵循由相机坐标轴之一指定的方向。如果使用卡车运输摄像机，它会沿着 u 轴移动。如果相机是固定的，它会跟随 v 轴。并且，如果一个相机是移动的，它会跟随 n 轴。

操作实际的相机定义（一个点和 3 个轴）需要较少的计算，但对相机矩阵变换有更多的数学理解。