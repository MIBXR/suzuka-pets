<p align="center"><sub>SUZUKA PETS · THE WEBSITE</sub></p>

<h1 align="center">铃鹿的小小世界</h1>

<p align="center">两款桌宠，一个可以慢慢逛的小网站。</p>

<p align="center"><a href="../README.md">作品首页</a> &nbsp; · &nbsp; <a href="#页面预览">页面预览</a> &nbsp; · &nbsp; <a href="#可以体验什么">交互与内容</a> &nbsp; · &nbsp; <a href="index.html">页面源码</a></p>

## 页面预览

柔和的绿色与浅粉色分别承接两款铃鹿，首屏从角色形象开始，往下依次是介绍、动作剧场、下载和创作细节。以下截图来自本目录保存的当前网页。

### 首页 · 两只铃鹿一起登场

![网站首页实际预览](preview.jpg)

### 动作剧场 · 一起看看她们的小动作

![双宠动作剧场实际预览](preview-motion.jpg)

## 可以体验什么

| 区域 | 内容与互动 |
| --- | --- |
| 首屏与角色介绍 | 胜负服全身款和运动服半身款并排登场；点击名字，可以和对应的铃鹿打招呼。 |
| 日常动作 | 同步切换九种动作，比较两款的姿态和表情；可以暂停网页动画。 |
| 十六方向注视 | 移动指针或手动选择方向，让两款铃鹿一起看向目标；触屏也可以操作。 |
| 下载与安装 | 两款分别提供便携 ZIP 和可复制的 Agent 安装指令，按 Codex、兼容 Agent 或 PetDex 的目录安装，并可选择安装后是否启用。 |
| 制作细节与来源 | 展示挥手、待机、工作和注视等细节，保留角色与参考插画的来源署名。 |

页面保留了不同屏幕尺寸的布局、系统明暗主题与减少动态效果的适配。

安装指令不要求 `codex` 命令。支持 v2 的 Codex 使用实际 `CODEX_HOME`（默认 `~/.codex`）下的 `pets/<slug>/`；其他 Agent 使用其文档或配置确认的兼容宠物目录；没有可用目录时使用 PetDex 的 `~/.petdex/pets/<slug>/`。本地配置按目标客户端格式适配，保留原始图集与 v2 标记；PetDex 目录中的文件需要由 PetDex Desktop 或兼容客户端加载。目录与配置参考 [Codex 桌宠约定](https://github.com/openai/skills/blob/main/skills/.curated/hatch-pet/references/codex-pet-contract.md)和 [PetDex CLI 文档](https://github.com/crafter-station/petdex/blob/main/packages/petdex-cli/README.md)。

## 这份网站作品包含什么

| 文件或目录 | 保存的内容 |
| --- | --- |
| [index.html](index.html) | 完整页面内容、各展示区域与交互入口。 |
| [styles.css](styles.css) | 排版、配色、明暗主题与不同屏幕尺寸的布局。 |
| [app.js](app.js) | 动作播放、十六方向注视和页面互动。 |
| [agent-install.js](agent-install.js) | 两款桌宠的下载信息与安装指令。 |
| [assets/](assets/) | 网站直接使用的高清形象、动作条带与细节图片。 |
| [downloads/](downloads/) | 固定名称的两份便携 ZIP，以及对应的安装信息。 |
| [preview.jpg](preview.jpg) · [preview-motion.jpg](preview-motion.jpg) | 供仓库 README 展示的真实页面截图。 |

网站保存自己的源码和素材，可以独立更新。下载按钮使用 `downloads/` 下的固定文件名；换成新版本时更新对应 ZIP 与安装信息，页面里的下载地址保持不变。

## 角色与参考

角色来自[《赛马娘 Pretty Derby》](https://umamusume.jp/character/silencesuzuka)。形象与画风参考：[Pixiv 插画家 · ID 1621147](https://www.pixiv.net/users/1621147)。角色及参考插画的权利归原权利人。

[查看胜负服桌宠](../pets/suzuka-race-outfit-fullbody-handdrawn/README.md) · [查看运动服桌宠](../pets/suzuka-tracksuit-halfbody-handdrawn/README.md)
