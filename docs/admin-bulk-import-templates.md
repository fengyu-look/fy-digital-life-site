# FY Digital Life 后台批量导入模板

这个文档用于让 GPT 按后台可识别的格式生成 JSON。把对应模板发给 GPT，拿到 JSON 后，进入后台选择对应推荐页，粘贴到“批量导入 JSON”，点击“批量导入当前页”即可。

注意：

- 只返回 JSON 数组，不要 Markdown 代码块。
- 不要生成解释文字。
- 每张卡片都必须有 `title`。
- 图片可以先留空 `cover_url: ""`，后续在后台单张编辑替换。
- 链接不确定时可以留空 `link_url: ""`。

## 提示词页模板

把下面整段发给 GPT：

```text
请根据我给你的主题/链接/内容，生成适合导入 FY Digital Life 网站后台“提示词宇宙”页面的 JSON 数组。

输出要求：
1. 只输出合法 JSON 数组，不要 Markdown，不要解释。
2. 每个对象代表一张提示词卡片。
3. 字段必须包含：
   - title：提示词标题，简洁明确。
   - summary：一句话说明这个提示词适合生成什么。
   - cover_url：封面图 URL；如果没有就填空字符串。
   - link_url：相关链接；如果没有就填空字符串。
   - tags：数组，放 1-4 个标签。
   - data：对象，必须包含 prompt_type、prompt、negative_prompt、model、copy_button_label。
4. prompt 要写完整，不要只写概述。
5. copy_button_label 固定写“点击复制”。
6. prompt_type 可用：TEXT TO IMAGE、TEXT TO VIDEO、IMAGE TO IMAGE、STYLE / POSTER、REFERENCE / DAILY。
7. 如果我给的是中文需求，prompt 可以用中文；如果我要求英文提示词，就输出英文 prompt。

JSON 结构示例：
[
  {
    "title": "婚礼慢门纪实提示词",
    "summary": "用于生成具有慢门拖影和纪实情绪的婚礼亲吻画面。",
    "cover_url": "",
    "link_url": "",
    "tags": ["婚礼", "纪实", "文生图"],
    "data": {
      "prompt_type": "TEXT TO IMAGE",
      "prompt": "这里写完整提示词。",
      "negative_prompt": "这里写反向提示词；没有就留空。",
      "model": "Midjourney / 即梦 / 通义万相 / 其他",
      "copy_button_label": "点击复制"
    }
  }
]

下面是我要你生成的主题/内容：
【把主题、链接或原始提示词粘在这里】
```

## Skill 页模板

把下面整段发给 GPT：

```text
请根据我给你的 Skill 链接、GitHub 仓库、工具说明或文章内容，生成适合导入 FY Digital Life 网站后台“Skill 工具箱”页面的 JSON 数组。

输出要求：
1. 只输出合法 JSON 数组，不要 Markdown，不要解释。
2. 每个对象代表一张 Skill 或 Workflow 卡片。
3. 字段必须包含：
   - title：Skill 或 Workflow 名称。
   - summary：一句话说明它解决什么问题。
   - cover_url：封面图 URL；如果没有就填空字符串。
   - link_url：GitHub、官网或教程链接；如果没有就填空字符串。
   - tags：数组，放 1-4 个分类标签。
   - data：对象，必须包含 skill_type、includes、use_cases、call_instruction、button_label。
4. skill_type 只能填 SKILL 或 WORKFLOW。
5. includes 是数组，放相关能力、插件、命令或关键词。
6. use_cases 是数组，写 2-5 个适用场景。
7. button_label：
   - GitHub 仓库用 VIEW ON GITHUB。
   - 教程页面用 VIEW GUIDE。
   - 工作流用 VIEW WORKFLOW。
8. summary 和 use_cases 要让普通用户看得懂，不要写得太工程化。

JSON 结构示例：
[
  {
    "title": "Awesome Codex Skills",
    "summary": "收集可安装的 Codex Skill，适合快速扩展 Agent 能力。",
    "cover_url": "",
    "link_url": "https://github.com/example/repo",
    "tags": ["Codex", "Skill", "Workflow"],
    "data": {
      "skill_type": "SKILL",
      "includes": ["codex-skills", "workflow", "automation"],
      "use_cases": [
        "查找可安装的 Codex Skill",
        "给自己的 Agent 扩展能力",
        "参考别人如何编写 SKILL.md"
      ],
      "call_instruction": "打开 GitHub 仓库，按 README 说明安装。",
      "button_label": "VIEW ON GITHUB"
    }
  }
]

下面是我要你生成的链接/内容：
【把 GitHub 链接、工具说明或文章内容粘在这里】
```

## 后台导入步骤

1. 打开桌面的 `FY后台.command`。
2. 登录后台。
3. 选择“提示词宇宙”或“Skill 工具箱”。
4. 把 GPT 返回的 JSON 数组粘贴进“批量导入 JSON”。
5. 点击“批量导入当前页”。
6. 导入后检查每张卡片的封面、链接、排序和发布状态。

## 常见错误

- 如果提示 JSON 格式错误：让 GPT “只返回 JSON 数组，不要代码块，不要解释”。
- 如果导入到错误页面：先切换后台顶部的页面选择器，再粘贴导入。
- 如果图片没显示：先把图片上传到后台，复制生成的封面 URL，再编辑卡片替换。
- 如果排序不顺：点击“整理当前页排序”。
