### GLSL 运算符（数学和逻辑）

GLSL 专为高效的矢量和矩阵处理而设计。因此，几乎所有的运算符都被重载以执行线性代数中定义的标准向量和矩阵运算。在线性代数中未定义运算的情况下，该运算通常是按分量完成的，其中运算是在向量或矩阵的每个单独元素上执行的。

几乎所有数学运算符都适用于 float 和 int 数据类型，但不是在同一个表达式中。 GLSL 不执行任何数据类型的自动转换。因此，请确保表达式中的所有操作数都是相同的数据类型。以下是一些无效混合模式表达式的示例：

```js
float a = 3 * 0.7;            // Error. The 3 is an integer. Make it 3.0
int b = 10.0 * 0.7;           // Error. You can't assign a float to an integer.
b = int(10.0 * 0.7);          // Valid
vec3 c = vec3(1.0, 2.0, 3.0);
ivec3 d = ivec3(1,2,3);
vec3 e = c + d;               // Error. You can't add floats and integers.
```

矢量代数运算要求操作数的大小相同。例如，您可以将两个 vec3 相加，但不能将 vec3 和 vec4 相加。向量运算的结果始终与原始操作数大小相同（使用标量和向量的情况除外。）

GLSL 只支持方阵，所以两个矩阵的大小必须相等才能相乘。每当向量乘以矩阵时，向量就被视为行向量或列向量，以使操作正确者为准。您不必像在普通矩阵代数中那样转置向量。

GLSL 编译器优化您的代码以供执行。因此，不要制作过于复杂的方程式，并认为您正在以某种方式使代码更快。一系列有据可查的方程式优于单个难以理解的方程式。

### GLSL 运算符

下表按优先顺序列出了 GLSL 运算符，并显示了它们可以执行的重载操作类型。这些示例使用以下变量。术语“标量”表示“非向量”或“单值”。
```js
bool  b;  // scalar
int   i;  // scalar
float f;  // scalar
bvec2 bv; // Or bvec3, bvec4 (Boolean vector)
ivec2 iv; // Or ivec3, ivec4 (integer vector)
vec2  v;  // Or vec3, vec4   (floating point vector)
mat2  m;  // Or mat3, mat4   (floating point matrix)
```

点击查看[表格](http://learnwebgl.brown37.net/12_shader_language/glsl_mathematical_operations.html#glsl-operators)

请注意，上表左列中的优先级值不是连续的。这是因为 GLSL 的设计者为未来的版本保留了一些操作符。保留的运算符是：

| # | 运算符 | 描述 | 例子 | 操作类型 |
|-- | -- | -- | -- | -- |
| 4 | % | 模数（保留）| -- | （未实现）|
| 6 | << <br /> >> | 按位移位（保留）<br /> 按位移位（保留） | -- | -- |
| 9 | & | 按位与（保留）| -- | -- |
| 10 | ^ | 按位异或 | -- | -- |
| 11 | \| | 按位包含或 | -- | -- |
