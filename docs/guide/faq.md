## 常见问题

以下整理了一些常见的问题，在提问之前建议找找有没有类似的问题。

### 编辑器的终端无法使用

如果出现以下情况

```bash
chestnut-cli : 无法加载文件 （这是路径），因为在此系统上禁止运行脚本。有关详细信息...
```

因为这涉及到电脑权限的问题，可以尝试执行以下操作：

1. 以管理员身份运行**Windows PowerShell**
2. 然后运行以下命令

    ```bash
    get-ExecutionPolicy
    ```

3. 如果出现结果为：**Restricted**（表示状态是禁止）
4. 然后接着执行以下命令

    ```bash
    set-ExecutionPolicy RemoteSigned
    ```

5. 然后选择**Y**，继续执行查看命令：

    ```bash
    get-ExecutionPolicy
    ```

6. 如果输出：**RemoteSigned**（表示修改成功）

如果以上操作无法解决，请自行查阅相关资料

### ESLint 问题

- 这有可能是因为你的项目上的某些 package 包跟当前安装的 eslint 以及相关插件包发生了冲突导致，需要根据实际情况去更改版本
- 有可能是.eslintrc.js 等配置文件跟你的项目有冲突，比如本工具提供的是含有 vue3 的功能，你可以是 vue2，那么需要根据实际情况去更换

因为不可能做到适应所有的项目需求

### ESLint 的规则

本工具提供的只是一个模板，如果需要更多规则或者更改规则，可以自行修改

### commitizen 安装问题

这个包本工具提供的是全局安装的方式，但是由于 Mac 跟 Windows 有差异，如果是**Mac**，那么可能会有权限的问题导致在执行**Commiit Message Style** 配置的时候会失败，那么请自行用 sudo 的方式全局安装这个包，然后再重新执行配置命令

### 关于 Git 的钩子不生效问题

在选择**Git Hooks**配置完成后

**查看根目录下`.husky`的文件夹中是否存在下划线`_`这个文件夹，如果不存在，请执行一次以下命令：**

   ```bash
   npx husky install
   ```

**如果你的电脑是 Mac，那么有可能会出现权限问题：**
   - 如果根目录下`.husky`的文件夹中存在`pre-commit`这个文件，请删除，然后执行:
     ```bash
     npx husky add .husky/pre-commit "npx lint-staged"
     ```
   - 如果根目录下`.husky`的文件夹中存在`commit-msg`这个文件，请删除，然后执行:
     ```bash
     npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
     ```
