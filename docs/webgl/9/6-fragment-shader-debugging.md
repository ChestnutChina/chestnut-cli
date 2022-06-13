## 片段着色器调试

片段着色器执行计算以将颜色分配给渲染中的像素。出于这些照明教程的目的，片段着色器执行照明模型的计算以将颜色分配给像素。

片段着色器可能难以调试。调试普通计算机程序通常通过以下两种方式之一完成：1) 将中间值打印到控制台窗口，或 2) 使用交互式调试器设置断点并一次单步执行一个语句。这两种方法都不适用于在 GPU 上运行的片段着色器。那么，如果片段着色器工作不正常，如何调试它呢？

### 做你的作业！

最小化调试的最简单方法是编写一个正确运行的着色器程序。这听起来可能很傻，但是如果您在开始编码之前在纸上创建了良好的逻辑和良好的方程式，它可以为您省去调试的麻烦。做你的作业！不要吝啬设计阶段。不要猜测并“希望它有效”。做细致的设计，有时不需要调试。

### 用中间值代替颜色

片段着色器的唯一输出是存储在 gl_FragColor 输出着色器变量中的像素颜色。我们可以将各种值代入此颜色变量，并通过检查输出渲染来可视化中间计算的值。通过将 gl_FragColor 值重新分配给各种值来试验以下 WebGL 程序。请注意，颜色被定义为三个不同的值，顶点和向量也是如此。唯一的区别是每个值的允许范围。颜色分量始终是介于 0.0 和 1.0 之间的值。因此，在某些情况下，您可能需要在将中间值放入 gl_FragColor 变量之前对其进行缩放或操作。

在您试验下面的 WebGL 程序时尝试这些变量替换。您将更改片段着色器的第 72 行。

### 实验#1

```JavaScript
gl_FragColor = vec4(vertex_normal, v_Color.a);
```

进行更改后，请确保单击“重新启动”按钮。您应该在每个像素中看到代表每个像素的法线向量的颜色。法线向量被归一化，因此每个分量值都在 -1.0 和 +1.0 之间。当它用作颜色时，负值将被限制为 0.0。如果您看到红色，则向量指向 X 轴。如果您看到绿色，则向量指向 Y 轴。如果您看到蓝色，则向量指向 Z 轴。确保移动相机以使顶点法线发生变化。如果您只看到黑色，则顶点法线为 (0.0, 0.0, 0.0)，并且在检索或计算法线向量时存在一些错误。

### 实验#2
```JavaScript
gl_FragColor = vec4(abs(vertex_normal), v_Color.a);
```

abs() 函数将反转法线向量中的任何负值，但您不会知道哪些值是负值。此输出可能会让您感到困惑，而不是帮助您。

### 实验#3
```JavaScript
gl_FragColor = vec4(cos_angle, cos_angle, cos_angle, v_Color.a);
```

这会将 cos（角度）显示为从白色 (1.0) 到黑色 (0.0) 的强度值。这对于调试角度非常有帮助。

### 实验#4
```javascript
gl_FragColor = vec4(v_Vertex, v_Color.a);
```

这会将每个顶点的 3D 位置显示为一种颜色。您可以使用它来“检查”您的顶点转换。

### 实验#5
```JavaScript
gl_FragColor = vec4(reflection, v_Color.a);
```
这会将每个片段（像素）的反射矢量显示为一种颜色。您可以使用它来“检查”您的反射向量计算。

### 实验

点击查看[交互式例子](http://learnwebgl.brown37.net/09_lights/fragment_shader_debugging.html#experiment)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/09_lights/light_combined/light_combined.html)

### 总结

将中间计算值放入 gl_FragColor 变量是一门艺术，而不是一门科学。要有创意！调试着色器程序可能非常具有挑战性。