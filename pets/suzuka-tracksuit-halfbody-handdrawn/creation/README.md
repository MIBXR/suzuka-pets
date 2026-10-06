# 无声铃鹿 · 运动服半身手绘的制作记录

## 形象与来源

以运动服和半身构图表现无声铃鹿。保留长发、耳饰与温柔神情，让眨眼、挥手和伏案工作成为桌面上的小动作。

角色来自[《赛马娘 Pretty Derby》](https://umamusume.jp/character/silencesuzuka)。保留画风参考署名：[Pixiv 1621147](https://www.pixiv.net/users/1621147)。角色及参考作品权利归原权利人。

- [角色参考原图](references/reference-01.png)
- [角色参考裁剪](references/reference-02.png)
- [采用的角色主形象](references/canonical-base.png)
- [角色特征参考板](references/identity-plate.png)
- [方向与边界参考板](references/direction-support-and-boundaries.png)
- [注视方向使用的中性姿态参考](references/look-neutral-idle.png)

[角色主形象提示词](prompts/character.md)记录整体风格、特征与构图要求。动作由保存的 imagegen 生成原稿制作，再进行去背景、选帧、位置调整和配色处理，形成[成品图集](../package/spritesheet.png)。

## 动作设计

| 动作 | 制作思路 | 保存的资料 |
| --- | --- | --- |
| 待机 | 以安静呼吸、眨眼和细小表情作为日常姿态。 | [提示词](prompts/idle.md) · [高清原稿](../materials/idle.png) |
| 向右跑 | 通过向右的步态表达移动，保留角色的发型和服装特征。 | [提示词](prompts/running-right.md) · [高清原稿](../materials/running-right.png) |
| 向左跑 | 与向右跑形成对应的移动动作。 | [提示词](prompts/running-left.md) · [高清原稿](../materials/running-left.png) |
| 挥手 | 以小幅挥手回应招呼，保持角色重心稳定。 | [提示词](prompts/waving.md) · [高清原稿](../materials/waving.png) |
| 跳跃 | 表现起跳、腾空与落地的连续变化。 | [提示词](prompts/jumping.md) · [高清原稿](../materials/jumping.png) |
| 失落 | 以克制的表情和姿态表达失落。 | [提示词](prompts/failed.md) · [高清原稿](../materials/failed.png) |
| 等待 | 表现停顿、等待回应的状态。 | [提示词](prompts/waiting.md) · [高清原稿](../materials/waiting.png) |
| 工作 / 应援 | 通过身体、手部与电脑的配合表现工作状态。 | [提示词](prompts/running.md) · [高清原稿](../materials/running.png) |
| 检查 / 思考 | 通过神情和小动作表现专注思考。 | [提示词](prompts/review.md) · [高清原稿](../materials/review.png) |
| 注视方向 1–8 | 保留前八个方向的视线变化和角色特征。 | [提示词](prompts/look-row-9.md) · [高清原稿](../materials/look-row-9.png) |
| 注视方向 9–16 | 补齐后八个方向，使十六方向形成完整一圈。 | [提示词](prompts/look-row-10.md) · [高清原稿](../materials/look-row-10.png) |

提示词保留实际采用的文字。高清原稿保存生成阶段的细节，成品图集保存最终选择的帧与排列。
注视方向沿用保存的中性姿态参考；待机采用独立的眨眼原稿。

## v1.3

沿用动作原稿，调整挥手首帧位置，让挥手循环更稳定。
