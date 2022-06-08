## 链式转换-总结

上一课展示了一个带有两个连杆机构的机械臂。这演示了如何将矩阵变换链接在一起以创建复杂的运动。渲染转换的创建是明确创建的，以明确如何创建转换。以下是转换和创建它们的代码的摘要：

```html
                 ┌              ┐  Eq1
baseTransform  = │ baseRotation │ 
                 └              ┘ 
```

```html
                    ┌              ┐   ┌                ┐   ┌               ┐  Eq2
forearmTransform  = │ baseRotation │ * | translateToPin | * | rotateForearm | 
                    └              ┘   └                ┘   └               ┘ 
```

```html
                     ┌              ┐   ┌                ┐   ┌               ┐   ┌                       ┐   ┌                ┐ Eq3
upperArmTransform  = │ baseRotation │ * | translateToPin | * | rotateForearm | * | translateToForearmEnd | * | rotateUpperarm |
                     └              ┘   └                ┘   └               ┘   └                       ┘   └                ┘
```


```JavaScript
// For rendering the base
matrix.multiplySeries(transform, projection, view, base_y_rotate);

// For rendering the forearm
matrix.multiplySeries(transform, projection, view, base_y_rotate,
                      forearm_translate, forearm_rotate);

// For rendering the upper arm
matrix.multiplySeries(transform, projection, view, base_y_rotate,
                      forearm_translate, forearm_rotate,
                      upperarm_translate, upperarm_rotate);
```

### 重用转换

矩阵乘法是一项昂贵的操作。对于 4×4 矩阵，乘法需要 64 次乘法和 48 次加法。我们希望尽可能避免重复的矩阵乘法。对于机械臂来说，不需要一遍又一遍地重复相同的矩阵乘法。我们可以重用之前的变换并简单地对附加变换进行后乘。代码中每个转换的创建可以这样完成：
```JavaScript
// For rendering the base
matrix.multiplySeries(transform, projection, view, base_y_rotate);

// For rendering the forearm
matrix.multiplySeries(transform, transform, forearm_translate, forearm_rotate);

// For rendering the upper arm
matrix.multiplySeries(transform, transform, upperarm_translate, upperarm_rotate);
```

请注意，在第二个和第三个函数调用中，第二个参数是之前计算的变换值。以下演示代码包含这些简化的计算。

重用变换计算对于复杂的渲染很重要，但在完全清楚如何构建复杂的变换链之前，不应折叠变换计算。首先，让 WebGL 程序正常工作。如果渲染缓慢是一个问题，您可以随时进行效率优化。

点击查看[交互式例子](http://learnwebgl.brown37.net/transformations2/transformations_example4.html#reusing-transformations)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/transformations2/simple_transform_example4/simple_transform_example4.html)