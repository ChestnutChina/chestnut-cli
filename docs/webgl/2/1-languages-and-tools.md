## 语言和工具介绍

这些教程的目的是帮助你学习3D计算机图形。然而，如果不对HTML和CSS有基本的了解，同时对JavaScript有全面的了解，你就无法真正开始使用WebGL。下一节教程将让你 "加速 "掌握这些初步技能。

### 安装工具

请注意：为了避免USAFA代理和扫描问题，请从**K:\DF\DFCS\CS474**文件夹中获取安装文件。这些文件必须在安装前复制到你的硬盘上。

一个好的集成开发环境（IDE）是开发软件的基本工具。[PyCharm](https://www.jetbrains.com/pycharm/)是这些教程推荐使用的IDE。请立即下载并安装PyCharm的专业版。请确保使用你的usafa.edu电子邮件地址注册该软件，以获得免费的、仅供学术用途的许可证。

为了测试您的程序，您必须在您的计算机上运行一个本地网络服务器。如果您只是在本地打开文件，WebGL程序的许多功能将不会在您的浏览器中执行。程序文件必须由网络服务器加载到您的浏览器中。请现在下载并安装Apache2网络服务器。如果你已经安装了XAMPP（Apache + MariaDB + PHP + Perl），你已经拥有了你所需要的一切。

### 配置 PyCharm

请对PyCharm进行以下配置修改。所有的设置都在 "文件->设置 "对话框中。

- Editor –> General –> Appearance: Enable “Show line numbers”.
- Editor –> Code Style –> CSS: Set “Tab size”, “Indent” and “Continuation indent” all to 2 spaces.
- Editor –> Code Style –> HTML: Set “Tab size”, “Indent” and “Continuation indent” all to 2 spaces.
- Editor –> Code Style –> JavaScript: Set “Tab size”, “Indent” and “Continuation indent” all to 2 spaces.

### 配置 Apache2

你应该把Apache2网络服务器作为一个服务来运行。