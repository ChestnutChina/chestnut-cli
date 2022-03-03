## 快速上手

本节将介绍如何在项目中使用 Chestnut CLI。请一定要阅读完才进行使用！

### Node版本

需要Node版本符合```^12.22.0 || ^14.17.0 || >=16.0.0```
### 安装 chestnut-cli

```bash
npm install chestnut-cli -g
```

### 查看是否安装成功

```bash
chestnut-cli -v
```

如果安装成功则会出现版本号

### 使用 chestnut-cli

**【重要提醒】【重要提醒】【重要提醒】**

**最好先开一个测试分支进行配置测试，待完成后才合并到正式分支中。**

进入到需要配置的项目的根目录中，然后运行以下命令:

```bash
chestnut-cli config
```

执行成功则会出现以下内容:
```bash
? Which configurations to add? (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
>( ) Code Style
 ( ) Code detection
 ( ) Code formatter
 ( ) Release
 ( ) Commit Message Style
 ( ) Git Hooks
```

### 开始使用

配置选项内容请参阅点击左边侧边栏的对应链接。

### 小提示

如果是新开的一个项目，没有任何配置，那么建议全选

在安装或者使用中有问题，可以先查阅[常见问题](/guide/faq)

