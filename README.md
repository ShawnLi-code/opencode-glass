# OpenCode Glass

OpenCode Desktop 的低亮度玻璃主题插件。六套配色：深蓝、石墨、翡翠、暮紫、冰川、琥珀。覆盖已有会话、新会话与设置页；包含可撤销的工具摘要和模型胶囊。

本仓库用于分发预构建运行文件；不包含完整开发工作区。已在 **Windows / OpenCode Desktop 2.2.5** 实机验证，其他系统和版本尚未验证。仅作用于GUI，不修改app.asar、TUI或模型调用。

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

公开内容只含运行文件及说明，不包含个人配置、凭证、聊天记录、会话截图、测试脚本或node_modules。安装包SHA-256位于同一Release的 `.sha256` 附件中。

License: MIT.
