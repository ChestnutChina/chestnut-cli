## 旋转

旋转一个模型会改变一个模型的方向。此外，如果模型远离原点，模型的位置也会改变。在数学上，旋转要求所有三个组件都参与计算每个组件的转换值。对于旋转来说，组件的值是内接的。例如，对于平移和缩放，y的值不会影响x或z的值，但对于旋转则不然。旋转顶点的每个分量都是原顶点分量的某个部分的组合。如果我们用f1、f2、f3、f4、f5、f6、f7、f8和f9来代表一组分数，那么旋转的计算方式是：
```js
x' = x*f1 + y*f2 + z*f3;
y' = x*f4 + y*f5 + z*f6;
z' = x*f7 + y*f8 + z*f9;
```

分数f1、f2、f3、f4、f5、f6、f7、f8和f9必须被特别选择以产生圆周运动。

非常重要的是要理解你总是在围绕着某个东西旋转。也就是说，你总是有一个点和一条参考线，你在围绕它做圆周运动。一个圆总是有一个中心点。此外，一个圆总是位于一个平面内。一个平面可以由平面表面的法向量来定义。因此，一个旋转总是有一个旋转轴，也就是包含圆的平面的法向量。由于所有的平移和缩放都是相对于一个坐标系而言的，所以所有的旋转都是相对于同一个坐标系而言的，这也是有道理的。下面的数学知识是假设旋转总是围绕原点进行的。我们可以从简单的情况开始，然后向更复杂的情况发展，从而发展出旋转的一般方程式。

角度有一个方向。例如，你可以旋转45度或-45度。那么，哪个方向是正旋转，哪个方向是负旋转呢？为了与右手坐标系一致，我们使用 "右手规则 "来确定旋转方向。用你的右手，把你的拇指从其他手指上伸出来。你的拇指代表旋转轴。你的手指的卷曲代表正向旋转，如图所示。(如果你使用左手的坐标系统，你将做同样的事情--除了用你的左手）。

<center>
<img src='/6/right_hand_rule.png' />
</center>

角度总是相对于某些东西而言的。角度必须有一条定义为零角度的参考线。坐标系的轴是自然参考线。因此:

- 关于Z轴的零度被定义为X轴。
- 关于X轴的零度被定义为Y轴。
- 关于Y轴的零度被定义为Z轴。

利用这些惯例，注意到围绕任何一个坐标轴旋转90度，将把其中一个轴带到另一个轴的位置。
- 关于Z的90度旋转将X映射到Y
- 围绕X旋转90度，将Y映射到Z
- 关于Y的90度旋转，将Z映射到X

这些都只是我们同意的惯例，但这些惯例形成了一个非常好的、一致的、统一的旋转系统。

### 特殊案例和效果

让我们看一下三个特殊情况--围绕坐标系各轴的旋转。然后我们将使用这些特殊情况来发展围绕任何轴的旋转。请研究和实验以下的例子。在画布内点击并拖动你的鼠标光标，以获得三维世界的各种视图。

1. 围绕Z轴旋转

    首先，注意到当你围绕Z轴旋转一个模型时，每个顶点的Z分量保持不变；只有X和Y分量发生变化。还要注意，当你围绕z轴旋转90度时，x轴变成了y轴。所以在90度时，x分量变成了y分量，y分量变成了-x分量。因为旋转形成了一个圆，旋转角度的正弦和余弦为我们提供了我们在数值组合中需要的分数。计算结果可以很容易地显示为：

    ```js
    x' = x * cos(angle) + y * -sin(angle);
    y' = x * sin(angle) + y *  cos(angle);
    z' = z;
    ```

    点击查看[交互式例子](http://learnwebgl.brown37.net/transformations2/transformations_rotate.html#special-cases-and-effects)

    [在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/transformations2/rotate_about_z/rotate_about_z.html)

    请注意，当模型以原点为中心时（或Z轴上的任何地方），模型改变了方向但没有改变位置。如果你把模型从Z轴上移开，它的方向和位置都会改变。

2. 绕 X 轴旋转

    这种情况类似于围绕Z轴的旋转，但现在每个顶点的X分量保持不变；只有Y和Z分量需要改变。同样，由于旋转形成一个圆，旋转角度的正弦和余弦为我们提供了所需的分数。

    ```js
    x' = x;
    y' = y * cos(angle) + z * -sin(angle);
    z' = y * sin(angle) + z *  cos(angle);
    ```

    点击查看[交互式例子](http://learnwebgl.brown37.net/transformations2/transformations_rotate.html#special-cases-and-effects)

    [在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/transformations2/rotate_about_x/rotate_about_x.html)

    请注意，当模型以原点为中心时（或X轴上的任何地方），模型改变了方向但没有改变位置。如果你把模型从X轴上移开，它的方向和位置都会改变。

3. 绕 Y 轴旋转
   
    希望你能看到其中的规律! 围绕Y轴的旋转不会改变顶点的Y分量，但X和Z分量会根据旋转的角度而改变。

    ```js
    x' = x *  cos(angle) + z * sin(angle);
    y' = y;
    z' = x * -sin(angle) + z * cos(angle);
    ```
    点击查看[交互式例子](http://learnwebgl.brown37.net/transformations2/transformations_rotate.html#special-cases-and-effects)

    [在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/transformations2/rotate_about_x/rotate_about_x.html)

    请注意，当模型以原点为中心时（或y轴上的任何地方），模型改变了方向但没有改变位置。如果你把模型从y轴上移开，它的方向和位置都会改变。

### 绕任意轴旋转

我们可以用上面的三个旋转来计算围绕任何任意轴的旋转。给定一个旋转轴，\<ux, uy, uz>，其逻辑是这样的:

- 围绕Z旋转，将\<ux, uy, uz>放在Z-X平面内。让我们称这个新的矢量为\<ux', uy', uz'>。
- 然后绕Y旋转，将\<ux', uy', uz'>沿Z轴放置。
- 然后围绕Z轴旋转到所需的角度。
- 然后撤销对Y的旋转，将\<ux', uy', uz'>放回它原来的位置。
- 然后撤销绕Z轴的旋转，将\<ux', uy, uz>放回原来的位置。

这一系列的旋转将在用户面前显示为围绕\<ux, uy, uz>轴的圆形旋转。相当酷啊!

将5个旋转组合成一组方程是直截了当的，但很乏味。给你准确的方程而不说明其背后的发展，会让你感到困惑而不是帮助。因此，我们将暂时跳过旋转方程。更多的[细节](https://en.wikipedia.org/wiki/Rotation_matrix)可以在维基百科关于旋转的页面上找到。

点击查看[交互式例子](http://learnwebgl.brown37.net/transformations2/transformations_rotate.html#rotation-about-any-axis)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/transformations2/rotate_about_axis/rotate_about_axis.html)


