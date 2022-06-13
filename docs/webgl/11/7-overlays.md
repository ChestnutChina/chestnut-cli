## 叠加层

WebGL 3D 图形始终呈现为 HTML 画布元素。画布始终是一个矩形。也就是说，可以渲染画布的任意区域以使渲染呈现非矩形。并且可以以有趣的方式组合 HTML 页面的 2D 元素和 WebGL 3D 渲染。本课演示如何执行以下操作：

- 在网页后面（或背景中）渲染 3D 场景。
- 在网页前渲染 3D 场景。
- 在彼此之上渲染多个画布元素。
- 以全屏模式呈现 HTML 元素（及其子元素）。

### 使用 CSS 属性的覆盖

级联样式表 (CSS) 定义了一个称为 z-index 属性的“堆栈排序”属性。具有 z-index 值的元素按从小到大的顺序排列，并按该顺序呈现。这与我们在第 11.2 课中讨论的“画家算法”相同。因为元素以特定顺序呈现，所以最后呈现的元素将覆盖先前呈现的元素。通过这种方式，您可以在 HTML 元素的后面或前面渲染 3D 图形。

z-index 属性仅影响在彼此之上呈现的元素。因此，z-index 排序仅适用于 position 属性为绝对、相对或固定的元素，其定义如下：

- absolute：元素相对于它的第一个定位（非静态）祖先元素定位。
- relative：元素相对于其正常位置定位。
- fixed：元素相对于浏览器窗口定位。

如果元素的位置属性是 static、initial 或 inherit，定义如下，z-index 属性没有影响。

- static （默认）
- initial：使用其默认值。
- inherit：从其父元素继承此属性。

以下示例是通过设置适当的位置、宽度、高度、顶部、底部、左侧和右侧属性以使元素重叠，然后使用 z-index 属性设置呈现顺序来创建的。背景颜色的 alpha 分量也用于实现透明度。

定位 HTML 元素可能非常棘手。以下示例使用此策略：

- 创建一个 div“容器”来保存重叠的元素。将其位置属性设置为相对，将其高度属性设置为重叠 HTML 元素的总高度。这允许此“容器”之后的元素遵循网页的正常流程（从左到右，从上到下）。
- 创建重叠元素并使其位置属性相对于其父元素是绝对的或相对的。适当地设置每个元素的宽度、高度、顶部、底部、左侧和右侧属性。

请参阅为以下每个 HTML 演示程序定义的 CSS 属性。

### 文字背后的 3D 图形

要在 HTML 元素后面创建 3D 图形，请将画布和 HTML 元素放置在网页上的相同相对位置。然后给画布一个小于 HTML 元素的 z-index 值的 z-index 值。

![您可以试验这个在 HTML 元素“下”呈现的画布。](http://learnwebgl.brown37.net/11_advanced_rendering/overlay_behind/overlay_behind.html)

当您像这个演示一样创建叠加层时，您需要了解以下内容：

- 在之前的所有代码演示中，将鼠标拖动转换为模型旋转的事件回调已分配给包含渲染的画布。由于画布完全被 div 元素覆盖，因此事件永远不会被激活。您需要将操作画布的鼠标事件添加到覆盖层的顶部 HTML 元素。
- 用于清除背景的颜色的 alpha 值可用于将画布与网页背景混合。如果将“清晰颜色”的 alpha 值设置为 0.0，则场景的背景将是网页背景的颜色。这允许您将非矩形场景渲染到网页。
- 使用浏览器的开发工具，仔细检查这个示例程序的 CSS 样式表。样式是使所有这些工作的原因。 （转到“网络选项卡”，重新加载网页，然后打开 [overlay_behind.css](http://learnwebgl.brown37.net/11_advanced_rendering/overlay_behind/overlay_behind.css) 文件。

### 文本前面的 3D 图形

要在 HTML 元素的顶部渲染 3D 图形，您只需更改重叠元素的 z-index 属性，以便画布具有最大的 z 值——从而使其最后渲染。

![您可以试验这个在 HTML 元素上呈现的画布。](http://learnwebgl.brown37.net/11_advanced_rendering/overlay_in_front/overlay_in_front.html)

样式表 [overlay_in_front.css](http://learnwebgl.brown37.net/11_advanced_rendering/overlay_in_front/overlay_in_front.css) 是这个演示的关键部分。

### 多个重叠的画布

鉴于我们刚刚讨论的叠加示例，您可以使用这些技术在较大的画布中渲染一个或多个较小的画布。这对于您想要在“游戏”窗口的角落显示一个小的“世界地图”的游戏布局可能是有利的。

![您可以尝试使用此画布叠加演示程序。](http://learnwebgl.brown37.net/11_advanced_rendering/overlay_canvases/overlay_canvases.html)

样式表 [overlay_canvases.css](http://learnwebgl.brown37.net/11_advanced_rendering/overlay_canvases/overlay_canvases.css) 是这个演示的关键部分。

### 全屏渲染

已经开发了允许以全屏模式呈现 HTML 元素的功能，但尚未标准化。提议的标准可以在 [Fullscreen API](https://fullscreen.spec.whatwg.org/) 中找到。大多数浏览器都实现了全屏功能，但它们使用了提议标准中描述的功能名称的变体。

必须从事件处理程序中调用全屏请求。如果他们在其他任何地方被叫到，他们将被拒绝。这意味着用户必须通过某些用户操作来启动全屏模式。用户始终可以通过按退出 (ESC) 键退出全屏模式。

您通常希望在全屏模式启动和终止时重新定义 HTML 元素的大小。只有一个事件与全屏模式相关联，即 fullscreenchange 事件。您可以建立一个回调函数来进行适当的更改，如下所示：
```js
/** ---------------------------------------------------------------------
 * Set an event handler for any changes to "full screen mode."
 * @param id String The ID of the HTML element that is to fill the screen.
 */
self.setFullScreenChangeCallback = function ( id ) {
  // Add an event callback for changes to full screen mode.
  // When the standard is approved and universally implemented, only the
  // first callback will be needed.
  $( '#' + id ).on( 'fullscreenchange', self.onFullScreenChange )
               .on( 'webkitfullscreenchange', self.onFullScreenChange )
               .on( 'mozfullscreenchange', self.onFullScreenChange )
               .on( 'MSFullscreenChange', self.onFullScreenChange );
};
```

事件处理程序需要识别屏幕处于哪种模式，然后采取适当的措施。这是一个示例事件处理程序：
```js
/** ---------------------------------------------------------------------
 * Processing for a change in the full screen mode. This resets the size
 * of the affected HTML elements and re-renders the scene.
 */
self.onFullScreenChange = function (event) {

  if (document.fullscreenElement ||
      document.webkitIsFullScreen ||
      document.mozFullScreen ||
      document.msFullscreenElement) {
    // We are in full screen mode, so make the elements larger
    self.updateElementSizes( Math.min(screen.width, screen.height) );
  } else {
    // We have gone back to normal mode, so make the elements smaller.
    self.updateElementSizes(400);
  }
  self.render();
};
```

要进入全屏模式，用户事件必须启动操作。这是一个可以在用户事件上调用以启动全屏模式的典型函数：
```js
/** ---------------------------------------------------------------------
 * Initate full screen mode, where the identified HTML element takes up
 * the entire screen.
 * @param event Event object, The event that initiated the request
 * @param id String The ID of the element that will be made full screen.
 */
self.goToFullScreen = function (event, id) {

  // Get the element that will take up the entire screen
  var element = document.getElementById(id);

  // Make sure the element is allowed to go full screen.
  if (!element.fullscreenElement &&
      !element.mozFullScreenElement &&
      !element.webkitFullscreenElement &&
      !element.msFullscreenElement) {

    // Enter full screen mode
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    window.console.log("The element " + id + " can't go into full screen mode.");
  }
};
```

当所有浏览器都标准化为一组命名约定（并且 jQuery 增加了对全屏模式的支持）时，上述示例将变得更加简单和清晰。

这是讨论画布在屏幕上的大小与其关联的 WebGL 帧缓冲区之间关系的好时机。 （这很疯狂，但这就是它的工作原理。）画布元素可以有两种不同的大小：
- HTML 大小，由元素的宽度和高度属性定义，以及
- CSS（级联样式表）大小，由元素的宽度和高度样式属性定义。

这是一个具有两种不同尺寸的示例画布：
```js
<canvas width="100" height="100" style="width:200px; height:200px;"> </canvas>
```

如果您不指定宽度和高度的 CSS 属性，则 HTML 属性决定元素的大小。但是，CSS 属性总是会覆盖 HTML 属性。因此，此画布在屏幕上的大小为 200x200 像素。 WebGL 总是从 HTML 属性创建其帧缓冲区大小。在上面的示例中，屏幕上的画布将是 200x200 像素，但 WebGL 帧缓冲区将是 100x100 像素。当帧缓冲区被复制到屏幕上时，它将被拉伸以填充画布，但图像会变得模糊，因为帧缓冲区中的每个像素都将用于为画布中的 4 个像素着色。如果要更改画布的大小，则应更改 CSS 属性，然后将其值复制到画布的属性中。 CSS 属性称为 clientWidth 和 clientHeight。这是一个示例函数，它更新“包含”元素及其两个覆盖的画布元素的大小：

```js
/** ---------------------------------------------------------------------
 * Reset the size of the affected elements after a fullscreen event.
 * @param size Number The new size for the HTML elements.
 */
self.updateElementSizes = function (size) {

  var new_css_properties = { width: size, height: size };

  // Change the size of the "container" element.
  $('#W4_my_overlay').css( new_css_properties );

  // Change the CSS size of the main canvas window.
  $('#W4_main_canvas').css( new_css_properties );

  // The CSS (readonly) properties of the element have now been changed.
  // Now copy the clientWidth and clientHeight into the canvas's
  // width and height so the frame buffer will be re-sized to the current
  // window resolution.
  var canvas = document.getElementById('W4_main_canvas');
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  // Change both the size of the element and the size of the WebGL frame buffer.
  var small_size = Math.round(size * 0.25);
  var left_offset = Math.round(size * 0.75);
  $('#W4_small_canvas').css( {width: small_size, height: small_size, left: left_offset} );
  canvas = document.getElementById('W4_small_canvas');
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
};
```

![您可以使用此演示程序尝试全屏模式。](http://learnwebgl.brown37.net/11_advanced_rendering/overlay_full_screen/overlay_full_screen.html)