## 屏幕更新和动画

最后两节课向您展示了如何随时间改变对象的位置和方向。本课将解释如何渲染屏幕，以便您使用准确的帧速率进行运动计算。

### 双缓冲

WebGL 自动实现双缓冲，它总是将您的图形渲染到屏幕外的帧缓冲区中。屏幕上可见的是“第二”帧缓冲区——因此称为“双”缓冲。渲染是在屏幕外完成的，因此用户永远不会看到单个像素的变化。在屏幕外帧缓冲区中的所有像素都已分配颜色并且屏幕外缓冲区已复制到屏幕的帧缓冲区后，用户始终会看到完成的渲染。双缓冲是标准做法，这就是 WebGL 自动实现它的原因。

OpenGL
派生 WebGL 的 OpenGL 不会自动执行双缓冲。在 OpenGL 中，程序员必须使用对 OpenGL API 的调用来启用和管理双缓冲。

### 更新屏幕

您的计算机显示器显示每秒刷新多次的光栅图像。它的[刷新率](https://en.wikipedia.org/wiki/Refresh_rate)通常为每秒 60 次，但许多较新的显示器每秒更新 120 次。

当 WebGL 识别到在其离屏帧缓冲区中完成了新的渲染时，它会将离屏缓冲区的内容复制到屏幕的可见帧缓冲区。它仅在视频内存不忙于屏幕刷新时执行此复制。因此，如果一个屏幕每秒更新 60 次，那么在更新可见缓冲区时，屏幕刷新之间有 60 个可能的时间跨度，假设您的 WebGL 程序可以在不到 1/60 秒的时间内生成一个新图像。如果您的渲染过程花费的时间超过 1/60 秒，那么您的程序将只能每隔一个刷新周期更新一次屏幕，这将为您提供每秒 30 帧的速度。如果您的渲染处理时间超过 2/60 秒，那么您的程序将只能在每 3 个刷新周期更新一次屏幕。希望你看到一个模式。 WebGL 程序通常设计为以特定帧速率进行动画处理，并且该帧速率需要是显示器刷新率的倍数。对于 60 Hz 屏幕，可能的帧速率为 60、30、15、20、10、6、5、4、3、2 和 1。

### requestAnimationFrame 函数

您可以使用 JavaScript 计时器事件构建 WebGL 动画，但计时器事件不是为动画设计的。例如，如果动画正在浏览器选项卡中运行，并且该选项卡被另一个选项卡或另一个应用程序窗口覆盖，该怎么办。 JavaScript 计时器事件将继续触发并为无法看到的渲染执行大量计算！所以 JavaScript 引入了一个专门用于动画的函数，叫做 requestAnimationFrame。此函数将请求在下一次刷新绘制过程尝试更新屏幕帧缓冲区之前调用指定的回调函数，但需要注意的是，如果 WebGL 窗口不可见，则不会执行任何操作。

典型的动画功能执行以下任务：

- 计算自上一帧渲染以来经过的时间量。
- 如果是时候渲染一个新帧:
  - 更改适当的场景变量
  - 渲染场景
- 调用 requestAnimationFrame 以在将来继续渲染。

下面显示了一个示例动画功能。

```js
//------------------------------------------------------------------------------
self.animate = function () {

  var now, elapsed_time;

  if (scene.animate_active) {

    // How much time has elapsed since the last frame rendering?
    now = Date.now();
    elapsed_time = now - previous_time;

    if (elapsed_time >= frame_rate) {
      // Change the scene.
      scene.angle_x -= 0.5;
      scene.angle_y += 1;

      // Render the scene.
      scene.render();

      // Remember when this scene was rendered.
      previous_time = now;
    }

    requestAnimationFrame(self.animate);
  }
};
```

请注意有关此代码的以下内容：

- requestAnimationFrame 将回调设置为它所在的函数。
- previous_time 变量在此函数外部声明，因此它可以从一个函数调用到下一个函数调用保留其值。
- 必须有某种机制来停止动画。此代码使用场景对象中名为 animate_active 的值。通过将此变量设置为 false，外部进程可以停止动画。
- 准确的计时要求您跟踪从一帧渲染开始到下一帧开始的时间。请注意 Date.now() 在任何渲染之间调用一次，并且值保存在局部变量中。该局部变量用于在渲染完成后更新 previous_time 值。不要再次调用 Date.now() 。如果你这样做了，你将在不考虑渲染时间的情况下计算帧之间的时间。
- 变量 frame_rate 设置为为每个帧分配的毫秒数。一个典型的分配是： var frame_rate = 16; // 16 毫秒 = 1/60 秒