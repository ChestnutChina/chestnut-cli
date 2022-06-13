## GLSL 编译和链接

### 编译

GLSL 程序是使用 JavaScript 程序的 WebGL API 中的功能编译的。如果在编译过程中发生错误，它们可以被捕获和显示。类似于下面的函数是任何 WebGL 程序的一部分。下面的函数是文件Learn_webgl_02.js中定义的Learn_webgl类的一个方法。

```js
/** ---------------------------------------------------------------------
 * Create and compile an individual shader.
 * @param gl WebGLRenderingContext The WebGL context.
 * @param type Number The type of shader, either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
 * @param source String The code/text of the shader
 * @returns WebGLShader A WebGL shader program object.
 */
self.createAndCompileShader = function (gl, type, source) {
  var typeName;
  switch (type) {
    case gl.VERTEX_SHADER:
      typeName = "Vertex Shader";
      break;
    case gl.FRAGMENT_SHADER:
      typeName = "Fragment Shader";
      break;
    default:
      out.displayError("Invalid type of shader in createAndCompileShader()");
      return null;
  }

  // Create shader object
  var shader = gl.createShader(type);
  if (!shader) {
    out.displayError("Fatal error: gl could not create a shader object.");
    return null;
  }

  // Put the source code into the gl shader object
  gl.shaderSource(shader, source);

  // Compile the shader code
  gl.compileShader(shader);

  // Check for any compiler errors
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    // There are errors, so display them
    var errors = gl.getShaderInfoLog(shader);
    out.displayError('Failed to compile ' + typeName + ' with these errors:' + errors);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};
```

关于代码的一些注释：

- type 参数是一个 WebGL ENUM（一个数字常量）。第 9-20 行中的 switch 语句严格用于创建更有意义的错误消息。它不提供任何功能。
- out 对象用于向网页显示消息。您可以用 console.log 替换 out 并在 JavaScript 控制台窗口中查找错误。
- 通常 gl.createShader() 函数失败的唯一原因是缺少 GPU 内存或丢失了 WebGL 上下文。你可以通过调用 gl.getError() 得到确切的错误。
- 编译器错误消息通常非常有用。确保您注意到错误的行号和列号，并且您非常仔细地阅读了错误消息。
- 不要用无效或未使用的对象“污染”GPU 内存，这一点很重要。 GPU 不进行自动“垃圾收集”。请注意，如果发生错误，着色器将被显式删除。

### 链接

将顶点着色器和片段着色器链接到单个程序中可确保两个程序引用相同的全局变量。类似于下面的函数是任何 WebGL 程序的一部分。下面的函数是文件Learn_webgl_02.js中定义的Learn_webgl类的一个方法。

```js
/** ---------------------------------------------------------------------
 * Given two shader programs, create a complete rendering program.
 * @param gl WebGLRenderingContext The WebGL context.
 * @param vertexShaderCode String Code for a vertex shader.
 * @param fragmentShaderCode String Code for a fragment shader.
 * @returns WebGLProgram A WebGL shader program object.
 */
//
self.createProgram = function (gl, vertexShaderCode, fragmentShaderCode) {
  // Create the 2 required shaders
  var vertexShader = self.createAndCompileShader(gl, gl.VERTEX_SHADER, vertexShaderCode);
  var fragmentShader = self.createAndCompileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderCode);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a WebGLProgram object
  var program = gl.createProgram();
  if (!program) {
    out.displayError('Fatal error: Failed to create a program object');
    return null;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the WebGLProgram object
  gl.linkProgram(program);

  // Check for success
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    // There were errors, so get the errors and display them.
    var error = gl.getProgramInfoLog(program);
    out.displayError('Fatal error: Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }

  // Remember the shaders. This allows for them to be cleanly deleted.
  program.vShader = vertexShader;
  program.fShader = fragmentShader;

  return program;
};
```

### 自动着色器程序

由于着色器程序在编译之前只是简单的文本字符串，因此可以“即时”创建着色器程序。也就是说，您可以拥有一组定义各种着色器命令的字符串，然后以复杂的方式组合这些字符串，为特定的渲染情况创建特定的着色器。这样的想法远远超出了这些基本教程，但如果您追求更高级的计算机图形学，您可能会发现它非常强大。