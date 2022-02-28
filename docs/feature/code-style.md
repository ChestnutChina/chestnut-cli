## Code Style 编程风格

> EditorConfig helps maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs. The EditorConfig project consists of a file format for defining coding styles and a collection of text editor plugins that enable editors to read the file format and adhere to defined styles. EditorConfig files are easily readable and they work nicely with version control systems.

引用官方的说法: **EditorConfig** 有助于为跨各种编辑器和 ide 从事同一项目的多个开发人员维护一致的编码风格。

本文约定如下:

- 默认配置文件表示`.editorconfig`

### 使用方法

选择此配置后，会出现以下两种情况：

- 如果当前项目没有配置过，则在项目根目录中创建一个默认配置文件文件。
- 如果当前项目中已配置，则提示是否文件替换

### 配置文件

脚手架生成默认配置文件文件内容大概如下:

```
root = true

[*]
charset = utf-8
indent_size = 2
end_of_line = auto
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true
```

更多详情信息和配置可以移步[EditorConfig](https://editorconfig.org/)查看
