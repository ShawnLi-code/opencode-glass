# OpenCode Glass

OpenCode Desktop 的低亮度玻璃主题插件。六套配色：深蓝、石墨、翡翠、暮紫、冰川、琥珀。覆盖已有会话、新会话与设置页；包含可撤销的工具摘要和模型胶囊。

本仓库现在包含完整插件源码、构建配置、锁文件、自动测试及历史设计／验收说明，同时保留预构建运行文件。已在 **Windows / OpenCode Desktop 2.2.5** 实机验证，其他系统和版本尚未验证。仅作用于GUI，不修改app.asar、TUI或模型调用。

## 在另一台电脑继续开发

安装Node.js 22或更新版本、npm及Git，然后执行：

```sh
git clone https://github.com/ShawnLi-code/opencode-glass.git
cd opencode-glass
npm ci
npm run verify
```

`verify`执行类型检查、正常生产构建和27项自动测试，不自动操作你的桌面。`npm run watch`监听GUI源码变化；修改服务端入口后重新运行`npm run build`。要实机热加载，将这个克隆目录的完整路径加入全局OpenCode配置的`plugins`数组，并移除旧安装目录对应的重复条目。不要同时启用两个副本。

### 主要文件

- `src/gui.tsx`：GUI生命周期与设置；`src/index.ts`：服务端入口。
- `src/theme.ts`、`src/palettes.ts`、`src/aurora.ts`：材质、配色、背景。
- `src/layout-bridge.ts`、`src/material-bridge.ts`、`src/activity.ts`：模型胶囊、活动摘要及滚动遮挡。
- `tests/*.test.mjs`：默认自动测试；其他`tests/*.ts`：显式启用的桌面验收脚本。
- `scripts/`、`vite.config.ts`、`tsconfig.json`、`package-lock.json`：构建和可复现依赖。
- 根目录历史设计／验收文档保留过程记录；其中引用的私有截图和本机备份未上传，不代表缺少构建必需文件。
- `USAGE.md`保留完整开关、日常使用与卸载说明；`DEVELOPMENT.md`记录开发边界。

### 可选桌面验收

只有需要操作真实桌面时才设置`GLASS_DESKTOP_TEST`，可用入口见`vite.config.ts`。这些脚本会临时切换设置、导航、缩放或滚动，不适合在重要任务运行时执行。测试输出默认为系统临时目录下的`opencode-glass-tests`，可用环境变量`GLASS_TEST_OUTPUT_DIR`指定目录；不再写死原作者电脑路径。部分脚本依赖中文宿主界面。

测试完务必清除`GLASS_DESKTOP_TEST`并运行`npm run verify`恢复正常构建。`npm pack`会拒绝包含诊断入口的GUI；安装包只收录运行文件，开发源码通过本仓库获取。

## 安装

需要Node.js/npm，首次安装依赖需要网络。在另一台电脑的PowerShell运行：

```powershell
$dir = Join-Path $HOME '.config/opencode/plugins'
New-Item -ItemType Directory -Force $dir | Out-Null
npm install --prefix "$dir" 'https://github.com/ShawnLi-code/opencode-glass/releases/download/v0.1.0/opencode-glass-0.1.0.tgz'
(Join-Path $dir 'node_modules/opencode-glass').Replace('\','/')
```

将最后输出的目录加入全局 `~/.config/opencode/opencode.jsonc` 的现有 `plugins` 数组，保留其他配置。例如：

```jsonc
{
  "plugins": [
    "C:/Users/YOUR_NAME/.config/opencode/plugins/node_modules/opencode-glass"
  ]
}
```

同一插件只添加一次。在桌面 **设置 → 玻璃 / Glass** 中调整配色与开关。偏好由新电脑独立保存，不包含原电脑设置。

也可以从 [Releases](https://github.com/ShawnLi-code/opencode-glass/releases) 手动下载安装包。当前未发布到npm registry，不能使用 `npm install opencode-glass` 代替上述Release地址。

## 性能与范围

- 上翻时只更新已缓存的遮挡几何，完整工具分组整理延后到停止滚动120ms后，减少逐行背景模糊。
- 动态背景与玻璃模糊仍有GPU成本；性能优先可关闭动画或动态背景。没有稳定FPS或零开销承诺。
- 总开关关闭恢复原生样式和模型控件，不删除会话、草稿或切换模型。
- 27项自动测试通过；新会话材质、原生模型控件展开与关闭还原完成实机检查。没有全面覆盖所有第三方插件与所有主题组合。

## 隐私

公开内容包含插件源码、测试和文档，不包含个人配置、凭证、聊天记录、会话截图或node_modules。历史文档中私人路径已脱敏。安装包SHA-256位于同一Release的 `.sha256` 附件中。早期v0.1.0标签仍保留当时的预构建分发快照；继续开发请克隆默认`main`分支。

License: MIT.
