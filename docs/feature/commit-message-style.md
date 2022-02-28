## Commit Message Style

> When you commit with Commitizen, you'll be prompted to fill out any required commit fields at commit time. No more waiting until later for a git commit hook to run and reject your commit (though that can still be helpful)

引用官方的说法：如果项目中配置了 Git Commit Message 规范，系统将提示您在提交时填写任何必需的提交字段。无需再等到稍后 git 提交挂钩运行并拒绝。

提供了一套 Git Commit Message 的模板，这样团队开发中，使用统一的模板，能更好追踪和管理 git 的日志记录。

本文约定如下:

- 默认配置文件表示`.czrc`

### 使用方法

选择此配置后，出现以下几种情况：

- 如果当前项目中没有配置过，则创建一个默认配置文件
- 如果当前项目中已存在默认配置文件，则提示是否文件替换
- 如果其它优先级的配置文件存在，则提示是否创建一个默认配置文件进行优先级覆盖

当安装配置完成后，**git add**后，运行

```bash
git cz
```

这时候就会看到提交模板

```bash
? Select the type of change that you're committing: (Use arrow keys)
> feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  refactor: A code change that neither fixes a bug nor adds a feature
  perf:     A code change that improves performance
  test:     Adding missing tests or correcting existing tests
(Move up and down to reveal more choices)
```

类型选择大致如下:

| 类型     | 说明                                                                                   |
| -------- | -------------------------------------------------------------------------------------- |
| feat     | 新增一个功能                                                                           |
| fix      | 修复一个 Bug                                                                           |
| docs     | 文档变更                                                                               |
| style    | 代码格式（不影响功能，例如空格、分号等格式修正）                                       |
| refactor | 代码重构                                                                               |
| perf     | 改善性能                                                                               |
| test     | 测试相关                                                                                   |
| build    | 变更项目构建或外部依赖（例如 scopes: webpack、gulp、npm 等）                           |
| ci       | 更改持续集成软件的配置文件或 package 中的 scripts 命令，例如 scopes: Travis, Circle 等 |
| chore    | 其他不修改src或测试文件的更改（一些无关紧要的更改）                                                                 |
| revert   | 代码回退                                                                               |

### 配置文件

脚手架生成默认配置文件内容大概如下:

```
{
  "path": "./node_modules/cz-conventional-changelog"
}
```

更多详情信息和配置可以移步[commitizen](https://github.com/commitizen/cz-cli)查看
