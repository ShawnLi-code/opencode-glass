# 安装与分发

这是 OpenCode Desktop GUI 插件，已在 Windows / Desktop 2.2.5 验证。不修改安装包，不包含模型、账号、凭证或个人配置。其他系统／桌面版本尚未实机验证。

## 用安装包安装（不需要发布到 npm）

先把 `opencode-glass-0.1.0.tgz` 复制到另一台电脑。需要 Node.js/npm，安装依赖需要网络。

PowerShell：

```powershell
$dir = Join-Path $HOME '.config/opencode/plugins'
New-Item -ItemType Directory -Force $dir | Out-Null
npm install --prefix "$dir" 'D:\Downloads\opencode-glass-0.1.0.tgz'
(Join-Path $dir 'node_modules/opencode-glass').Replace('\','/')
```

把最后输出的完整目录作为一个新条目，加入全局 `~/.config/opencode/opencode.jsonc` 的现有 `plugins` 数组。保留原有插件和其他配置，不用下面示例覆盖整个文件：

```jsonc
{
  "plugins": [
    "C:/Users/YOUR_NAME/.config/opencode/plugins/node_modules/opencode-glass"
  ]
}
```

同一个插件只配置一个条目。安装后在桌面设置中找“玻璃 / Glass”，可切换六色与关闭特效；性能优先可关闭“动画”或“动态背景”。偏好在新电脑独立保存，不随安装包迁移。

## GitHub 与 npm 的区别

- 可以将 `.tgz` 上传到 GitHub Release 的附件，另一台电脑下载后按上面安装。
- 有了真实 Release 地址，也可以执行 `npm install --prefix "$dir" 'https://github.com/OWNER/REPO/releases/download/TAG/opencode-glass-0.1.0.tgz'`；私有仓库还需要下载授权。
- 只有发布到 npm registry 后，才能直接使用 `npm install opencode-glass`。此安装包不代表已发布，包名是否可用、发布账号与仓库地址需要另行确认。

## 打包检查

源码目录清除 `GLASS_DESKTOP_TEST` 后执行 `npm run verify`，然后 `npm pack`。`prepack` 拒绝带自动点击／诊断入口的GUI。发布文件采用白名单，仅包含运行入口、预构建GUI、安装说明、README及打包检查器；不包含node_modules、测试脚本、截图、日志和个人配置。README中的开发验收文档链接属于源码工作区，不在精简运行包内。

不要把用户配置、会话截图或日志一起上传。v0.1.0安装包已发布至 https://github.com/ShawnLi-code/opencode-glass/releases/tag/v0.1.0 ，尚未发布至npm registry。默认main分支已补齐开发源码和测试，开发步骤见README；npm安装包仍只包含运行文件。
