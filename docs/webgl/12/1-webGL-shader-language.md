## WebGL 着色器语言

WebGL 需要一个着色器程序用于图形管道的顶点和片段操作部分。着色器程序是用 GLSL（图形库着色器语言）编写的。本节提供了对 GLSL 的一般介绍。

GLSL 语言经历了许多版本。您可以在[ GLSL 维基百科页面](https://en.wikipedia.org/wiki/OpenGL_Shading_Language)上查看版本列表。 WebGL 1.0 仅支持 GLSL 1.0.17。 （请记住，WebGL 基于 OpenGL ES 2.0，它是为低功耗和有限处理的计算设备而设计的。）如果您在网上搜索 GLSL 信息和示例，通常会发现无法在其中运行的 GLSL 程序WebGL 程序因为版本问题。您必须注意 GLSL 版本。

请不要将允许访问 GPU 图形管道的 WebGL JavaScript API 与用 GLSL 编写的着色器程序混淆。它们都与在浏览器中生成 3D 图形有关，但它们的用途和语法却大不相同。

### GLSL 1.0.17 概述

[GLSL 1.0](http://learnwebgl.brown37.net/12_shader_language/documents/_GLSL_ES_Specification_1.0.17.pdf) 规范有 113 页。要成为 GLSL 语言的专家，您应该学习整个规范。但是，以下课程应该提供您需要了解的有关 GLSL 的大部分内容。课程包括：

- ![数据类型和变量](http://learnwebgl.brown37.net/12_shader_language/glsl_data_types.html)
- ![控制结构](http://learnwebgl.brown37.net/12_shader_language/glsl_control_structures.html)
- ![运算符（数学和逻辑）](http://learnwebgl.brown37.net/12_shader_language/glsl_mathematical_operations.html)
- ![内置函数和变量](http://learnwebgl.brown37.net/12_shader_language/glsl_builtin_functions.html)
- ![编译和链接](http://learnwebgl.brown37.net/12_shader_language/glsl_compiling_and_linking.html)