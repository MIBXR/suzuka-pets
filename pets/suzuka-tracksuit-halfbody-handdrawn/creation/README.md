<p align="center"><sub>BEHIND THE PET</sub></p>

<h1 align="center">无声铃鹿 · 运动服半身手绘 · 制作记录</h1>

<p align="center">从一张参考图，到桌面上的小动作。</p>

<p align="center"><b>v1.3 &nbsp; / &nbsp; 参考 · 提示词 · 高清原稿 · 成品</b></p>

<p align="center"><a href="../README.md">看作品</a> &nbsp; · &nbsp; <a href="#动作设计与原稿">动作设计</a> &nbsp; · &nbsp; <a href="prompts/character.md">角色提示词</a> &nbsp; · &nbsp; <a href="../package/spritesheet.png">成品图集</a></p>

## 形象从哪里来

换上红白运动服，铃鹿也变得更松弛了。半眯的绿眼睛、三角形小笑嘴、直直的栗色长发，配上粗一些的手绘线条和暖色颗粒感，构成一只只露出小小上身的桌面伙伴。

角色来自[《赛马娘 Pretty Derby》](https://umamusume.jp/character/silencesuzuka)。两款桌宠的形象与画风参考保留署名：[Pixiv 插画家 · ID 1621147](https://www.pixiv.net/users/1621147)。桌宠通过 AI 辅助生成与后续整理制作；角色及参考插画的权利归原权利人。

<table>
<tr><td align="center" width="50%"><b>采用的主形象</b><br><a href="references/canonical-base.png"><img src="references/canonical-base.png" width="260" alt="采用的角色主形象参考"></a></td><td align="center" width="50%"><b>成品中的日常姿态</b><br><img src="../package/previews/idle.gif" width="192" alt="运动服铃鹿最终待机动作"></td></tr>
</table>

## 想保留下来的细节

**半身构图。** 大头与紧凑的运动服上身，保留手部动作和小尾巴，形成贴近桌边的陪伴感。

**左右都有记号。** 画面左侧的圆形耳饰与两条飘带、右侧的银灰菱形发夹，保持各自的位置。

**工作的小道具。** 灰绿色笔记本电脑、轻轻敲键盘的双手，以及等待时的三个小点。

## 制作思路

先从参考中确定角色特征与手绘表达，保存[主形象提示词](prompts/character.md)和采用的角色主图。随后按动作分别生成连续姿态：日常动作保留各自的节奏，注视动作围绕同一套身体构图变化。

生成阶段的高清图保存在 `materials/`，对应提示词保存在 `prompts/`。作品经过透明处理、选帧、位置与配色调整后，成为 `package/` 中的最终图集；下表把每个动作的想法、原稿和最终表现放在一起。原稿保留生成时的状态，部分可见用于去背景的纯色底。

## 动作设计与原稿

| 动作与成品 | 制作思路 | 提示词与高清原稿 |
| :---: | --- | --- |
| **待机**<br><img src="../package/previews/idle.gif" width="112" alt="运动服铃鹿待机"><br><sub>6 帧</sub> | 保留半眯的眼型和三角笑嘴，安排自然眨眼；头部、直发与衣领维持熟悉的半身轮廓。 | [提示词](prompts/idle.md)<br>[高清原稿](../materials/idle.png) |
| **向右移动**<br><img src="../package/previews/running-right.gif" width="112" alt="运动服铃鹿向右移动"><br><sub>8 帧</sub> | 用小手交替向前和头发跟随表现向右移动，整个角色始终保持半身构图。 | [提示词](prompts/running-right.md)<br>[高清原稿](../materials/running-right.png) |
| **向左移动**<br><img src="../package/previews/running-left.gif" width="112" alt="运动服铃鹿向左移动"><br><sub>8 帧</sub> | 用朝左的小幅转向、伸拳和收拳表达拖动；画面左侧耳饰与右侧发夹保持原来的方位。 | [提示词](prompts/running-left.md)<br>[高清原稿](../materials/running-left.png) |
| **挥手**<br><img src="../package/previews/waving.gif" width="112" alt="运动服铃鹿挥手"><br><sub>4 帧</sub> | 手臂从低位抬到脸旁，再回到起点；保持头、身体与肩部稳定，让挥手循环自然衔接。 | [提示词](prompts/waving.md)<br>[高清原稿](../materials/waving.png) |
| **跳跃**<br><img src="../package/previews/jumping.gif" width="112" alt="运动服铃鹿跳跃"><br><sub>5 帧</sub> | 通过上身上移和落回表现小跳跃，保持头像大小与半身服装轮廓。 | [提示词](prompts/jumping.md)<br>[高清原稿](../materials/jumping.png) |
| **失落**<br><img src="../package/previews/failed.gif" width="112" alt="运动服铃鹿失落"><br><sub>8 帧</sub> | 从放松神情过渡到耳朵下垂、低头闭眼，再逐步恢复，让失落仍带着原来的克制表情。 | [提示词](prompts/failed.md)<br>[高清原稿](../materials/failed.png) |
| **等待回应**<br><img src="../package/previews/waiting.gif" width="112" alt="运动服铃鹿等待回应"><br><sub>6 帧</sub> | 双手垂下，只有很轻的歪头与眨眼；发侧的小省略号按节奏改变三个点的深浅。 | [提示词](prompts/waiting.md)<br>[高清原稿](../materials/waiting.png) |
| **工作**<br><img src="../package/previews/running.gif" width="112" alt="运动服铃鹿工作"><br><sub>6 帧</sub> | 固定灰绿色笔记本的盖板、转轴和底座，只让贴在键盘上的小手交替按下，保留待机的脸型和眼色。 | [提示词](prompts/running.md)<br>[高清原稿](../materials/running.png) |
| **检查与思考**<br><img src="../package/previews/review.gif" width="112" alt="运动服铃鹿检查与思考"><br><sub>6 帧</sub> | 一只手始终托在下巴旁，目光左右查看并轻轻点头；中间加入一次完整眨眼。 | [提示词](prompts/review.md)<br>[高清原稿](../materials/review.png) |
| **十六方向注视**<br><img src="../package/previews/look-directions.gif" width="112" alt="运动服铃鹿十六方向注视"><br><sub>16 个方向姿态</sub> | 下方衣领与小身体保持稳定，利用整张脸的俯仰、转向表现视线，同时保留左右发饰与半眯眼的结构。从上方起，按每 22.5° 顺时针排列。 | [前八方向提示词](prompts/look-row-9.md)<br>[前八方向原稿](../materials/look-row-9.png)<br>[后八方向提示词](prompts/look-row-10.md)<br>[后八方向原稿](../materials/look-row-10.png) |

## 参考收藏

### 角色与画风

- [角色参考原图](references/reference-01.png)
- [角色参考裁剪](references/reference-02.png)
- [采用的角色主形象](references/canonical-base.png)
- [角色特征参考板](references/identity-plate.png)

### 方向与构图

- [方向与边界参考板](references/direction-support-and-boundaries.png)
- [注视使用的中性姿态](references/look-neutral-idle.png)

注视方向采用保存的中性姿态参考；待机的眨眼原稿单独保留，两者各自承担不同的动作设计。

## 当前作品

v1.3 沿用保存的动作原稿，调整挥手首帧的位置，让抬手与回到原位之间的循环更稳定。

[看完整作品](../README.md) · [高清原稿](../materials/) · [解包成品](../package/README.md)
