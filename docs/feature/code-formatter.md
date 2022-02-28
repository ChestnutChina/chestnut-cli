## Code Formatter

> ensures that all outputted code conforms to a consistent style.

引用官方的说法: 确保所有输出的代码都符合一致的样式

这样同一个项目在多人开发中，确保代码样式都保持一致，可维护性更高。

本文约定如下:

- 默认配置文件表示`.prettierrc`
- 忽略文件表示`.prettierignore`

### 使用方法

选择此配置后

1. 一个默认配置文件，并出现以下几种情况：

   - 如果当前项目中没有配置过，则创建
   - 如果当前项目中已存在默认配置文件，则提示是否文件替换
   - 如果`package.json`中配置了，那么会提示是否自行删除配置，再创建默认配置文件进行优先级覆盖。因为不想过多干涉用户的删除操作，所以需要你先删除，默认配置文件才会起效果
   - 如果其它优先级的配置文件存在，则提示是否创建一个默认配置文件进行优先级覆盖

2. 同时会有一个忽略文件，并出现以下两种情况:
   - 如果当前项目中没有，则创建
   - 如果当前项目存在，则提示是否替换

### 配置文件

脚手架生成默认配置文件内容大概如下:

```json
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 120,
  "endOfLine": "auto",
  "singleQuote": true,
  "arrowParens": "avoid",
  "trailingComma": "all",
  "bracketSpacing": true,
  "proseWrap": "never",
  "htmlWhitespaceSensitivity": "ignore",
  "overrides": [
    {
      "files": ".prettierrc",
      "options": {
        "parser": "json"
      }
    }
  ]
}
```

更多详情信息和配置可以移步[Prettier](https://prettier.io/docs/en/index.html)查看
