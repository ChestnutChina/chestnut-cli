## 表面颜色

光从物体上反射到相机中，使我们能够 "看到 "物体。我们已经讨论了三种类型的光反射：环境反射、漫反射和镜面反射。事实证明，每种类型的反射与物体表面的互动方式略有不同，使用单一颜色的物体不能捕捉到这些不同类型反射的真实性质。

研究人员采取各种类型的实物，精确测量了环境、漫反射和镜面反射的光反射。他们的一些结果列在下面。你可以为每种类型的光反射存储特定的颜色，而不是为一个表面存储单一的颜色。这提供了更真实的视觉效果。在你的片段着色器计算中，你将为每一种类型的光反射使用适当的颜色。

### 对象颜色示例

| 材质 | 环境色 | 漫反射颜色 | 镜面颜色 | 亮度 |
| -- | -- | -- | -- |  -- |
| Brass |	0.329412 <br /> 0.223529 <br/> 0.027451 <br />1.0 | 0.780392<br/> 0.568627<br/> 0.113725<br/> 1.0 | 0.992157<br/> 0.941176<br/> 0.807843<br/> 1.0 | 27.8974
| Bronze |	0.2125 <br /> 0.1275 <br/> 0.054 <br />1.0 | 0.714<br/> 0.4284<br/> 0.18144<br/> 1.0 | 0.393548<br/> 0.271906<br/> 0.166721<br/> 1.0 | 25.6
| Polished Bronze |	0.25 <br /> 0.148 <br/> 0.06475 <br />1.0 | 0.4<br/> 0.2368<br/> 0.1036<br/> 1.0 | 0.774597<br/> 0.458561<br/> 0.200621<br/> 1.0 | 76.8
| Chrome |	0.25 <br /> 0.25 <br/> 0.25 <br />1.0 | 0.4<br/> 0.4<br/>0.4<br/> 1.0 | 0.774597<br/> 0.774597<br/> 0.774597<br/> 1.0 | 76.8
| Copper |	0.19125 <br /> 0.0735 <br/> 0.0225 <br />1.0 | 0.7038<br/> 0.27048<br/> 0.0828<br/> 1.0 | 0.256777<br/> 0.137622<br/> 0.086014<br/> 1.0 | 12.8
| Polished Copper |	0.2295 <br /> 0.08825 <br/> 0.0275 <br />1.0 | 0.5508<br/> 0.2118<br/> 0.066<br/> 1.0 | 0.580594<br/> 0.223257<br/> 0.0695701<br/> 1.0 | 51.2
| Gold |	0.24725 <br /> 0.1995 <br/> 0.0745 <br />1.0 | 0.75164<br/> 0.60648<br/> 0.22648<br/> 1.0 | 0.628281<br/> 0.555802<br/> 0.366065<br/> 1.0 | 51.2
| Polished Gold |	0.24725 <br /> 0.2245 <br/> 0.0645 <br />1.0 | 0.34615<br/> 0.3143<br/> 0.0903<br/> 1.0 | 0.797357<br/> 0.723991<br/> 0.208006<br/> 1.0 | 83.2
| Pewter | 0.105882 <br /> 0.058824 <br/> 0.113725 <br />1.0 | 0.427451<br/> 0.470588<br/> 0.541176<br/> 1.0 | 0.333333<br/> 0.333333<br/> 0.521569<br/> 1.0 | 9.84615
| Silver | 0.19225 <br /> 0.19225 <br/> 0.19225 <br />1.0 | 0.50754<br/> 0.50754<br/> 0.50754<br/> 1.0 | 0.508273<br/> 0.508273<br/> 0.508273<br/> 1.0 | 51.2
| Polished Silver | 0.23125 <br /> 0.23125 <br/> 0.23125 <br />1.0 | 0.2775<br/> 0.2775<br/> 0.2775<br/> 1.0 | 0.773911<br/> 0.773911<br/> 0.773911<br/> 1.0 | 89.6
| Emerald | 0.0215 <br /> 0.1745 <br/> 0.0215 <br />0.55 | 0.07568<br/> 0.61424<br/> 0.07568<br/> 0.55 | 0.633<br/> 0.727811<br/> 0.633<br/> 0.55 | 76.8
| Jade | 0.135 <br /> 0.2225 <br/> 0.1575 <br />0.95 | 0.54<br/> 0.89<br/> 0.63<br/> 0.95 | 0.316228<br/> 0.316228<br/> 0.316228  <br/> 0.95 | 12.8
| Obsidian | 0.05375 <br /> 0.05 <br/> 0.06625 <br />0.82 | 0.18275<br/> 0.17<br/> 0.22525<br/> 0.82 | 0.332741<br/> 0.328634<br/> 0.346435  <br/> 0.82 | 38.4
| Pearl | 0.25 <br /> 0.20725 <br/> 0.20725 <br />0.922 | 1.0<br/> 0.829<br/> 0.829<br/> 0.922 | 0.296648<br/> 0.296648<br/> 0.296648 <br/> 0.922 | 11.264
| Ruby | 0.1745 <br /> 0.01175 <br/> 0.01175 <br />0.55 | 0.61424<br/> 0.04136<br/> 0.04136<br/> 0.55 | 0.727811<br/> 0.626959<br/> 0.626959 <br/> 0.55 | 76.8
| Turquoise | 0.1 <br /> 0.18725 <br/> 0.1745 <br />0.8 | 0.396<br/> 0.74151<br/> 0.69102<br/> 0.8 | 0.297254<br/> 0.30829<br/> 0.306678 <br/> 0.8 | 12.8
| Black Plastic | 0.0 <br /> 0.0 <br/> 0.0 <br />1.0 | 0.01<br/> 0.01<br/> 0.01<br/> 1.0 | 0.50<br/> 0.50<br/> 0.50 <br/>1.0 | 32
| Black Rubber | 0.02 <br /> 0.02 <br/> 0.02 <br />1.0 | 0.01<br/> 0.01<br/> 0.01<br/> 1.0 | 0.40<br/> 0.40<br/> 0.40 <br/>1.0 | 10

### 总结

如果你知道每种反射光的具体颜色值，就可以进行更真实的光反射计算。然而，这种想法也有缺点：

- 这只适用于具有均匀的、"纯色 "表面的物体。请注意，上面的例子大多是宝石或贵金属，它们的整个表面都有统一的颜色。大多数现实世界的物体都没有均匀的表面。
- 你必须有特殊的设备来测量特定类型物体的精确颜色值，而大多数人没有机会获得这种特殊设备。
- 为一个模型的每个顶点存储三种独立的颜色需要大量的内存。每种类型的反射光的单独颜色值通常作为整个模型的统一变量来实现。