## GLSL 控制结构

GLSL 基于 C 编程语言，其控制结构与 C 非常相似。

### 整体执行

着色器程序由一个或多个函数组成。执行总是从不接收参数也不返回值的 main 函数开始：
```js
void main(void) {
  // statement(s)
}
```
您可以创建的函数数量没有限制。必须先定义函数，然后才能调用它们。函数头定义了函数的名称、参数列表和返回值的数据类型。例如：
```js
vec3 example(float x, bool beta) {
  // statement(s)
}
```
定义了一个名为“example”的函数，它在调用时接收两个值，一个浮点值和一个布尔值。它必须返回一个包含 3 个浮点值的向量。

默认情况下，所有参数都是“按值传递”。您可以使用这些“参数限定符”更改此行为：
- in：“按值传递”；如果函数中参数的值发生变化，则调用语句中的实际参数不变。
- out：“通过引用”；调用函数时参数未初始化；参数值的任何更改都会更改调用语句中的实际参数。
- inout：参数的值由调用语句初始化，函数所做的任何更改都会更改调用语句的实际参数。

以下示例演示了这些参数限定符：
```js
vec3 example(in float x, in bool beta, inout int gamma, out int theta) {
  // statement(s)
}

// Call example: 3.5 is copied into x,
//               true is copied into beta,
//               delta is copied into gamma, and
//               chi is NOT copied into theta.
vec3 phi = example(3.5, true, delta, chi);
// After the call, the value of delta might be changed,
//                 the value of chi has changed,
//                 phi contains the returned value
```

### 选择

if 语句允许基于布尔测试执行或跳过语句。它们可以嵌套，如以下示例所示：
```js
if (x <= 5) {
  // statement(s)
}

if (x <= 5) {
  // statement(s)
} else {
  // statement(s)
}

if (j == 1) {
    // statement(s)
} else {
    if (j == 2) {
        // statement(s)
    } else {
        if (j == 3) {
            // statement(s)
        } else {
            // statement(s)
        }
    }
}
```

不鼓励选择语句，因为“它们会降低在 3D 图形处理器上并行执行操作的能力”([1](https://developer.apple.com/library/ios/documentation/3DDrawing/Conceptual/OpenGLES_ProgrammingGuide/BestPracticesforShaders/BestPracticesforShaders.html)) 同样来自 ([1](https://developer.apple.com/library/ios/documentation/3DDrawing/Conceptual/OpenGLES_ProgrammingGuide/BestPracticesforShaders/BestPracticesforShaders.html))，

```js
If your shaders must use branches, follow these recommendations:

* Best performance: Branch on a constant known when the shader is compiled.
* Acceptable: Branch on a uniform variable.
* Potentially slow: Branch on a value computed inside the shader.
```

### 遍历

可以通过以下三种方式之一来重复一组语句。这些在以下示例中得到证明。如果在循环中声明了循环控制变量，则它的范围仅限于循环。循环可以嵌套。

```js
for (int j = 0; j < 5; j += 1)
  // statement(s)
}

int j = 0;
while (j < 5) {
  // statement(s)
  j += 1;
}

int j = 0;
do {
  // statement(s)
  j += 1;
} while (j < 5);
```

while 和 do-while 循环是可选的。您保证拥有的唯一循环结构是 for 循环。此外，循环结构有很多限制。一般来说，“控制流仅限于可以在编译时轻松确定最大迭代次数的循环。”

循环限制：

- 只能有一个 int 或 float 类型的循环控制变量。
- for 语句的初始化必须采用以下形式：
    ```js
    type-specifier identifier = constant-expression
    ```
    因此，循环控制变量不能是全局变量。
- for 语句的循环终止测试必须具有以下形式：
    ```js
    loop_control_variable   relational_operator   constant_expression
    ```
    其中，relational_operator 是以下之一：>、>=、<、<=、== 或 !=

- for 语句中循环控制变量的“更新”必须具有以下形式：
    ```js
    loop_control_variable++
    loop_control_variable--
    loop_control_variable += constant_expression
    loop_control_variable -= constant_expression
    ```

- 循环控制变量不能在循环体中更改。

### 修改循环内的控件

在循环中，您可以使用以下语句修改控制流：

- break：立即终止循环并跳转到循环后的第一条语句。
- continue：跳过循环中的所有剩余语句并跳转到循环的下一次迭代。
- return：立即退出当前函数，从而终止活动循环。