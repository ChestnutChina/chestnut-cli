## 渲染简介

### 提纲

你已经用Blender创建了模型数据，你已经准备好用WebGL在场景中渲染你的模型。现在，真正的乐趣开始了

在我们开始之前，让我们讨论一下WebGL的性质。WebGL是GPU（图形处理单元）的一个API（应用程序员接口）。GPU是一种硬件设备，为渲染实时3D图形而优化。你将编写着色器程序，这些程序被编译到硬件中并以闪电般的速度运行。WebGL API不是为程序员而优化的；它是为快速硬件渲染而优化的。WebGL命令实际上是在硬件中 "翻转开关 "以连接电路。不要指望高级命令。WebGL API是一套非常低级的命令，用于控制硬件级功能。

正如我们已经讨论过的，有一些预处理步骤只发生一次，以设置WebGL和你的场景。然后是将模型渲染到场景中的步骤。这些步骤在你每次重新绘制场景时都会重复。

### 预处理：WebGL 设置

在一个较高的抽象水平上，预处理的步骤是：

1. 获取你要渲染的HTML画布元素。
2. 获取该画布元素的WebGL上下文，它通常被称为gl。
3. 为gl上下文设置所需的状态。
4. 编译并链接你的顶点着色器和片段着色器程序到一个渲染程序。(可以创建一个以上的渲染程序）。
5. 在你的渲染程序中获得对变量的引用，这样你就可以在渲染时设置它们的值。
6. 对于你场景中的每个模型：
    1. 将你的OBJ模型数据转换成适当的数组，以便进行渲染。
    2. 在GPU的内存中创建一个缓冲对象。
    3. 将你的模型数据复制到缓冲区对象中。

我们将在几个JavaScript类中捕捉这些步骤的细节，因为：
- 一个JavaScript类将功能封装在一个地方，可以轻松地执行一次。
- 一个JavaScript类可以将功能细节隐藏在几个函数调用的后面。
- 一个JavaScript类允许功能被轻易地重复使用。

### 着色器程序简介

在我们讨论渲染模型的具体步骤之前，我们需要讨论着色器程序背后的一些基本想法。在图形管道中，有两个阶段是你必须自己编程的。你用GLSL（GL着色器语言）编写程序，将其编译成机器指令，将其链接成一个 "程序"，将程序下载到GPU，然后在渲染场景时激活该程序。渲染的结果是一个像素的二维阵列。每个像素都有许多数据被存储和处理。与单个像素相关的数据组被称为片段。当你看到 "片段 "这个词时，你会想到 "像素和它相关的渲染数据"。

请认识到，一个三角形被渲染到图像上可能需要100个甚至1000个像素来渲染，因为观看者离三角形非常近。如果观看者离三角形很远，三角形可能只需要一到两个像素就能渲染出来。为渲染一个单独的三角形而创建的片段数量将根据观看者和三角形之间的距离不断变化。

你的两个着色器程序的功能范围非常有限：
- 顶点着色器将模型的每个顶点转换到其在当前场景中的正确位置。
- 片段着色器为组成点、线或三角形的每个片段（像素）分配颜色。

这听起来很简单，而且可以非常简单。你可以创建着色器程序，用一行代码就能完成它们所需的功能。或者你可以使用非常复杂的算法进行惊人的操作。着色器程序的美妙之处在于，你可以完全控制图形过程。

请注意，顶点着色器和片段着色器共享变量。顶点着色器通常会设置一些值供片段着色器使用。当我们详细研究着色器程序时，这一点将变得更加清晰。

着色器程序使用三种类型的数据。对整个模型来说是相同的数据，对每个顶点来说是变化的数据，对点、线、或三角形内部的每个片段来说是变化的数据。这三种类型的数据是：

|||
|--|--|
| uniform | 一个数据值，在图形管道的执行中是相同的。例如，如果你要给每个被处理的顶点分配相同的颜色，那么这个颜色可以是一个统一变量。当你想到一个统一的值时，就会想到一个固定的、不变化的、不变的值。 |
| attribute | 一个数据值，在图形管道处理顶点时，每个顶点都会发生变化。一个典型的属性值是一个顶点的（x,y,z）位置。当你想到一个属性值时，总是把顶点和这个术语联系起来，如顶点属性。 |
| varying | 一个数据值，在图形管道执行的过程中，每个片段都会发生变化。变化的变量允许组成一个点、线或三角形的每个像素被分配不同的颜色。 |

### 渲染步骤

每次你渲染你的场景时，你的JavaScript程序必须执行以下步骤：

1. 清理保存你的渲染到背景颜色的颜色缓冲区。
2. 如果你正在进行隐藏表面的清除，请清除深度缓冲区。
3. 选择你的着色器程序。
4. 对于你场景中的每个模型：
    1. 将你的统一变量的值传递给你的`着色器`程序。
    2. 将每个属性变量附加到一个适当的`缓冲区`对象。
    3. 调用WebGL的gl.drawArrays()函数。

下图将帮助您可视化这些步骤：
<center>
<img src='/5/rendering_steps.png' />
<p>渲染一个模型的步骤</p>
</center>

在这些渲染步骤中，有很多事情要做。下面的课程将介绍所有的细节。

### 渲染速度注意事项

所有的渲染都是在一个背景下完成的。你作为一个人所做的任何事情也可以这么说。你可能在图书馆学习，或在看足球比赛时学习。你所处的环境会影响你的学习! 人们一直在有意识或无意识地转换情境。如果你正在深思熟虑，你可能要花几秒钟才能意识到有人在和你说话。所有的语境转换都需要时间。如果你不断地进行语境转换，你将不会有很好的成效。

所有现代的计算机都在运行的进程之间不断地进行上下文切换。GPU也不例外。你总是在一个上下文中进行渲染。你切换上下文的次数越少，你的渲染就越快。因此，当你设置一个渲染进程时，你的主要目标之一应该是尽量减少上下文切换的次数。以下所有的动作都会导致GPU进行上下文切换。

- 选择一个着色器程序。
- 在着色器程序中设置一个统一变量的值。
- 将一个属性变量附加到一个缓冲区对象。
- 任何改变gl JavaScript对象状态的操作。

你的JavaScript程序和GPU之间的任何通信都会减慢渲染速度。为了获得最大的渲染速度，你需要尽量减少对WebGL API的JavaScript函数调用。例如，你可以为每个模型设置一个单独的缓冲对象，或者你可以在一个缓冲对象中存储几个模型。可能的配置的数量几乎是无穷无尽的。你必须不断地在快速渲染的愿望、你用于图形数据的内存量和你的代码的复杂性之间进行权衡。

让我们再说一遍，你的JavaScript程序和GPU之间的任何通信都会减慢渲染速度。在理想的情况下，你只需将所有的模型数据复制到GPU上一次。然后，当你渲染时，GPU已经有了它需要的大部分数据。如果模型数据必须在每次渲染前由你的JavaScript代码进行操作，那么将数据从RAM转移到GPU的内存将是一个主要的时间限制。在这种情况下，你会想把你的模型数据分成不同的数据类型，只传输正在变化的数据。例如，如果你的模型数据包括顶点、颜色和法向量，而只有你的颜色数据被你的JavaScript程序操作，那么你将把顶点和法向量数据放入一个GPU缓冲对象，而你的颜色数据放入一个单独的缓冲对象。当你渲染模型时，你的JavaScript代码将改变颜色值，将它们复制到GPU缓冲区对象中，然后调用gl.drawArrays()。尽量减少每次渲染时复制到GPU上的数据量将加快渲染速度。

一般来说，你应该首先让你的图形正确渲染，然后优化它以加快渲染。你会对GPU的速度感到惊讶，在很多情况下不需要优化。在这些教程中，我们将编写JavaScript代码并组织模型数据，从而强调清晰性--而不是渲染优化。

### 代码和数据的依赖性

WebGL 程序使用三个主要组件渲染模型：

- 一个着色器程序，操纵顶点位置并为像素分配颜色。着色器程序在GPU上执行。
- 顶点对象缓冲区，在GPU上存储模型顶点属性数据。
- 设置和启动渲染的JavaScript代码。JavaScript代码是由CPU执行的。

这三个组件是相互交织在一起的，以至于一个组件的简单改变通常需要所有组件的改变。这是令人遗憾的，因为它使增量的代码开发变得非常困难。在任何情况下，如果你改变了着色器程序、缓冲器对象或JavaScript渲染函数的任何部分，请确保其他组件与你的改变兼容。