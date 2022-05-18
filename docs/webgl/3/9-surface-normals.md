## 表面法线

在上一节中，你学到了如何用反射光来模拟物体表面的外观。用来计算颜色的表面的基本属性是表面法线。我们可以利用表面法线来增强物体的视觉渲染效果。下面将介绍其中的一些 "小技巧"。

### 每个三角形有一个法向量

这是默认行为。一个面的每个像素都有相同的颜色。这被称为 "平面阴影"。(如果没有指定三角形的法线矢量，可以通过取三角形两条边的交积来计算）。

<center>
<img src='/3/one_normal_per_face.png' />
<p>一个法向量</p>
</center>

### 每个顶点有一个法向量

如果你为每个顶点指定一个不同的法线向量，你就可以为每个顶点计算出不同的颜色。然后，整个面部的每个像素的颜色可以从顶点的颜色中插值出来。如果顶点法线向量设置正确，脸部就会有一个弯曲的外观（而不是一个平面的外观）。(这种技术是以其发明者的名字命名的，被称为[Gouraud着色法](https://en.wikipedia.org/wiki/Gouraud_shading)）

如果你将顶点的法线向量内插到整个脸部，然后用内插的法线向量重新计算片段的颜色，你会得到更精确的着色。这种方法需要更长的计算时间，但可以得到更平滑的颜色梯度。这就是所谓的[Phong shading](https://en.wikipedia.org/wiki/Phong_shading)。

这两种技术都被称为 "平滑着色"。

<center>
<img src='/3/one_normal_per_vertex.png' />
<p>每个顶点有一条法线</p>
</center>

### 每个像素有一个法向量

你可以通过为每个像素指定一个独特的法线向量来控制三角形表面上各个像素的颜色。这是通过创建一个图像来实现的，图像中的每个"像素"不是作为一个RGB值，而是作为一个\<dx,dy,dz>法向量。

<center>
<img src='/3/one_normal_per_pixel.png'>
<p>每个像素有一个法向量</p>
</center>

这就是所谓的[凹凸图](https://en.wikipedia.org/wiki/Bump_mapping)。下面是一个使用凹凸贴图的渲染实例。

<center>
<img src='/3/bump_map_example.png'>
<p>凹凸贴图(<a href='http://docs.chaosgroup.com/display/VRAY3MAYA/Displacement+Control' target='_blank'>1</a>)</p>
</center>

### WebGL 实现

程序员可以在他们的着色器程序中实现这些技术中的任何一种。每个面的一个法向量和每个顶点的一个法向量是在顶点着色器中实现的。阴影和凹凸图在片段着色器中实现，因为它们计算单个像素的颜色。