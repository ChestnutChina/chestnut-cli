## Release 版本管理

> Use release-it for version management and publish to anywhere with its versatile configuration, a powerful plugin system, and hooks to execute any command you need to test, build, and/or publish your project.

引用官方的说法: 用于自动化版本控制和项目发布相关任务

本文约定如下:

- 默认配置文件表示`.release-it.json`
- 日志文件表示`CHANGELOG.md`

### 使用方法

选择此配置后

1. 一个默认配置文件，并出现以下几种情况：

   - 如果当前项目中没有配置过，则创建一个默认配置文件
   - 如果当前项目中已存在默认配置文件，则提示是否文件替换
   - 如果其它优先级的配置文件存在，则提示是否创建一个默认配置文件进行优先级覆盖
   - 最后会在`package.json`中生成发版命令**release**

2. 同时会询问是否自动生成日志文件，并出现以下两种情况:
   - 如果是，则运行发版命令后自动生成日志文件
   - 如果否，则需要日志文件的时候可以运行**npm run changelog**

### 关于日志文件

这里使用的是 chestnut 配套的日志模板插件[conventional-changelog-chestnut](https://github.com/bnuephjx/conventional-changelog-chestnut.git)

如果想使用其它日志模板可以移步[conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)查看更多的详情和用法

### 配置文件

如果选择自动生成日志文件，脚手架生成默认配置文件内容大概如下:

```json
{
  "npm": false,
  "git": {
    "commitMessage": "chore: release v${version}"
  },
  "hooks": {
    "after:bump": "npm run changelog",
    "after:git:release": "echo Successfully git push to ${repo.remote}",
    "after:release": "echo Successfully released ${name} v${version} to ${repo.repository}."
  },
  "plugins": {
    "@release-it/bumper": {
      "in": "package.json",
      "out": "package.json"
    }
  }
}
```

更多详情信息和配置可以移步[release-it](https://github.com/release-it/release-it)查看
