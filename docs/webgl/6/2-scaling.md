## 缩放

缩放从根本上改变了一个模型的大小。但它也可以移动一个模型的位置和翻转模型。在数学上，缩放是一个简单的乘法。

缩放是一种仅适用于模型顶点的精细变换。顶点是三维空间中的一个位置，由其沿三条轴的距离定义--（x、y、z）。让我们用(x', y', z')这个符号来表示一个转换后的顶点位置。统一缩放使用一个单一的比例因子s，来改变顶点的所有3个分量。在方程格式中，缩放是这样进行的:
```js
x' = x * s;
y' = y * s;
z' = z * s;
```
没有比这更简单的事情了!

你也可以对每个轴使用不同的比例系数进行缩放。我们把这3个比例因子称为sx、sy和sz。 这被称为非均匀缩放，就是这样的简单乘法。
```js
x' = x * sx;
y' = y * sy;
z' = z * sz;
```

请注意，按1缩放不会改变一个对象。(任何数值乘以1就是它本身。)顶点通常是作为一个单位进行操作的，所以如果你想沿着一个轴进行缩放而保持其他轴不变，对你想要不变的组件使用1的缩放系数。

鉴于缩放操作被应用于模型的每个顶点，缩放0会使模型中的每个顶点都变成(0,0,0)，模型会退化为原点上的一个点--这通常不是一个理想的结果--除非你想让一个物体消失。

所有的缩放都是 "关于原点 "的。考虑一个简单的数字线。当你把一个数字乘以一个大于1的值时，这个数字就会离原点更远。当你把一个数字乘以一个小于1的值时，这个数字会向原点靠近。无论哪种方式，数值都会改变它相对于原点的位置!

### 特殊案例和效果

请研究以下与缩放有关的情况
1. 缩放以原点为中心的模型，可以缩小或放大模型，但不会改变模型的位置。
    - 一个均匀缩放的例子，对象是以原点为中心的。
  
    点击查看[交互式例子](http://learnwebgl.brown37.net/transformations2/transformations_scale.html#special-cases-and-effects)

    [在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/transformations2/scale_about_origin/scale_about_origin.html)

2. 非均匀缩放使用三个不同的缩放系数，每个轴一个。模型仍然以原点为中心，所以它的位置不会改变。
    - 一个非均匀缩放的例子，对象是以原点为中心的。

    点击查看[交互式例子](http://learnwebgl.brown37.net/transformations2/transformations_scale.html#special-cases-and-effects)

    [在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/transformations2/nonuniform_scaling/nonuniform_scaling.html)

3. 缩放一个远离原点的模型，可以缩小或放大模型，也可以改变模型的位置。运动的方向是由模型所在的象限决定的。请注意，在下一个例子中，8个模型分别向不同的方向移动，但它们都远离或朝向原点移动。这是另一个直观的证明，所有的缩放都是 "围绕原点 "的。大多数模型在创建时都以原点为中心，原因就在于此。
    - 一个不是以原点为中心的缩放模型的例子。

    点击查看[交互式例子](http://learnwebgl.brown37.net/transformations2/transformations_scale.html#special-cases-and-effects)

    [在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/transformations2/scale_away_from_origin/scale_away_from_origin.html)

4. 位于原点的顶点（0,0,0），不受缩放的影响。(零乘以任何比例因子仍然是零。)模型中(0,0,0)的顶点为在场景中定位模型提供了一个方便的参考点。
5. 用负的比例值缩放一个对象，会执行一个镜像操作。
    - 一个使用负比例值镜像模型的例子。

    点击查看[交互式例子](http://learnwebgl.brown37.net/transformations2/transformations_scale.html#special-cases-and-effects)

    [在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/transformations2/scale_mirror/scale_mirror.html)
6. 要否定（或撤消）一个缩放操作，你只需要用缩放系数的倒数来缩放一个模型。例如，如果你将一个模型的缩放系数为3，你可以通过1/3的缩放来恢复原来的模型。

