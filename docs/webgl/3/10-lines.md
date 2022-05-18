## 线条

WebGL支持线条的渲染。如果你想为你的模型画一个线框渲染，或者用边框或高光勾勒出一个脸部轮廓，这很有用。

在WebGL中，您总是使用一个顶点阵列来定义一条或多条线。如下图所示，有三种不同的方式可以使用顶点来形成线条。这些选项是：
- LINES - 每条线有两个顶点。如果一条线需要一个顶点，它必须在顶点阵列中重复。定义n条线需要2n个顶点。
- LINE_STRIP - 在最初的两个顶点之后，每增加一个顶点就多定义一条线。定义n条线需要（n+1）个顶点。
- LINE_LOOP - 与LINE_STRIP相同，增加了一条连接第一个和最后一个顶点的线。定义n条线需要n个顶点。

<center>
<img src='/3/line_drawing_modes.png' />
<p>WebGL 线条绘制模式(<a href='https://www.informit.com/articles/article.aspx?p=2111395&seqNum=2' target='_blank'></a>)</p>
</center>