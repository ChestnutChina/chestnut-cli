## 纹理映射-续

模拟真实世界物体（如布料、木材、大理石和水）的表面的惊人“纹理”可以通过渐变、不同比例组合的图案和噪声的正确混合来创建。然而，为特定的“观感”找到正确的渐变、图案、比例和噪点并非易事。 “纹理设计师”的工作是为特定情况找到这些方法的正确组合。下次您观看包含计算机图形图像 (CGI) 的电影时，请特别注意尾随字幕中的“视觉效果艺术家”。设计程序纹理贴图需要具有技术和艺术才能的特殊人员。

本课介绍了一些工具和资源，用于进一步研究程序纹理贴图。如果该主题“引起了您的兴趣”，请调查以下资源。否则，您可以跳过本课并在下一课中继续进行纹理映射转换。

### 着色器商店

Toby Schachman 创建了一个非常酷的工具，称为 Shadershop。它允许您以有趣的方式组合函数，并以视觉和方程格式查看结果。可以在 http://tobyschachman.com/Shadershop/ 找到 Shadershop 的描述和视频教程。实际工具是基于网络的，可以在 http://www.cdglabs.org/Shadershop/ 使用。

组合功能的方法有很多种，Shadershop 将帮助您更好地理解各种可能性。例如：

- 添加函数，f1(x) + f2(x)
- 乘法函数，f1(x) * f2(x)
- 组合函数，f1( f2(x) )
- 最小值，最小值（f1（x），f2（x））
- 最大值，最大值（f1（x），f2（x））

当然，f1(x) 和 f2(x) 函数可以是大量可能性中的任何函数，例如 sin()、floor()、abs() 等。

### 有用的功能

说到组合函数来创建有趣的模式，一些研究人员已经创建了用于生成模式（和其他东西）的基本函数列表。检查其中一些：

- 戈兰莱文：
    - 多项式：http://www.flong.com/texts/code/shapers_poly/
    - 指数：http://www.flong.com/texts/code/shapers_exp
    - 圆形和椭圆形：http://www.flong.com/texts/code/shapers_circ
    - 贝塞尔曲线和参数：http://www.flong.com/texts/code/shapers_bez
- 伊尼戈奎莱兹：http://www.iquilezles.org/www/articles/functions/functions.htm
- Jari Komppa：http://sol.gfxile.net/interpolation/index.html

### 图形玩具

另一个用于复杂函数的不错的可视化工具是 Inigo Quilez 的“Graph Toy”，位于 http://www.iquilezles.org/apps/graphtoy/。请注意，您可以在 6 个函数编辑框中的每一个中输入任何复杂的方程，并将它们相互叠加。

### 着色器之书

Patricio Gonzalez Vivo 创建了一本出色的着色器交互式教科书，名为 The Book of Shaders。您将花费大量时间来阅读整本书，但它的内容非常丰富。

### 总结

如果您有兴趣追求更高级的计算机图形学主题，那么研究过程纹理映射和着色器编程是一个很好的起点。您可以创建一些非常惊人的视觉效果！