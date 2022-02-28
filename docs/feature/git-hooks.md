## Git Hooks

> You can use it to lint your commit messages, run tests, lint code, etc... when you commit or push. Husky supports all Git hooks.

引入官方的说法：当 git commit 或者 git push 的时候可以用来检查提交消息、运行测试、检查代码等等。

在多人开发项目团队中，为了规避代码仓库的代码质量，git 日志信息，做到代码一致性，代码质量有保障，有必要在提交前进行一次检查。

本文约定如下:

- 默认配置文件夹表示`.husky`
- 提交信息配置文件表示`commitlint.config.js`
- 代码校验配置文件表示`.lintstagedrc`

### 使用方法

选择此配置后

1. 默认配置文件夹相关的包如`husky`等，并出现以下两种情况：

   - 如果当前项目中没有配置过，则创建
   - 如果当前项目中已存在，则提示是否文件替换

2. 同时询问是否在`Git Commit`提交前校验代码，并出现以下两种情况:
   - 如果是，则会优先校验是否安装`ESLint`，如果有，则安装代码校验配置文件所需的包`lint-staged`
   - 如果否，则需要自行安装

### 配置文件

如果`Git Commit`提交前校验代码，脚手架生成默认配置文件夹内容大概如下:

```
.husky
  -- _(这是个文件夹)
    -- .gitignore
    -- husky.sh
  -- commit-msg
  -- pre-commit
```

**【重要提醒】【重要提醒】【重要提醒】**

如果最后没有进行检查提交消息、运行测试、检查代码等功能，请进行**Husky**初始化：

```bash
npx husky install
```

更多详情信息和配置可以移步[Husky](https://typicode.github.io/husky/#/)查看

脚手架生成提交信息配置文件内容大概如下:

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

更多详情信息和配置可以移步[commitlint](https://commitlint.js.org/#/)查看

脚手架生成代码校验配置文件内容大概如下:

```json
{
  "*.{vue,js,ts,jsx,tsx}": "eslint --ext .vue,.js,.ts,.jsx,.tsx"
}
```

更多详情信息和配置可以移步[lint-staged](https://github.com/okonet/lint-staged#readme)查看

