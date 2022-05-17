## 事件

网页的操作是由于事件而发生的。这些事件可以是浏览器采取的一些行动，如下载文件，也可以是用户采取的一些行动，如点击按钮。我们需要讨论五个问题。

1. 浏览器会跟踪哪些事件？
2. 如何将事件与特定的DOM元素联系起来？
3. 事件中包含哪些信息？
4. 如何编写正确的事件处理程序？
5. 事件的层次结构。

### 浏览器事件

有太多的事件可以在这里详细讨论。请参阅[HTML DOM事件](https://www.w3schools.com/jsref/dom_obj_event.asp)的完整列表。下面是我们将在WebGL程序中使用的典型事件，以操纵画布元素中的图形。

| 事件  | 使用说明 |
| ----------- | --------- |
| onmousedown | 用户在一个元素上按下鼠标按钮 |
| onmouseup | 用户在一个元素上释放鼠标按钮 |
| onmousemove | 用户在一个元素上移动鼠标的位置 |
| onclick | 用户点击了一个元素 |
| onkeydown | 用户正在按一个键 |
| onkeypress | 用户按下并释放了一个键 |
| onkeyup | 用户释放了一个键 |
| ondrag | 用户正在拖动一个元素 |
| onwheel | 用户在元素上移动鼠标滚轮 |

注意，事件的一个关键方面是鼠标在一个元素上。用户鼠标的位置决定了一个事件是否 "发生"。例如，鼠标光标可能在一个网页上移动，但只有当它在一个特定的元素上时，才会产生onmousemove事件。

### 将事件映射到 DOM 元素

有两种方法可以将一个事件与特定的DOM元素联系起来。

1. 在元素的HTML描述中添加一个事件属性
    - 一般的例子。\<element onclick="myScript">。
    - 具体的例子。\<div onclick="var a = 5; var b = 7; callAbc(a,b);" >
2. 使用 JavaScript 向元素添加事件处理程序
    - JavaScript通用例子：object.addEventListener("click", myScript)。
    - JavaScript具体例子：my_button.addEventListener("click", button_click )。
    - jQuery通用例子：$(selector).event(callback_function)
    - jQuery的具体例子：$('#' + control_id).click( button_click )。

由于一些原因，不鼓励采用方法1。将HTML内容与JavaScript功能混合在一起被认为是不好的设计。而且如果你使用一个元素属性，你只能为该元素关联一个事件处理程序。方法2是首选方式。这不仅将内容与功能分开，而且如果你需要，你可以为一个元素分配多个事件处理程序。使用jQuery函数来分配事件处理程序可以解决浏览器不一致的问题，所以我们将使用这些函数。事件函数的完整列表见jQuery Events。请注意，为一个事件指定一个回调函数应该只做一次。

你可以使用jQuery的unbind方法删除一个事件处理程序。
- jQuery generic example: $(selector).unbind(event, callback)
- jQuery specific example: $('#' + control_id).unbind("click", self.html_control_event)

### 事件对象

事件处理程序是一个接收一个对象作为参数的函数--一个事件对象。不同类型的事件创建不同类型的事件对象。有关[HTML事件对象](https://www.w3schools.com/jsref/dom_obj_event.asp)的完整列表和描述，请参见HTML DOM事件。一个事件处理函数在它的事件发生时被调用。事件对象中的数据在不同的浏览器之间是不同的，所以最好使用jQuery的事件对象，它在所有的浏览器中提供一致的数据。请参阅[事件对象](https://api.jquery.com/category/events/event-object/)，了解jQuery事件对象中包含的事件数据的完整列表。

下面是发送至jQuery事件处理程序的鼠标事件的部分数据列表。

| 属性  | 使用说明 |
| ----------- | --------- |
| .target | 启动该事件的DOM元素 |
| .pageX | 相对于文档的左边缘的鼠标位置 |
| .pageY | 相对于文档顶部边缘的鼠标位置 |
| .clientX | 相对于元素的左边缘的鼠标位置 |
| .clientY | 相对于元素的顶部边缘的鼠标位置 |
| .which | 被按下的具体按键或按钮 |

### 一个事件处理程序的例子

下面是一个canvas元素内onmousemove事件的事件处理程序的例子。它计算了从鼠标先前位置的偏移量，并使用这些偏移量来修改场景的旋转角度。

```js
/**
 * Process a mouse drag event.
 * @param event A jQuery event object
 */
Function mouse_dragged (event) {
  var delta_x, delta_y;

  if (start_of_mouse_drag) {
    delta_x = event.clientX - start_of_mouse_drag.clientX;
    delta_y = -(event.clientY - start_of_mouse_drag.clientY);

    scene.angle_x += delta_y;
    scene.angle_y -= delta_x;
    scene.render();

    start_of_mouse_drag = event;
    event.preventDefault();
  }
};
```

### 事件层级

考虑当用户的鼠标在网页上移动时会发生什么。假设鼠标刚刚移动到一个按钮上，该按钮位于 \<div> 元素内，而 \<div> 元素又位于 \<body> 元素内。所以当它移动时，鼠标下面有几个 HTML 元素。事件“触发”三个元素中的哪一个？这实际上是一个复杂的问题，取决于哪些元素注册了事件处理程序。假设只有按钮注册了鼠标移动事件处理程序。当鼠标移到按钮上时，它的事件处理程序将被调用。但是，某些 HTML 元素具有内置在浏览器中的默认事件处理程序。例如，移动鼠标可以滚动整个页面。网页是元素的层次结构，事件在触发时沿着该层次结构传播。所以在我们的假设示例中，鼠标移动事件将被传递给默认的 \<div> 事件处理程序进行处理。然后该事件将被传递给默认的 \<body> 事件处理程序以在那里进行处理。将事件向上传递到元素层次结构是事件的默认行为。如果您希望一个事件由单个事件处理程序处理，那么您必须通过在事件对象上调用 preventDefault() 来防止它被传递到其父元素。上面的代码中显示了一个示例。

### 实验

在下面的WebGL演示中，你可以编辑事件处理程序。实验!

点击查看[交互式例子](http://learnwebgl.brown37.net/browser_environment/events.html#experimentation)

[在新的标签或窗口中打开这个webgl程序](http://learnwebgl.brown37.net/browser_environment/event_experiments/event_experiments.html)