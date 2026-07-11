import {
  recommendationPages,
  SITE_MEDIA_BASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  supabase,
} from "./site-supabase.js";

const pageConfigs = {
  "useful-websites": {
    label: "实用网站",
    defaultTitle: "超级链接宇宙",
    defaultIntro: "数字世界的浩瀚星河里，我们为你打捞那些真正闪光的岛屿。",
    defaultLayout: "grid",
    itemTypes: [{ value: "website", label: "网页推荐" }],
    fields: [
      { key: "site_name", label: "网页名称", type: "text" },
      { key: "pricing", label: "价格/状态", type: "text", placeholder: "Free / Paid / Freemium" },
      { key: "recommend_reason", label: "推荐理由", type: "textarea" },
      { key: "button_label", label: "按钮文案", type: "text", placeholder: "VISIT SITE", defaultValue: "VISIT SITE" },
    ],
    defaultSettings: { label: "CURATED LINKS" },
  },
  "prompt-collection": {
    label: "提示词宇宙",
    defaultTitle: "提示词宇宙",
    defaultIntro: "收藏文生图、文生视频与图生图提示词。",
    defaultLayout: "grid",
    itemTypes: [{ value: "prompt", label: "提示词卡片" }],
    fields: [
      { key: "prompt_type", label: "提示词分类", type: "text", placeholder: "TEXT TO IMAGE", defaultValue: "TEXT TO IMAGE" },
      { key: "prompt", label: "完整提示词", type: "textarea", rows: 7 },
      { key: "negative_prompt", label: "反向提示词", type: "textarea" },
      { key: "model", label: "模型/工具", type: "text" },
      { key: "copy_button_label", label: "复制按钮文案", type: "text", placeholder: "点击复制", defaultValue: "点击复制" },
    ],
    defaultSettings: { label: "PROMPT COLLECTION" },
  },
  "skill-workflow": {
    label: "Skill 工具箱",
    defaultTitle: "Skill 工具箱",
    defaultIntro: "收藏常用 Skill 与组合工作流。",
    defaultLayout: "grid",
    itemTypes: [
      { value: "skill", label: "Skill" },
      { value: "workflow", label: "Workflow" },
    ],
    fields: [
      { key: "skill_type", label: "类型标记", type: "select", options: ["SKILL", "WORKFLOW"], defaultValue: "SKILL" },
      { key: "includes", label: "包含项，用逗号分隔", type: "csv", placeholder: "dbs-content, stop-slop" },
      { key: "use_cases", label: "适用场景，每行一个", type: "lines" },
      { key: "call_instruction", label: "调用说明", type: "text", placeholder: "/dbs-content" },
      { key: "button_label", label: "按钮文案", type: "text", placeholder: "VIEW ON GITHUB", defaultValue: "VIEW ON GITHUB" },
    ],
    defaultSettings: { label: "SKILL / WORKFLOW" },
  },
  photography: {
    label: "摄影页",
    defaultTitle: "Scenes Held By Light",
    defaultIntro: "一份关于静默画面的私人索引。",
    defaultLayout: "photo-showcase",
    itemTypes: [
      { value: "photo", label: "照片" },
      { value: "hero", label: "首屏视频/主视觉" },
    ],
    fields: [
      { key: "ratio", label: "图片比例", type: "select", options: ["wide", "portrait", "square"], defaultValue: "wide" },
      { key: "focus", label: "图片焦点", type: "text", placeholder: "center center", defaultValue: "center center" },
      { key: "caption", label: "图片说明", type: "textarea" },
      { key: "location", label: "地点", type: "text" },
      { key: "shot_at", label: "拍摄时间", type: "text", placeholder: "2026-07" },
    ],
    defaultSettings: { label: "PHOTOGRAPHY / PERSONAL WORKS" },
  },
  "agent-guide": {
    label: "Agent 安装教程",
    defaultTitle: "Agent 工具安装教程库",
    defaultIntro: "每张卡片都是一个 Agent 工具入口。",
    defaultLayout: "paginated-guide",
    itemTypes: [{ value: "agent_tutorial", label: "Agent 教程" }],
    fields: [
      { key: "group", label: "分组标签", type: "text", placeholder: "HOT / OFFICIAL" },
      { key: "difficulty", label: "难度", type: "text", placeholder: "入门 / 进阶" },
      { key: "model", label: "模型/平台", type: "text", placeholder: "OpenAI / DeepSeek / 自定义 API" },
      { key: "success", label: "成功标准", type: "textarea", rows: 2 },
      { key: "quick", label: "3 分钟快速开始，每行一步", type: "lines", rows: 5 },
      { key: "what", label: "这个 Agent 是什么", type: "textarea" },
      { key: "use_cases", label: "适合谁/适用场景", type: "textarea" },
      { key: "prepare", label: "安装前准备，每行一项", type: "lines" },
      { key: "mac", label: "Mac 安装步骤 JSON", type: "json", rows: 7, placeholder: '[{"text":"安装：","code":"..."}]' },
      { key: "windows", label: "Windows 安装步骤 JSON", type: "json", rows: 7, placeholder: '[{"text":"安装：","code":"..."}]' },
      { key: "verify", label: "验证是否成功，每行一项", type: "lines" },
      { key: "deepseek", label: "DeepSeek/国产模型接入，每行一项", type: "lines" },
      { key: "errors", label: "常见报错，每行一项", type: "lines" },
      { key: "tool_links", label: "工具链接 JSON", type: "json", rows: 5, placeholder: '[{"label":"GitHub","url":"https://..."}]' },
      { key: "button_label", label: "按钮文案", type: "text", placeholder: "VIEW GUIDE", defaultValue: "VIEW GUIDE" },
    ],
    defaultSettings: { label: "AGENT INSTALL GUIDE", page_size: 8 },
  },
};

const staticContentSeeds = {
  "useful-websites": [
    {
      title: "Tool Name 01",
      summary: "一句话写清楚这个网站最适合解决什么问题。",
      cover_url: "/assets/custom/latest-work-card.png",
      link_url: "https://example.com",
      meta: "AI / PRODUCTIVITY",
    },
    {
      title: "Tool Name 02",
      summary: "适合放你想推荐给网友的实用网站说明。",
      cover_url: "/assets/custom/ai-slogan-card.png",
      link_url: "https://example.com",
      meta: "DESIGN / IDEA",
    },
    {
      title: "Tool Name 03",
      summary: "这里可以替换成价格、用途或一句推荐理由。",
      cover_url: "/assets/custom/about-card-cyber-20260704.png",
      link_url: "https://example.com",
      meta: "WEB / RESOURCE",
    },
    {
      title: "Tool Name 04",
      summary: "后续复制这一张卡片，替换文字、图片和链接。",
      cover_url: "/assets/custom/work-card-photo-web.mp4",
      link_url: "https://example.com",
      meta: "REFERENCE / DAILY",
    },
    {
      title: "Tool Name 05",
      summary: "保持短句，整个页面会更像作品集里的推荐清单。",
      cover_url: "/assets/custom/about-card-portrait-crop-20260704.png",
      link_url: "https://example.com",
      meta: "CREATIVE / TOOL",
    },
    {
      title: "Tool Name 06",
      summary: "如果没有图片，可以先换成统一风格的封面图。",
      cover_url: "/assets/custom/work-card-skill-web.mp4",
      link_url: "https://example.com",
      meta: "LEARN / SAVE",
    },
  ],
  "prompt-collection": [
    {
      title: "Prompt Name 01",
      summary: "一句话说明这个文生图提示词适合生成什么画面。",
      cover_url: "/assets/custom/latest-work-card.png",
      link_url: "",
      meta: "TEXT TO IMAGE",
      prompt: "这里替换成你的完整文生图提示词原文。",
    },
    {
      title: "Prompt Name 02",
      summary: "适合放镜头语言、主体、光线、质感和风格要求。",
      cover_url: "/assets/custom/work-card-prompt-web.mp4",
      link_url: "",
      meta: "TEXT TO VIDEO",
      prompt: "这里替换成你的完整文生视频提示词原文。",
    },
    {
      title: "Prompt Name 03",
      summary: "用于图生图改造时，写清保留内容和变化方向。",
      cover_url: "/assets/custom/about-card-cyber-20260704.png",
      link_url: "",
      meta: "IMAGE TO IMAGE",
      prompt: "这里替换成你的完整图生图提示词原文。",
    },
    {
      title: "Prompt Name 04",
      summary: "可以放产品海报、人物设定或场景氛围类提示词。",
      cover_url: "/assets/custom/ai-slogan-card.png",
      link_url: "",
      meta: "STYLE / POSTER",
      prompt: "这里替换成你的完整风格化生成提示词原文。",
    },
    {
      title: "Prompt Name 05",
      summary: "适合收藏你常用的高成功率视觉提示词模板。",
      cover_url: "/assets/custom/about-card-portrait-crop-20260704.png",
      link_url: "",
      meta: "REFERENCE / DAILY",
      prompt: "这里替换成你的完整参考图或日常生成提示词原文。",
    },
    {
      title: "Prompt Name 06",
      summary: "后续复制这一张卡片，替换封面、标题和提示词。",
      cover_url: "/assets/custom/work-card-skill-web.mp4",
      link_url: "",
      meta: "TEMPLATE / SAVE",
      prompt: "这里替换成你的完整提示词模板原文。",
    },
  ],
  "skill-workflow": [
    {
      type: "SKILL",
      title: "Skill Name 01",
      summary: "这里写这个 Skill 解决什么问题、适合谁用、能提升哪一类工作效率。后续可以替换成真实 GitHub Skill 的介绍。",
      cover_url: "/assets/custom/work-card-skill-web.mp4",
      link_url: "https://github.com/your-name/your-skill",
      meta: "CONTENT / AUTOMATION",
      includes: ["skill-name"],
    },
    {
      type: "SKILL",
      title: "Skill Name 02",
      summary: "这里可以写更长一点的说明，比如它适合创作、研究、整理资料还是自动化执行，帮助访客快速判断是否需要收藏。",
      cover_url: "/assets/custom/about-card-cyber-20260704.png",
      link_url: "https://github.com/your-name/your-skill",
      meta: "RESEARCH / TOOLING",
      includes: ["skill-name"],
    },
    {
      type: "WORKFLOW",
      title: "Workflow Name 01",
      summary: "这里写这套工作流适合什么场景，以及多个 Skill 串起来后能完成什么结果。比如从选题、资料整理到成稿发布的一整套流程。",
      cover_url: "/assets/custom/work-card-prompt-web.mp4",
      link_url: "https://github.com/your-name/workflow-readme",
      meta: "RESEARCH / WRITING",
      includes: ["dbs-content", "content-research-writer", "stop-slop"],
    },
    {
      type: "WORKFLOW",
      title: "Workflow Name 02",
      summary: "这里可以放一套更偏生产力的组合方法，说明每个 Skill 在流程里的位置，让网友知道它不是单点工具，而是一套可复用路径。",
      cover_url: "/assets/custom/latest-work-card.png",
      link_url: "https://github.com/your-name/workflow-readme",
      meta: "PRODUCTION / SYSTEM",
      includes: ["skill-a", "skill-b", "skill-c"],
    },
  ],
  photography: [
    { title: "Photo 01", summary: "", cover_url: "/assets/custom/photography/fy-photo-02.jpg", link_url: "", meta: "wide", ratio: "wide", focus: "center center" },
    { title: "Photo 02", summary: "", cover_url: "/assets/custom/photography/fy-photo-04.jpg", link_url: "", meta: "portrait", ratio: "portrait", focus: "center center" },
    { title: "Photo 03", summary: "", cover_url: "/assets/custom/photography/fy-photo-01.jpg", link_url: "", meta: "portrait", ratio: "portrait", focus: "center center" },
    { title: "Photo 04", summary: "", cover_url: "/assets/custom/photography/fy-photo-07.jpg", link_url: "", meta: "wide", ratio: "wide", focus: "center center" },
    { title: "Photo 05", summary: "", cover_url: "/assets/custom/photography/fy-photo-17.jpg", link_url: "", meta: "portrait", ratio: "portrait", focus: "center center" },
    { title: "Photo 06", summary: "", cover_url: "/assets/custom/photography/fy-photo-10.jpg", link_url: "", meta: "square", ratio: "square", focus: "center center" },
    { title: "Photo 07", summary: "", cover_url: "/assets/custom/photography/fy-photo-05.jpg", link_url: "", meta: "wide", ratio: "wide", focus: "center center" },
    { title: "Photo 08", summary: "", cover_url: "/assets/custom/photography/fy-photo-12.png", link_url: "", meta: "portrait", ratio: "portrait", focus: "center center" },
    { title: "Photo 09", summary: "", cover_url: "/assets/custom/photography/fy-photo-08.jpg", link_url: "", meta: "portrait", ratio: "portrait", focus: "center center" },
    { title: "Photo 10", summary: "", cover_url: "/assets/custom/photography/fy-photo-15.jpg", link_url: "", meta: "portrait", ratio: "portrait", focus: "center center" },
    { title: "Photo 11", summary: "", cover_url: "/assets/custom/photography/fy-photo-18.jpg", link_url: "", meta: "wide", ratio: "wide", focus: "center center" },
    { title: "Photo 12", summary: "", cover_url: "/assets/custom/photography/fy-photo-16.jpg", link_url: "", meta: "portrait", ratio: "portrait", focus: "center center" },
    { title: "Photo 13", summary: "", cover_url: "/assets/custom/photography/fy-photo-06.jpg", link_url: "", meta: "portrait", ratio: "portrait", focus: "center center" },
    { title: "Photo 14", summary: "", cover_url: "/assets/custom/photography/fy-photo-09.jpg", link_url: "", meta: "portrait", ratio: "portrait", focus: "center center" },
    { title: "Photo 15", summary: "", cover_url: "/assets/custom/photography/fy-photo-13.png", link_url: "", meta: "wide", ratio: "wide", focus: "center center" },
    { title: "Photo 16", summary: "", cover_url: "/assets/custom/photography/fy-photo-20.jpg", link_url: "", meta: "portrait", ratio: "portrait", focus: "center center" },
    { title: "Photo 17", summary: "", cover_url: "/assets/custom/photography/fy-photo-03.jpg", link_url: "", meta: "portrait", ratio: "portrait", focus: "center center" },
    { title: "Photo 18", summary: "", cover_url: "/assets/custom/photography/fy-photo-11.png", link_url: "", meta: "portrait", ratio: "portrait", focus: "center center" },
    { title: "Photo 19", summary: "", cover_url: "/assets/custom/photography/fy-photo-14.png", link_url: "", meta: "portrait", ratio: "portrait", focus: "center center" },
    { title: "Photo 20", summary: "", cover_url: "/assets/custom/photography/fy-photo-19.jpg", link_url: "", meta: "square", ratio: "square", focus: "center center" },
  ],
  "agent-guide": [
    {
      "title": "Hermes Agent",
      "group": "HOT / OVERSEAS",
      "summary": "Nous Research 的开源 Agent 客户端，适合想用一个桌面端或命令行入口连接不同模型的人。它能跑日常对话、工具调用和本地工作流，对 DeepSeek 接入也比较友好。",
      "cover_url": "",
      "link_url": "https://hermes-agent.nousresearch.com/docs/",
      "tags": [
        "Mac",
        "Windows",
        "CLI",
        "DeepSeek"
      ],
      "difficulty": "入门偏中等",
      "model": "OpenAI / Anthropic / DeepSeek / 自定义 API",
      "success": "能打开 Hermes，或终端运行 hermes 后进入设置界面。",
      "guide": {
        "quick": [
          "先去 Hermes 官网下载桌面版；如果你喜欢终端，Mac/Linux/WSL 用官方 shell 脚本安装。",
          "打开 Hermes 后跟着 setup 走，先确认能进入主界面。",
          "要接 DeepSeek，就运行 hermes setup，选择 Quick Setup，再选 DeepSeek。",
          "DeepSeek 的 Base URL 填 https://api.deepseek.com，API Key 从 DeepSeek 开放平台复制。"
        ],
        "what": "Hermes Agent 是 Nous Research 做的 Agent 客户端。你可以把它理解成一个能连接多种大模型的工作台：桌面端适合小白，CLI 适合喜欢终端的人。",
        "fit": "适合想尝试外国 Agent 工具，但又希望接入 DeepSeek 等国产模型的人；也适合想把模型、工具和本地文件操作放到一个入口里的人。",
        "prepare": [
          "准备一个可用网络环境。",
          "准备一个模型 API Key。用 DeepSeek 的话，先去 DeepSeek 开放平台创建 API Key。",
          "Windows 用户建议用 PowerShell；如果用 WSL，就在 WSL 里面按 Linux 方法装。"
        ],
        "mac": [
          {
            "text": "桌面端：去 Hermes 官网下载安装包，安装后直接打开。",
            "code": ""
          },
          {
            "text": "CLI：在终端运行官方安装脚本。",
            "code": "curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash"
          }
        ],
        "windows": [
          {
            "text": "桌面端：去 Hermes 官网下载 Windows 安装包。",
            "code": ""
          },
          {
            "text": "PowerShell 一键安装：",
            "code": "iex (irm https://hermes-agent.nousresearch.com/install.ps1)"
          }
        ],
        "verify": [
          "桌面端能正常打开，并进入设置或聊天界面。",
          "CLI 能运行 hermes 或 hermes setup。",
          "配置模型后，发送一句“你好，帮我列一个安装检查清单”，能得到回复。"
        ],
        "deepseek": [
          "运行 hermes setup。",
          "选择 Quick Setup。",
          "Provider 选择 DeepSeek。",
          "API Key 粘贴你的 DeepSeek Key。",
          "Base URL 填 https://api.deepseek.com。",
          "模型选择 deepseek-chat、deepseek-reasoner，或官方教程中当前推荐的模型名。"
        ],
        "errors": [
          "命令无法识别：关闭终端重新打开，或检查安装目录是否进了 PATH。",
          "401/鉴权失败：API Key 复制错了，或 Key 前后多了空格。",
          "请求超时：先确认网络，再确认 Base URL 没写错。"
        ],
        "sources": [
          [
            "Hermes Agent Docs",
            "https://hermes-agent.nousresearch.com/docs/"
          ],
          [
            "Hermes GitHub",
            "https://github.com/NousResearch/hermes-agent"
          ],
          [
            "DeepSeek Hermes 接入",
            "https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/hermes"
          ]
        ]
      }
    },
    {
      "title": "OpenAI Codex",
      "group": "HOT / OFFICIAL",
      "summary": "OpenAI 官方代码 Agent，适合让 AI 在本地项目里读代码、改代码、跑命令、做 review。它有 App、CLI、IDE Extension、Web 等形态，小白优先从 App 或 CLI 入门。",
      "cover_url": "",
      "link_url": "https://developers.openai.com/codex/",
      "tags": [
        "Mac",
        "Windows",
        "CLI",
        "IDE"
      ],
      "difficulty": "入门友好",
      "model": "OpenAI 官方模型 / ChatGPT 登录 / OpenAI API Key",
      "success": "终端能输出 codex --version，或 Codex App 能登录并打开项目。",
      "guide": {
        "quick": [
          "先确定你要用哪种形态：App 更像桌面软件，CLI 更适合终端，IDE Extension 更适合 VS Code 类编辑器。",
          "Mac/Linux/WSL 可以用 OpenAI 官方脚本安装 CLI。",
          "Windows 可以用官方 PowerShell 脚本，也可以用 Codex Windows App。",
          "安装后运行 codex，按提示用 ChatGPT 账号或 OpenAI API Key 登录。"
        ],
        "what": "Codex 是 OpenAI 官方的软件开发 Agent。它可以在你授权的项目文件夹里读文件、改代码、运行测试，并把过程留在可审查的线程中。",
        "fit": "适合做网站、写代码、修 bug、读项目、自动化重构的人。纯小白可以先用 App，看得见项目和线程；熟悉终端后再用 CLI。",
        "prepare": [
          "准备 ChatGPT 账号，或 OpenAI Platform API Key。",
          "Windows 推荐 Windows 11；Windows 10 需要较新的版本。",
          "如果项目依赖 Git、Node、Python 等工具，需要按项目本身要求安装。Codex 不是替你安装所有开发环境的魔法盒。"
        ],
        "mac": [
          {
            "text": "安装 Codex CLI：",
            "code": "curl -fsSL https://chatgpt.com/codex/install.sh | sh"
          },
          {
            "text": "启动并登录：",
            "code": "codex"
          },
          {
            "text": "如果要从 CLI 打开桌面 App，可以使用：",
            "code": "codex app"
          }
        ],
        "windows": [
          {
            "text": "PowerShell 安装 Codex CLI：",
            "code": "irm https://chatgpt.com/codex/install.ps1 | iex"
          },
          {
            "text": "也可以安装 Codex Windows App；如果你偏 Linux 开发，先装 WSL，再在 WSL 里跑 Linux 安装脚本。",
            "code": "wsl --install\nwsl\ncurl -fsSL https://chatgpt.com/codex/install.sh | sh\ncodex"
          },
          {
            "text": "Windows 上如果要配 Git，建议：",
            "code": "winget install Git.Git"
          }
        ],
        "verify": [
          "终端运行 codex --version，能看到版本号。",
          "运行 codex doctor，检查本地安装、认证、运行环境是否正常。",
          "进入一个项目目录运行 codex，问它“请解释这个项目结构”，能得到项目级回答。"
        ],
        "deepseek": [
          "Codex 官方默认服务 OpenAI 模型，不建议把第三方非官方中转教程写成主路径。",
          "如果只想使用 DeepSeek，优先看 Hermes、OpenClaw、DeepCode、Nanobot 等支持自定义模型的工具。",
          "需要用 OpenAI API Key 登录 Codex 时，去 OpenAI Dashboard 创建 Key。DeepSeek Key 不是 OpenAI Key，不能混用。"
        ],
        "errors": [
          "登录打不开浏览器：尝试 codex login --device-auth。",
          "Windows 权限或沙箱失败：先跑 codex doctor，看是不是 Git、winget、沙箱权限或企业策略问题。",
          "项目命令跑不起来：先手动在终端运行 npm install、npm test 等项目命令，确认本地开发环境本身可用。"
        ],
        "sources": [
          [
            "OpenAI Codex Docs",
            "https://developers.openai.com/codex/"
          ],
          [
            "OpenAI API Keys",
            "https://platform.openai.com/api-keys"
          ],
          [
            "Codex Open Source",
            "https://github.com/openai/codex"
          ]
        ]
      }
    },
    {
      "title": "Claude Code",
      "group": "HOT / OVERSEAS",
      "summary": "Anthropic 官方命令行代码 Agent，适合在终端里让 Claude 读项目、改文件、跑测试。它非常适合代码任务，但账号权限和终端环境要提前准备好。",
      "cover_url": "",
      "link_url": "https://code.claude.com/docs/en/setup.md",
      "tags": [
        "Mac",
        "Windows",
        "WSL",
        "Code"
      ],
      "difficulty": "入门偏中等",
      "model": "Claude 官方模型 / 账号订阅或 Console",
      "success": "运行 claude --version 和 claude doctor 正常，进入项目后能发起对话。",
      "guide": {
        "quick": [
          "Mac/Linux/WSL 用官方 install.sh；Windows 原生用官方 PowerShell 脚本。",
          "Windows 如果要更像 Linux 开发，推荐装 WSL；原生 Windows 建议装 Git for Windows。",
          "安装后运行 claude，按提示登录。",
          "进入项目目录，先问“请阅读这个项目并总结结构”，确认它能读到当前项目。"
        ],
        "what": "Claude Code 是 Anthropic 官方的终端代码 Agent。它不是普通聊天框，而是可以在你的项目目录里执行读写、搜索、测试等开发动作的 CLI 工具。",
        "fit": "适合写代码、修 bug、重构、读老项目的人。它更适合愿意使用终端的人；如果完全不碰终端，学习成本会比网页工具高。",
        "prepare": [
          "准备支持 Claude Code 的 Anthropic/Claude 账号权限。",
          "Windows 原生环境建议安装 Git for Windows，因为很多项目命令依赖 Git Bash 或常见 Unix 工具。",
          "如果使用 WSL，请在 WSL 里面安装 Claude Code，不要 Windows 装一份、WSL 又混用一份。"
        ],
        "mac": [
          {
            "text": "官方一键安装：",
            "code": "curl -fsSL https://claude.ai/install.sh | bash"
          },
          {
            "text": "Homebrew 方式：",
            "code": "brew install --cask claude-code"
          },
          {
            "text": "启动：",
            "code": "claude"
          }
        ],
        "windows": [
          {
            "text": "PowerShell 官方安装：",
            "code": "irm https://claude.ai/install.ps1 | iex"
          },
          {
            "text": "WinGet 方式：",
            "code": "winget install Anthropic.ClaudeCode"
          },
          {
            "text": "如果使用 CMD：",
            "code": "curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd"
          }
        ],
        "verify": [
          "运行 claude --version，确认版本号。",
          "运行 claude doctor，检查终端、登录和运行环境。",
          "在项目目录运行 claude，能进入交互界面。"
        ],
        "deepseek": [
          "Claude Code 官方主路径使用 Claude 模型，不把 DeepSeek 当作官方默认模型。",
          "如果目标是 Claude Code 风格但使用 DeepSeek，可以看 DeepSeek 官方 Coding Agents 文档中列出的兼容工具或代理方案。",
          "不建议小白一开始就用非官方中转改 Claude Code 模型，容易卡在鉴权和 Base URL。"
        ],
        "errors": [
          "Windows 脚本无法运行：用管理员 PowerShell，或检查执行策略提示。",
          "找不到 claude 命令：重开终端，确认安装目录在 PATH。",
          "登录失败：确认账号套餐或 Console 权限支持 Claude Code。"
        ],
        "sources": [
          [
            "Claude Code Setup",
            "https://code.claude.com/docs/en/setup.md"
          ],
          [
            "Claude Code Overview",
            "https://code.claude.com/docs/en/overview.md"
          ],
          [
            "DeepSeek Coding Agents",
            "https://api-docs.deepseek.com/zh-cn/guides/coding_agents"
          ]
        ]
      }
    },
    {
      "title": "腾讯元器",
      "group": "CHINA / NO-CODE",
      "summary": "腾讯面向普通用户的智能体创建平台，适合不写代码做一个问答助手、知识库助手或微信生态入口。它更像“搭一个可发布的 Agent”，不是本地代码工具。",
      "cover_url": "",
      "link_url": "https://yuanqi.tencent.com/",
      "tags": [
        "Web",
        "No-Code",
        "微信",
        "国内"
      ],
      "difficulty": "入门友好",
      "model": "腾讯生态模型 / 平台内模型",
      "success": "能创建一个智能体，并在预览窗口得到稳定回复。",
      "guide": {
        "quick": [
          "打开腾讯元器官网并登录。",
          "新建智能体，先写清角色：它帮谁、解决什么问题、不能做什么。",
          "上传知识或配置问答能力。",
          "在预览区问 3 个真实问题，确认回答能用，再发布。"
        ],
        "what": "腾讯元器是一个低代码/无代码智能体平台。它的重点不是安装到电脑，而是在网页里创建、调试和发布一个 Agent。",
        "fit": "适合公众号、客服、社群问答、知识库助手、小程序或微信生态里的轻量智能体。",
        "prepare": [
          "准备腾讯账号。",
          "准备智能体说明：目标用户、回答范围、语气、禁止事项。",
          "如果要做知识库，提前整理 PDF、文档或问答资料。"
        ],
        "mac": [
          {
            "text": "Mac 不需要本地安装，用浏览器打开官网即可。",
            "code": "https://yuanqi.tencent.com/"
          }
        ],
        "windows": [
          {
            "text": "Windows 同样使用浏览器；建议用 Chrome、Edge 或腾讯官方推荐浏览器。",
            "code": "https://yuanqi.tencent.com/"
          }
        ],
        "verify": [
          "智能体能创建成功。",
          "预览区能连续回答问题。",
          "如果接入微信或其他渠道，发布后用真实入口测试一次。"
        ],
        "deepseek": [
          "元器以平台内模型和腾讯生态能力为主；是否支持外部模型以后台当前配置为准。",
          "如果明确要用 DeepSeek API，自建网页/后端或用支持自定义模型的 Agent 工具会更直接。"
        ],
        "errors": [
          "回答跑偏：先改角色提示词和知识边界，不要急着换模型。",
          "知识库命中差：把资料拆成结构更清晰的文档，标题写具体。",
          "发布后访问不了：检查发布渠道权限和账号认证状态。"
        ],
        "sources": [
          [
            "腾讯元器",
            "https://yuanqi.tencent.com/"
          ],
          [
            "创建第一个智能体",
            "https://yuanqi.tencent.com/guide/agent-build-first-agent"
          ],
          [
            "微信智能体指南",
            "https://yuanqi.tencent.com/guide/agent-build-wechat-agent"
          ]
        ]
      }
    },
    {
      "title": "扣子 Coze",
      "group": "CHINA / WORKFLOW",
      "summary": "字节系智能体搭建平台，适合做聊天机器人、工作流、多 Agent 和工具调用。它偏产品化，适合小白从模板开始，也适合进阶用户做流程编排。",
      "cover_url": "",
      "link_url": "https://www.coze.cn/",
      "tags": [
        "Web",
        "Workflow",
        "Multi-Agent",
        "国内"
      ],
      "difficulty": "入门友好",
      "model": "扣子平台模型 / 火山方舟生态",
      "success": "能创建 Bot，添加工作流或知识库，并在预览里完成一次任务。",
      "guide": {
        "quick": [
          "打开扣子官网并登录。",
          "新建 Bot，先选择模板或空白智能体。",
          "补充人设、技能、知识库和工作流。",
          "预览测试 3 个真实任务，再考虑发布到目标渠道。"
        ],
        "what": "扣子 Coze 是一个 Agent/Bot 创建平台，核心能力包括角色设定、插件、工作流、知识库和多 Agent 编排。",
        "fit": "适合做个人助手、内容助手、客服助手、运营流程助手，以及需要调用工具或工作流的 Agent。",
        "prepare": [
          "准备手机号或平台账号。",
          "准备智能体要解决的任务列表。",
          "如果要使用知识库，先整理资料；如果要使用 API，先准备接口说明。"
        ],
        "mac": [
          {
            "text": "Mac 用浏览器进入扣子官网，无需本地安装。",
            "code": "https://www.coze.cn/"
          }
        ],
        "windows": [
          {
            "text": "Windows 用浏览器进入扣子官网，无需本地安装。",
            "code": "https://www.coze.cn/"
          }
        ],
        "verify": [
          "Bot 能保存并进入预览。",
          "工作流节点能成功运行。",
          "发布渠道里能收到 Bot 回复。"
        ],
        "deepseek": [
          "扣子的可选模型和外部模型能力以平台当前开放情况为准。",
          "如果只是想体验 DeepSeek API，先看本页 DeepSeek API 基础设施卡，再选择支持自定义 Base URL 的 Agent。"
        ],
        "errors": [
          "工作流失败：先单独测试每个节点，再串起来。",
          "知识库答非所问：检查知识库是否被启用，问题是否能命中文档关键词。",
          "发布失败：检查渠道授权和平台审核要求。"
        ],
        "sources": [
          [
            "扣子 Coze",
            "https://www.coze.cn/"
          ],
          [
            "Coze Agent Overview",
            "https://docs.coze.cn/guides_agent_overview"
          ],
          [
            "火山引擎豆包",
            "https://www.volcengine.com/product/doubao"
          ]
        ]
      }
    },
    {
      "title": "阿里百炼 Agent",
      "group": "CHINA / CLOUD",
      "summary": "阿里云百炼的智能体应用平台，适合企业或开发者做知识库问答、流程助手和可集成的 Agent 应用。它更像云端 Agent 平台，适合和阿里云生态结合。",
      "cover_url": "",
      "link_url": "https://www.alibabacloud.com/help/zh/model-studio/single-agent-application",
      "tags": [
        "Web",
        "Cloud",
        "API",
        "国内"
      ],
      "difficulty": "中等",
      "model": "通义千问 / 百炼模型 / 阿里云生态",
      "success": "能在百炼控制台创建单 Agent 应用，并完成一次预览调用。",
      "guide": {
        "quick": [
          "登录阿里云百炼控制台。",
          "创建单 Agent 应用，选择模型和应用模板。",
          "配置提示词、知识库或工具。",
          "在控制台预览测试，再生成 API 或发布入口。"
        ],
        "what": "阿里百炼 Agent 是阿里云 Model Studio 里的智能体应用能力，适合把模型、知识库、工具调用和企业系统连接起来。",
        "fit": "适合已有阿里云账号、想做企业知识库、客服、内部流程助手或可 API 集成应用的人。",
        "prepare": [
          "准备阿里云账号并完成必要认证。",
          "开通百炼/Model Studio 相关服务。",
          "准备模型调用额度、知识库资料和应用说明。"
        ],
        "mac": [
          {
            "text": "控制台方式不需要本地安装，用浏览器打开百炼控制台。",
            "code": "https://bailian.console.aliyun.com/"
          }
        ],
        "windows": [
          {
            "text": "Windows 同样用浏览器；如使用百炼 CLI，再按官方 install.md 配置。",
            "code": "https://bailian.console.aliyun.com/"
          }
        ],
        "verify": [
          "应用能保存成功。",
          "预览窗口能回答问题。",
          "如果启用 API，能用官方示例发起一次调用。"
        ],
        "deepseek": [
          "百炼主要服务阿里云模型和平台能力；外部模型接入以控制台当前支持为准。",
          "如果你只想用 DeepSeek，先获取 DeepSeek API Key，再选支持自定义 provider 的 Agent。"
        ],
        "errors": [
          "没有权限：检查阿里云账号实名认证、RAM 权限和服务开通状态。",
          "调用失败：检查模型是否开通、额度是否充足。",
          "知识库不可用：确认文档已解析完成并绑定到应用。"
        ],
        "sources": [
          [
            "阿里百炼单 Agent 应用",
            "https://www.alibabacloud.com/help/zh/model-studio/single-agent-application"
          ],
          [
            "阿里云百炼 CLI 说明",
            "https://bailian.aliyun.com/cli/install.md"
          ],
          [
            "通义灵码",
            "https://lingma.aliyun.com/"
          ]
        ]
      }
    },
    {
      "title": "Trae",
      "group": "CODE / IDE",
      "summary": "字节系 AI IDE/代码助手，适合想在编辑器里直接写代码、改代码、理解项目的人。它比网页 Agent 更接近开发工具，适合网站和应用开发。",
      "cover_url": "",
      "link_url": "https://www.trae.ai/",
      "tags": [
        "Mac",
        "Windows",
        "IDE",
        "国内"
      ],
      "difficulty": "入门友好",
      "model": "平台内模型 / 部分版本支持自定义能力",
      "success": "能打开项目，并让 AI 解释或修改一个文件。",
      "guide": {
        "quick": [
          "打开 Trae 官网，下载对应系统安装包。",
          "安装后打开一个代码项目文件夹。",
          "登录账号，选择可用模型。",
          "让它解释当前项目结构，确认能读到文件。"
        ],
        "what": "Trae 是 AI 原生 IDE/代码工具，重点是把 Agent 能力放进编码环境里，帮助你理解、生成和修改代码。",
        "fit": "适合做网页、App、脚本和项目开发的人；小白可以把它当作“带 AI 的编辑器”。",
        "prepare": [
          "准备一个代码项目文件夹。",
          "如果项目是前端，提前安装 Node.js；如果是 Python 项目，提前安装 Python。",
          "准备账号登录。"
        ],
        "mac": [
          {
            "text": "去官网下载 macOS 安装包，拖入 Applications 后打开。",
            "code": "https://www.trae.ai/"
          }
        ],
        "windows": [
          {
            "text": "去官网下载 Windows 安装包，按向导安装。国内版本可同时关注 trae.com.cn。",
            "code": "https://www.trae.ai/"
          }
        ],
        "verify": [
          "能打开项目目录。",
          "AI 面板能识别当前文件。",
          "让它修改一个小文案或解释函数，能给出可用结果。"
        ],
        "deepseek": [
          "Trae 的模型选择以当前版本开放为准。",
          "如果支持自定义模型，按它的模型设置页填入 DeepSeek API Key 和 Base URL。"
        ],
        "errors": [
          "项目跑不起来：这通常是项目依赖问题，先在终端安装依赖。",
          "AI 不知道当前文件：确认你打开的是项目文件夹，不是单个孤立文件。",
          "登录失败：切换国内/国际版本入口再试。"
        ],
        "sources": [
          [
            "Trae",
            "https://www.trae.ai/"
          ],
          [
            "Trae 中国站",
            "https://www.trae.com.cn/"
          ],
          [
            "MarsCode",
            "https://www.marscode.com/"
          ]
        ]
      }
    },
    {
      "title": "通义灵码",
      "group": "CODE / CHINA",
      "summary": "阿里推出的 AI 编程助手，适合在 IDE 里补全、问答、生成单测、解释代码。它更像国内开发者常用的代码助手，不是完整工作流平台。",
      "cover_url": "",
      "link_url": "https://lingma.aliyun.com/",
      "tags": [
        "IDE",
        "VS Code",
        "JetBrains",
        "国内"
      ],
      "difficulty": "入门友好",
      "model": "通义系列模型",
      "success": "IDE 里能登录通义灵码，并出现代码补全或问答回复。",
      "guide": {
        "quick": [
          "打开通义灵码官网。",
          "按你的编辑器选择 VS Code、JetBrains 等插件。",
          "安装插件后登录阿里账号。",
          "打开项目，测试代码补全和侧边栏问答。"
        ],
        "what": "通义灵码是阿里面向开发者的 AI 编码助手，主要能力是代码补全、代码解释、生成、测试和研发问答。",
        "fit": "适合中国开发者、学生、前端/后端程序员，尤其适合已经在 VS Code 或 JetBrains 里写代码的人。",
        "prepare": [
          "准备 VS Code、Cursor、JetBrains 系列 IDE 或官方支持的编辑器。",
          "准备阿里账号。",
          "打开一个真实代码项目测试，效果比空文件更容易判断。"
        ],
        "mac": [
          {
            "text": "在你的 IDE 插件市场搜索“通义灵码”，或从官网下载入口跳转安装。",
            "code": "https://lingma.aliyun.com/"
          }
        ],
        "windows": [
          {
            "text": "Windows 同样从 IDE 插件市场安装，安装后重启 IDE 并登录。",
            "code": "https://lingma.aliyun.com/"
          }
        ],
        "verify": [
          "插件图标出现在 IDE 侧边栏。",
          "能成功登录。",
          "输入注释或函数名后能触发补全。"
        ],
        "deepseek": [
          "通义灵码主要使用通义模型，不把 DeepSeek 作为默认接入路径。",
          "如果想用 DeepSeek 写代码，优先看 DeepCode、OpenClaw、Hermes。"
        ],
        "errors": [
          "插件安装后不显示：重启 IDE，检查插件是否启用。",
          "补全不出现：确认当前文件类型受支持，并登录成功。",
          "企业网络问题：检查代理或公司网络限制。"
        ],
        "sources": [
          [
            "通义灵码官网",
            "https://lingma.aliyun.com/"
          ],
          [
            "阿里云百炼",
            "https://bailian.console.aliyun.com/"
          ],
          [
            "阿里 Model Studio",
            "https://www.alibabacloud.com/help/zh/model-studio/"
          ]
        ]
      }
    },
    {
      "title": "OpenClaw / 龙虾",
      "group": "OPEN / CODE",
      "summary": "面向代码任务的开源 Agent 工具，适合想用 DeepSeek、OpenAI 或自定义模型跑本地编码任务的人。它更适合愿意折腾命令行和配置文件的用户。",
      "cover_url": "",
      "link_url": "https://api-docs.deepseek.com/zh-cn/guides/coding_agents",
      "tags": [
        "CLI",
        "Open Source",
        "DeepSeek",
        "Code"
      ],
      "difficulty": "中等",
      "model": "DeepSeek / OpenAI Compatible / 自定义 Base URL",
      "success": "能配置模型 Key，并让工具在项目里完成一次读文件或改文件任务。",
      "guide": {
        "quick": [
          "先看项目 README，确认当前推荐安装方式。",
          "准备 Node.js 或项目要求的运行环境。",
          "把 DeepSeek API Key 放到环境变量或配置文件。",
          "在一个测试项目里运行，让它解释项目结构。"
        ],
        "what": "OpenClaw/龙虾可以理解为偏开源路线的代码 Agent。它的价值在于更容易接 OpenAI Compatible 的模型服务，包括 DeepSeek 这类国产模型。",
        "fit": "适合想省模型成本、想使用国产模型、愿意看 README 和跑命令的开发者。",
        "prepare": [
          "准备 Git、Node.js 或 README 里要求的运行环境。",
          "准备 DeepSeek API Key。",
          "准备一个非重要项目先测试，避免一上来改正式项目。"
        ],
        "mac": [
          {
            "text": "按项目 README 的当前命令安装；如果是 npm 包，一般类似：",
            "code": "npm install -g <package-name>\n<command> --version"
          }
        ],
        "windows": [
          {
            "text": "Windows 建议使用 PowerShell 或 WSL。若项目依赖 Unix 工具，优先用 WSL。",
            "code": "wsl --install"
          }
        ],
        "verify": [
          "版本命令能输出。",
          "配置文件能读取 DeepSeek Key。",
          "在测试项目中能完成一次解释或小改动。"
        ],
        "deepseek": [
          "Base URL 使用 https://api.deepseek.com。",
          "模型名按工具当前文档填写 deepseek-chat 或 deepseek-reasoner。",
          "如果工具支持 OpenAI Compatible Provider，通常填 API Key、Base URL、Model 三项。"
        ],
        "errors": [
          "包名或命令变了：以官方 README 为准，不复制过期教程。",
          "模型报错：确认模型名和 Base URL。",
          "改坏项目：用 Git 提前提交或新建测试分支。"
        ],
        "sources": [
          [
            "DeepSeek Coding Agents",
            "https://api-docs.deepseek.com/zh-cn/guides/coding_agents"
          ],
          [
            "Awesome DeepSeek Agent",
            "https://github.com/deepseek-ai/awesome-deepseek-agent/blob/main/README.zh-CN.md"
          ],
          [
            "DeepSeek API Docs",
            "https://api-docs.deepseek.com/zh-cn/"
          ]
        ]
      }
    },
    {
      "title": "DeepSeek API Key",
      "group": "KEY / INFRA",
      "summary": "这不是一个普通 Agent，而是很多 Agent 接入国产模型的钥匙。先搞懂 API Key、Base URL 和模型名，后面 Hermes、OpenClaw、DeepCode 等教程都会顺很多。",
      "cover_url": "",
      "link_url": "https://api-docs.deepseek.com/zh-cn/",
      "tags": [
        "API",
        "DeepSeek",
        "基础设施",
        "必看"
      ],
      "difficulty": "入门友好",
      "model": "deepseek-chat / deepseek-reasoner",
      "success": "拿到 API Key，并知道 Base URL 是 https://api.deepseek.com。",
      "guide": {
        "quick": [
          "打开 DeepSeek 开放平台并登录。",
          "进入 API Keys 页面，新建一个 Key。",
          "复制后立刻保存到安全位置，之后页面通常不会再完整显示。",
          "记住三件事：API Key、Base URL、模型名。"
        ],
        "what": "DeepSeek API Key 是让第三方 Agent 调用 DeepSeek 模型的凭证。没有 Key，工具就不知道该用谁的额度、向哪个账号计费。",
        "fit": "适合想把 DeepSeek 接进 Hermes、OpenClaw、DeepCode、Nanobot、自己写的脚本或其他 OpenAI Compatible 工具的人。",
        "prepare": [
          "准备 DeepSeek 账号。",
          "准备可用余额或额度。",
          "准备一个安全的 Key 保存位置，不要发给别人。"
        ],
        "mac": [
          {
            "text": "Mac 上可以把 Key 临时放进终端环境变量。",
            "code": "export DEEPSEEK_API_KEY=\"你的 key\"\necho $DEEPSEEK_API_KEY"
          }
        ],
        "windows": [
          {
            "text": "Windows PowerShell 临时设置环境变量：",
            "code": "$env:DEEPSEEK_API_KEY=\"你的 key\"\necho $env:DEEPSEEK_API_KEY"
          }
        ],
        "verify": [
          "你能在控制台看到 Key 已创建。",
          "Base URL 记为 https://api.deepseek.com。",
          "工具里填 Key 后不再报 401。"
        ],
        "deepseek": [
          "常见三件套：API Key、Base URL、Model。",
          "Base URL：https://api.deepseek.com。",
          "聊天模型通常看 deepseek-chat；推理模型看 deepseek-reasoner；以官方模型页当前名称为准。"
        ],
        "errors": [
          "401：Key 错了、Key 被删了、复制时多了空格。",
          "余额不足：去控制台检查额度或充值。",
          "把 Key 发到公开仓库：立刻删除并重新生成新 Key。"
        ],
        "sources": [
          [
            "DeepSeek API Docs",
            "https://api-docs.deepseek.com/zh-cn/"
          ],
          [
            "DeepSeek Coding Agents",
            "https://api-docs.deepseek.com/zh-cn/guides/coding_agents"
          ],
          [
            "DeepSeek Agent Integrations",
            "https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/hermes"
          ]
        ]
      }
    },
    {
      "title": "DeepSeek 接入总教程",
      "group": "MODEL / BRIDGE",
      "summary": "一张卡讲清怎么把 DeepSeek 接到 Agent 工具里：看工具是否支持 OpenAI Compatible，填 API Key、Base URL、模型名，再做一次最小验证。",
      "cover_url": "",
      "link_url": "https://api-docs.deepseek.com/zh-cn/guides/coding_agents",
      "tags": [
        "DeepSeek",
        "OpenAI Compatible",
        "教程",
        "桥接"
      ],
      "difficulty": "入门偏中等",
      "model": "DeepSeek / 其他国产模型",
      "success": "任意一个 Agent 能用 DeepSeek 成功回复一次。",
      "guide": {
        "quick": [
          "先确认工具支持自定义模型或 OpenAI Compatible Provider。",
          "准备 API Key、Base URL、Model 三项。",
          "Base URL 填 https://api.deepseek.com。",
          "保存后问一个简单问题，再让它读一个测试文件。"
        ],
        "what": "这是国产模型接入 Agent 的通用方法。大部分支持 OpenAI Compatible 的工具，本质都是把请求发到一个兼容接口。",
        "fit": "适合已经有 DeepSeek Key，但不知道该填在哪里的人。",
        "prepare": [
          "确认你的 Agent 工具有 Model Provider、API Base、Base URL 或 OpenAI Compatible 设置项。",
          "准备 DeepSeek API Key。",
          "确认工具文档是否要求特殊模型名。"
        ],
        "mac": [
          {
            "text": "通用环境变量写法：",
            "code": "export DEEPSEEK_API_KEY=\"你的 key\"\nexport OPENAI_BASE_URL=\"https://api.deepseek.com\""
          }
        ],
        "windows": [
          {
            "text": "PowerShell 通用写法：",
            "code": "$env:DEEPSEEK_API_KEY=\"你的 key\"\n$env:OPENAI_BASE_URL=\"https://api.deepseek.com\""
          }
        ],
        "verify": [
          "先发一句普通聊天，看是否回复。",
          "再做一个低风险任务，比如总结 README。",
          "最后再让它改一个测试文件，不要一开始改正式项目。"
        ],
        "deepseek": [
          "Hermes：用 hermes setup 选择 DeepSeek。",
          "OpenClaw：按 README 填 OpenAI Compatible 配置。",
          "DeepCode/Nanobot：按 DeepSeek 官方集成文档安装和配置。"
        ],
        "errors": [
          "Base URL 写成网页地址：必须是 API 地址，不是 deepseek.com 首页。",
          "模型名过期：查官方模型列表。",
          "工具不支持自定义模型：换 Hermes、OpenClaw、DeepCode 等更适合的工具。"
        ],
        "sources": [
          [
            "DeepSeek Coding Agents",
            "https://api-docs.deepseek.com/zh-cn/guides/coding_agents"
          ],
          [
            "Hermes DeepSeek 接入",
            "https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/hermes"
          ],
          [
            "Awesome DeepSeek Agent",
            "https://github.com/deepseek-ai/awesome-deepseek-agent/blob/main/README.zh-CN.md"
          ]
        ]
      }
    },
    {
      "title": "DeepCode / Nanobot",
      "group": "DEEPSEEK / CLI",
      "summary": "DeepSeek 官方文档里提到的编码 Agent 集成方向，适合想直接围绕 DeepSeek 做终端代码任务的人。DeepCode 偏 coding CLI，Nanobot 偏轻量 Agent。",
      "cover_url": "",
      "link_url": "https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/deepcode",
      "tags": [
        "CLI",
        "DeepSeek",
        "Code",
        "Open"
      ],
      "difficulty": "中等",
      "model": "DeepSeek-V4 / DeepSeek API",
      "success": "deepcode 或 nanobot 版本命令正常，并能调用 DeepSeek 完成一次任务。",
      "guide": {
        "quick": [
          "先安装 Node.js 18+ 或 uv，取决于你选 DeepCode 还是 Nanobot。",
          "DeepCode 用 npm 全局安装。",
          "Nanobot 用 uv tool install。",
          "配置 DeepSeek API Key 后，在测试项目里运行一次。"
        ],
        "what": "DeepCode 和 Nanobot 都是更偏命令行的 Agent 工具。它们适合把 DeepSeek 作为主模型来完成代码或自动化任务。",
        "fit": "适合愿意使用终端、想用 DeepSeek 降低模型成本的开发者。",
        "prepare": [
          "DeepCode：准备 Node.js 18+。",
          "Nanobot：准备 uv。",
          "准备 DeepSeek API Key。"
        ],
        "mac": [
          {
            "text": "DeepCode：",
            "code": "npm install -g @vegamo/deepcode-cli\ndeepcode --version"
          },
          {
            "text": "Nanobot：",
            "code": "uv tool install nanobot-ai\nnanobot --version"
          }
        ],
        "windows": [
          {
            "text": "DeepCode：先装 Node.js LTS，再运行：",
            "code": "npm install -g @vegamo/deepcode-cli\ndeepcode --version"
          },
          {
            "text": "Nanobot：安装 uv 后运行；如果命令找不到，执行 uv tool update-shell 或把 .local/bin 加进 PATH。",
            "code": "uv tool install nanobot-ai\nuv tool update-shell"
          }
        ],
        "verify": [
          "版本命令能输出。",
          "DeepSeek API Key 能被工具读取。",
          "在测试目录里能完成一次 README 总结或小代码生成。"
        ],
        "deepseek": [
          "这些工具本来就围绕 DeepSeek 集成，重点是 Key、额度和模型名正确。",
          "如果调用失败，先用最简单 prompt 测试，不要直接跑复杂项目。"
        ],
        "errors": [
          "npm 权限错误：换 Node 版本管理器或修正全局 npm 权限。",
          "uv 命令找不到：重开终端或更新 PATH。",
          "模型调用失败：检查 DeepSeek Key、余额和网络。"
        ],
        "sources": [
          [
            "DeepCode 集成",
            "https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/deepcode"
          ],
          [
            "Nanobot 集成",
            "https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/nanobot"
          ],
          [
            "DeepSeek API Docs",
            "https://api-docs.deepseek.com/zh-cn/"
          ]
        ]
      }
    },
    {
      "title": "CloudBase AI Agent",
      "group": "TENCENT / API",
      "summary": "腾讯云 CloudBase 的 AI Agent 接入能力，适合把已经配置好的 Agent 通过 HTTP API 接到小程序、网页、客服或后端服务里。",
      "cover_url": "",
      "link_url": "https://docs.cloudbase.net/http-api/ai-bot/ai-agent-%E6%8E%A5%E5%85%A5",
      "tags": [
        "API",
        "腾讯云",
        "小程序",
        "SSE"
      ],
      "difficulty": "中等",
      "model": "腾讯云 Agent / 平台配置模型",
      "success": "拿到 Agent Token，并通过 HTTP API 收到一次 SSE 回复。",
      "guide": {
        "quick": [
          "先在腾讯云/CloudBase 创建或配置 Agent。",
          "获取接入 Token 或接口凭证。",
          "用官方 HTTP API 示例发起请求。",
          "确认前端或后端能处理 SSE 流式返回。"
        ],
        "what": "CloudBase AI Agent 更偏开发集成，不是普通网页聊天工具。它让你把腾讯云里的 Agent 接进自己的应用。",
        "fit": "适合做小程序、网页客服、企业应用、后端 API 集成的人。",
        "prepare": [
          "腾讯云账号和 CloudBase 环境。",
          "已配置好的 Agent。",
          "能发 HTTP 请求的前端或后端项目。"
        ],
        "mac": [
          {
            "text": "Mac 不需要安装专门客户端；用浏览器配置平台，用 curl 或项目代码测试 API。",
            "code": "curl --version"
          }
        ],
        "windows": [
          {
            "text": "Windows 用浏览器配置平台；API 测试可用 PowerShell、Postman 或项目代码。",
            "code": "curl --version"
          }
        ],
        "verify": [
          "接口返回 200。",
          "能收到流式文本。",
          "应用前端能正确展示回复。"
        ],
        "deepseek": [
          "CloudBase 主要跟腾讯云内的 Agent 配置绑定。",
          "若后台 Agent 支持外部模型，再按平台模型配置页处理；否则不要强行把 DeepSeek Key 塞进 HTTP 接入层。"
        ],
        "errors": [
          "401/403：Token、环境 ID 或权限错误。",
          "前端没有流式显示：检查 SSE 解析。",
          "跨域失败：把调用放后端，或按 CloudBase 文档配置域名。"
        ],
        "sources": [
          [
            "CloudBase AI Agent 接入",
            "https://docs.cloudbase.net/http-api/ai-bot/ai-agent-%E6%8E%A5%E5%85%A5"
          ],
          [
            "腾讯云 CloudBase",
            "https://cloud.tencent.com/product/tcb"
          ],
          [
            "腾讯云 ADP",
            "https://cloud.tencent.com/product/adp"
          ]
        ]
      }
    },
    {
      "title": "腾讯云 ADP",
      "group": "TENCENT / ENTERPRISE",
      "summary": "腾讯云智能体开发平台，适合企业做 RAG、Workflow、多 Agent 和业务系统集成。它更偏企业级平台，不是个人本地安装软件。",
      "cover_url": "",
      "link_url": "https://cloud.tencent.com/product/adp",
      "tags": [
        "Cloud",
        "RAG",
        "Workflow",
        "企业"
      ],
      "difficulty": "中等偏高",
      "model": "腾讯云模型 / 企业模型配置",
      "success": "能在控制台创建应用，并完成一次知识库或工作流测试。",
      "guide": {
        "quick": [
          "打开腾讯云 ADP 产品页，进入控制台。",
          "创建智能体应用，选择模型、知识库或工作流。",
          "配置测试数据。",
          "在控制台完成一次端到端预览。"
        ],
        "what": "ADP 是腾讯云面向企业的智能体开发平台，重点在 RAG、Workflow、多 Agent 协作和业务集成。",
        "fit": "适合企业知识库、内部流程自动化、客服、数据查询和业务系统集成。",
        "prepare": [
          "腾讯云账号和相关权限。",
          "企业资料、知识库或业务 API。",
          "明确 Agent 的业务边界和上线渠道。"
        ],
        "mac": [
          {
            "text": "使用浏览器进入腾讯云控制台，无需本地安装。",
            "code": "https://cloud.tencent.com/product/adp"
          }
        ],
        "windows": [
          {
            "text": "Windows 同样使用浏览器进入控制台。",
            "code": "https://cloud.tencent.com/product/adp"
          }
        ],
        "verify": [
          "应用能创建成功。",
          "知识库检索或工作流节点能跑通。",
          "能拿到发布或 API 集成方式。"
        ],
        "deepseek": [
          "ADP 的模型接入以腾讯云平台当前能力为准。",
          "企业场景优先考虑平台支持、合规和权限，不建议小白自行中转模型。"
        ],
        "errors": [
          "权限不够：联系腾讯云主账号或管理员开权限。",
          "知识库效果差：先优化文档结构和切分策略。",
          "成本不清楚：上线前看清模型调用、存储和流量计费。"
        ],
        "sources": [
          [
            "腾讯云 ADP",
            "https://cloud.tencent.com/product/adp"
          ],
          [
            "ADP 官网",
            "https://adp.tencentcloud.com/zh"
          ],
          [
            "腾讯云",
            "https://cloud.tencent.com/"
          ]
        ]
      }
    },
    {
      "title": "AutoGLM",
      "group": "ZHIPU / OPEN",
      "summary": "智谱生态的 Agent/自动化方向工具，适合研究 GUI Agent、自动操作和国产模型智能体能力。它更偏实验和开发者，不是最小白的第一站。",
      "cover_url": "",
      "link_url": "https://github.com/zai-org/Open-AutoGLM",
      "tags": [
        "Open Source",
        "GUI",
        "国产模型",
        "实验"
      ],
      "difficulty": "中等偏高",
      "model": "GLM / BigModel / 兼容模型",
      "success": "能安装示例项目，并让它完成一次安全的演示任务。",
      "guide": {
        "quick": [
          "先阅读 GitHub README，确认当前推荐环境。",
          "准备 Python 环境和模型 API Key。",
          "如果使用 AutoGLM-GUI，可先 pip 安装包进行体验。",
          "只在测试环境运行自动操作任务。"
        ],
        "what": "AutoGLM 是智谱生态里围绕自动化和 GUI Agent 的方向。它适合研究 Agent 如何操作界面、完成多步骤任务。",
        "fit": "适合开发者、研究者、想了解国产 GUI Agent 的人；不建议完全小白一上来就作为主力工具。",
        "prepare": [
          "准备 Python 环境。",
          "准备 BigModel/智谱或兼容模型 API Key。",
          "准备一个安全测试环境，不要让它直接操作重要账号。"
        ],
        "mac": [
          {
            "text": "以 AutoGLM-GUI 为例，可先尝试：",
            "code": "pip install autoglm-gui\nautoglm-gui --help"
          }
        ],
        "windows": [
          {
            "text": "Windows 先安装 Python，再用 PowerShell 或 CMD 安装。",
            "code": "pip install autoglm-gui\nautoglm-gui --help"
          }
        ],
        "verify": [
          "包能安装成功。",
          "help 命令能输出。",
          "配置 Key 后能跑官方示例。"
        ],
        "deepseek": [
          "AutoGLM 更偏 GLM/BigModel 生态。",
          "部分 GUI 包支持 base-url 参数时，可以尝试兼容模型，但要以项目说明为准。"
        ],
        "errors": [
          "Python 版本不对：按 README 指定版本创建虚拟环境。",
          "GUI 权限问题：检查系统辅助功能或屏幕录制权限。",
          "模型不兼容：先用官方推荐模型跑通，再尝试其他模型。"
        ],
        "sources": [
          [
            "Open-AutoGLM",
            "https://github.com/zai-org/Open-AutoGLM"
          ],
          [
            "AutoGLM-GUI",
            "https://github.com/suyiiyii/AutoGLM-GUI"
          ],
          [
            "智谱开放平台",
            "https://open.bigmodel.cn/"
          ]
        ]
      }
    }
  ]

};

const placeholderStaticPages = new Set(["useful-websites", "prompt-collection", "skill-workflow"]);

const els = {
  loginPanel: document.querySelector("#loginPanel"),
  adminPanel: document.querySelector("#adminPanel"),
  loginForm: document.querySelector("#loginForm"),
  logoutButton: document.querySelector("#logoutButton"),
  sessionEmail: document.querySelector("#sessionEmail"),
  statusLine: document.querySelector("#statusLine"),
  pageFilter: document.querySelector("#pageFilter"),
  contentSummary: document.querySelector("#contentSummary"),
  pageStatusGrid: document.querySelector("#pageStatusGrid"),
  contentPageForm: document.querySelector("#contentPageForm"),
  recommendationForm: document.querySelector("#recommendationForm"),
  recommendationList: document.querySelector("#recommendationList"),
  resetRecommendation: document.querySelector("#resetRecommendation"),
  importStaticCards: document.querySelector("#importStaticCards"),
  normalizeSortOrder: document.querySelector("#normalizeSortOrder"),
  bulkImportJson: document.querySelector("#bulkImportJson"),
  bulkImportCards: document.querySelector("#bulkImportCards"),
  clearBulkImport: document.querySelector("#clearBulkImport"),
  profileForm: document.querySelector("#profileForm"),
  coverUpload: document.querySelector("#coverUpload"),
  coverUploadInfo: document.querySelector("#coverUploadInfo"),
  coverUploadProgress: document.querySelector("#coverUploadProgress"),
  coverPreview: document.querySelector("#coverPreview"),
  avatarUpload: document.querySelector("#avatarUpload"),
  avatarUploadInfo: document.querySelector("#avatarUploadInfo"),
  avatarUploadProgress: document.querySelector("#avatarUploadProgress"),
  avatarPreview: document.querySelector("#avatarPreview"),
  realPhotoUpload: document.querySelector("#realPhotoUpload"),
  realPhotoUploadInfo: document.querySelector("#realPhotoUploadInfo"),
  realPhotoUploadProgress: document.querySelector("#realPhotoUploadProgress"),
  realPhotoPreview: document.querySelector("#realPhotoPreview"),
  dynamicFields: document.querySelector("#dynamicFields"),
  recommendationsView: document.querySelector("#recommendationsView"),
  profileView: document.querySelector("#profileView"),
};

let currentSession = null;
let contentPages = [];
let contentItems = [];
const fallbackAdminEmails = new Set(["fengyuaimengyu@outlook.com"]);
const MAX_UPLOAD_BYTES = 190 * 1024 * 1024;
const objectUrls = new Set();

function setStatus(message, isError = false) {
  els.statusLine.textContent = message;
  els.statusLine.style.color = isError ? "#b00020" : "";
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatBytes(bytes = 0) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function uploadLabel(file) {
  if (!file) return "未选择文件";
  return `${file.name} · ${formatBytes(file.size)}`;
}

function assertUploadFile(file) {
  if (!file) return;
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`文件太大了：${formatBytes(file.size)}。当前存储桶单文件建议控制在 190 MB 以内。`);
  }
}

function mediaElement(url, mime = "") {
  const isVideo = mime.startsWith("video/") || /\.(mp4|webm)(\?|$)/i.test(url);
  if (isVideo) return `<video src="${escapeHtml(url)}" muted playsinline controls preload="metadata"></video>`;
  return `<img src="${escapeHtml(url)}" alt="">`;
}

function renderUploadPreview(preview, url, meta = {}) {
  if (!preview || !url) return;
  preview.hidden = false;
  preview.innerHTML = `
    ${mediaElement(url, meta.type || "")}
    <div class="media-preview__meta">
      <strong>${escapeHtml(meta.title || "当前预览")}</strong>
      ${meta.detail ? `<span>${escapeHtml(meta.detail)}</span>` : ""}
      <code>${escapeHtml(meta.url || url)}</code>
    </div>
  `;
}

function clearUploadPreview(preview, info) {
  if (preview) {
    preview.hidden = true;
    preview.innerHTML = "";
  }
  if (info) info.textContent = "未选择文件";
}

function previewSelectedFile(file, preview, info, title) {
  if (!file) return;
  assertUploadFile(file);
  const url = URL.createObjectURL(file);
  objectUrls.add(url);
  if (info) info.textContent = `${uploadLabel(file)} · 正在上传...`;
  renderUploadPreview(preview, url, {
    title,
    detail: "本地预览，上传成功后会替换成公网地址。",
    type: file.type,
    url: file.name,
  });
}

function updateUploadedFilePreview(url, file, preview, info, title) {
  if (info) info.textContent = `${uploadLabel(file)} · 上传完成`;
  renderUploadPreview(preview, url, {
    title,
    detail: "已上传到 Supabase Storage。",
    type: file?.type || "",
    url,
  });
}

function renderUrlPreview(url, preview, title) {
  const clean = String(url || "").trim();
  if (!clean) {
    clearUploadPreview(preview);
    return;
  }
  renderUploadPreview(preview, clean, {
    title,
    detail: "当前 URL 预览。",
    url: clean,
  });
}

function parseJson(value, fallback) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return fallback;
  return JSON.parse(trimmed);
}

function parseTags(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function linesValue(value) {
  return Array.isArray(value) ? value.join("\n") : String(value || "");
}

function csvValue(value) {
  return Array.isArray(value) ? value.join(", ") : String(value || "");
}

function currentPageKey() {
  return els.pageFilter.value;
}

function currentConfig() {
  return pageConfigs[currentPageKey()];
}

function nextSortOrderForCurrentPage() {
  const maxSortOrder = contentItems
    .filter((item) => item.page_key === currentPageKey())
    .reduce((max, item) => Math.max(max, Number(item.sort_order || 0)), 0);
  return maxSortOrder + 10;
}

function fallbackPage(pageKey) {
  const config = pageConfigs[pageKey];
  return {
    page_key: pageKey,
    title: config.defaultTitle,
    intro: config.defaultIntro,
    layout_type: config.defaultLayout,
    settings: config.defaultSettings,
    is_enabled: true,
  };
}

function activePage() {
  return contentPages.find((page) => page.page_key === currentPageKey()) || fallbackPage(currentPageKey());
}

function fillPageSelect(select) {
  select.innerHTML = recommendationPages
    .map((page) => `<option value="${page.key}">${page.label}</option>`)
    .join("");
}

function fillItemTypeSelect() {
  const select = els.recommendationForm.elements.item_type;
  select.innerHTML = currentConfig().itemTypes
    .map((type) => `<option value="${type.value}">${type.label}</option>`)
    .join("");
}

function mediaMarkup(url) {
  if (!url) return "";
  if (/\.(mp4|webm)(\?|$)/i.test(url)) {
    return `<video src="${escapeHtml(url)}" muted playsinline preload="metadata"></video>`;
  }
  return `<img src="${escapeHtml(url)}" alt="">`;
}

function summarizeItems(items) {
  const published = items.filter((item) => item.is_published).length;
  const hidden = items.length - published;
  return [
    { label: "全部卡片", value: items.length },
    { label: "已发布", value: published },
    { label: "已隐藏", value: hidden },
  ];
}

function updateImportButtonState(items) {
  if (!els.importStaticCards) return;

  const pageKey = currentPageKey();
  if (items.length) {
    els.importStaticCards.disabled = true;
    els.importStaticCards.textContent = "已接管后台，无需导入";
    els.importStaticCards.title = "当前页面已经有后台卡片，继续用新增/编辑/复制来维护内容。";
    return;
  }

  if (placeholderStaticPages.has(pageKey)) {
    els.importStaticCards.disabled = true;
    els.importStaticCards.textContent = "静态模板不导入";
    els.importStaticCards.title = "这个页面的静态卡片是占位模板，请直接在后台新增真实卡片。";
    return;
  }

  els.importStaticCards.disabled = false;
  els.importStaticCards.textContent = "导入当前页静态卡片";
  els.importStaticCards.title = "只在当前页面还没有后台数据时使用。";
}

function renderPageStatusGrid() {
  if (!els.pageStatusGrid) return;
  const active = currentPageKey();
  els.pageStatusGrid.innerHTML = recommendationPages
    .map((page) => {
      const items = contentItems.filter((item) => item.page_key === page.key);
      const published = items.filter((item) => item.is_published).length;
      const hidden = items.length - published;
      const state = items.length ? "后台已接管" : "仍用静态兜底";
      return `
        <button class="page-status-card ${page.key === active ? "is-active" : ""}" type="button" data-page-key="${escapeHtml(page.key)}">
          <span class="page-status-card__label">${escapeHtml(page.label)}</span>
          <strong class="page-status-card__count">${items.length}</strong>
          <span class="page-status-card__meta">${published} 发布 / ${hidden} 隐藏</span>
          <span class="page-status-card__state">${state}</span>
        </button>
      `;
    })
    .join("");
}

function fieldInput(field, value = "") {
  const name = `field:${field.key}`;
  const hasValue = value !== undefined && value !== null && value !== "";
  const fieldValue = hasValue ? value : field.defaultValue;
  const safeValue = field.type === "json"
    ? JSON.stringify(fieldValue || (field.key.endsWith("s") ? [] : {}), null, 2)
    : field.type === "csv"
      ? csvValue(fieldValue)
      : field.type === "lines"
        ? linesValue(fieldValue)
        : String(fieldValue || "");

  if (field.type === "textarea" || field.type === "json" || field.type === "lines") {
    return `
      <label class="wide">
        ${escapeHtml(field.label)}
        <textarea name="${name}" rows="${field.rows || 4}" placeholder="${escapeHtml(field.placeholder || "")}">${escapeHtml(safeValue)}</textarea>
      </label>
    `;
  }

  if (field.type === "select") {
    return `
      <label>
        ${escapeHtml(field.label)}
        <select name="${name}">
          ${(field.options || []).map((option) => `<option value="${escapeHtml(option)}"${option === safeValue ? " selected" : ""}>${escapeHtml(option)}</option>`).join("")}
        </select>
      </label>
    `;
  }

  return `
    <label>
      ${escapeHtml(field.label)}
      <input name="${name}" value="${escapeHtml(safeValue)}" placeholder="${escapeHtml(field.placeholder || "")}">
    </label>
  `;
}

function renderDynamicFields(data = {}) {
  els.dynamicFields.innerHTML = currentConfig().fields
    .map((field) => fieldInput(field, data[field.key]))
    .join("");
}

function dynamicDataFromForm(form) {
  const base = parseJson(form.elements.data_json.value, {});
  currentConfig().fields.forEach((field) => {
    const raw = form.elements[`field:${field.key}`]?.value ?? "";
    if (field.type === "csv") {
      base[field.key] = parseTags(raw);
      return;
    }
    if (field.type === "lines") {
      base[field.key] = raw.split("\n").map((line) => line.trim()).filter(Boolean);
      return;
    }
    if (field.type === "json") {
      base[field.key] = parseJson(raw, field.key.endsWith("s") ? [] : {});
      return;
    }
    base[field.key] = raw.trim();
  });
  return base;
}

function contentItemPayload(form) {
  const pageKey = currentPageKey();
  return {
    page_key: pageKey,
    item_type: form.elements.item_type.value,
    title: form.elements.title.value.trim(),
    summary: form.elements.description.value.trim(),
    cover_url: form.elements.cover_url.value.trim() || null,
    link_url: form.elements.link_url.value.trim() || null,
    tags: parseTags(form.elements.tags.value),
    sort_order: Number(form.elements.sort_order.value || 0),
    layout_variant: form.elements.layout_variant.value,
    is_published: form.elements.is_published.checked,
    data: dynamicDataFromForm(form),
  };
}

function resetRecommendationForm() {
  els.recommendationForm.reset();
  els.recommendationForm.elements.id.value = "";
  els.recommendationForm.elements.page_key.value = currentPageKey();
  els.recommendationForm.elements.sort_order.value = String(nextSortOrderForCurrentPage());
  els.recommendationForm.elements.layout_variant.value = "normal";
  els.recommendationForm.elements.is_published.checked = true;
  fillItemTypeSelect();
  renderDynamicFields({});
  els.recommendationForm.elements.data_json.value = "{}";
  els.coverUpload.value = "";
  clearUploadPreview(els.coverPreview, els.coverUploadInfo);
}

function fillPageForm() {
  const page = activePage();
  const form = els.contentPageForm;
  form.elements.title.value = page.title || "";
  form.elements.intro.value = page.intro || "";
  form.elements.layout_type.value = page.layout_type || currentConfig().defaultLayout;
  form.elements.settings.value = JSON.stringify(page.settings || currentConfig().defaultSettings, null, 2);
  form.elements.is_enabled.checked = Boolean(page.is_enabled);
}

function editContentItem(item) {
  const form = els.recommendationForm;
  form.elements.id.value = item.id;
  form.elements.page_key.value = item.page_key;
  form.elements.item_type.value = item.item_type;
  form.elements.sort_order.value = item.sort_order ?? 0;
  form.elements.title.value = item.title ?? "";
  form.elements.description.value = item.summary ?? "";
  form.elements.link_url.value = item.link_url ?? "";
  form.elements.cover_url.value = item.cover_url ?? "";
  form.elements.tags.value = (item.tags ?? []).join(", ");
  form.elements.layout_variant.value = item.layout_variant ?? "normal";
  form.elements.is_published.checked = Boolean(item.is_published);
  renderDynamicFields(item.data || {});
  form.elements.data_json.value = JSON.stringify(item.data || {}, null, 2);
  els.coverUpload.value = "";
  if (item.cover_url) {
    renderUrlPreview(item.cover_url, els.coverPreview, "当前封面");
    els.coverUploadInfo.textContent = "正在使用已有封面 URL";
  } else {
    clearUploadPreview(els.coverPreview, els.coverUploadInfo);
  }
  setStatus(`正在编辑：${item.title}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteContentItem(id) {
  if (!window.confirm("确定删除这条内容吗？")) return;
  const { error } = await supabase.from("content_items").delete().eq("id", id);
  if (error) throw error;
  setStatus("已删除内容。");
  await loadContentItems();
}

async function updateContentItem(id, payload, message) {
  const { error } = await supabase.from("content_items").update(payload).eq("id", id);
  if (error) throw error;
  setStatus(message);
  await loadContentItems();
}

async function togglePublish(item) {
  await updateContentItem(
    item.id,
    { is_published: !item.is_published },
    item.is_published ? "卡片已隐藏。" : "卡片已发布。",
  );
}

async function moveContentItem(item, delta) {
  const nextSort = Number(item.sort_order || 0) + delta;
  await updateContentItem(item.id, { sort_order: nextSort }, "排序已更新。");
}

async function duplicateContentItem(item) {
  const payload = {
    page_key: item.page_key,
    item_type: item.item_type,
    title: `${item.title || "未命名卡片"} 副本`,
    summary: item.summary,
    cover_url: item.cover_url,
    link_url: item.link_url,
    tags: item.tags || [],
    sort_order: Number(item.sort_order || 0) + 1,
    layout_variant: item.layout_variant || "normal",
    is_published: false,
    data: item.data || {},
  };
  const { error } = await supabase.from("content_items").insert(payload);
  if (error) throw error;
  setStatus("已复制一张隐藏卡片。");
  await loadContentItems();
}

function seedDataForPage(pageKey, item) {
  if (pageKey === "prompt-collection") {
    return {
      prompt_type: item.meta,
      prompt: item.prompt || "",
      negative_prompt: "",
      model: "",
      copy_button_label: "点击复制",
      migrated_from: `static-${pageKey}`,
    };
  }

  if (pageKey === "skill-workflow") {
    return {
      skill_type: item.type || "SKILL",
      includes: item.includes || [],
      use_cases: [item.summary].filter(Boolean),
      call_instruction: "",
      applicable_scene: item.meta,
      button_label: item.type === "WORKFLOW" ? "VIEW WORKFLOW" : "VIEW ON GITHUB",
      migrated_from: `static-${pageKey}`,
    };
  }

  if (pageKey === "agent-guide") {
    const guide = item.guide || {};
    return {
      group: item.group || "AGENT / GUIDE",
      difficulty: item.difficulty || "",
      model: item.model || "",
      success: item.success || "",
      quick: guide.quick || [],
      what: guide.what || "",
      use_cases: guide.fit || "",
      prepare: guide.prepare || [],
      mac: guide.mac || [],
      windows: guide.windows || [],
      verify: guide.verify || [],
      deepseek: guide.deepseek || [],
      errors: guide.errors || [],
      tool_links: guide.sources || [],
      button_label: "OPEN TUTORIAL",
      migrated_from: `static-${pageKey}`,
    };
  }

  if (pageKey === "photography") {
    return {
      ratio: item.ratio || item.meta || "wide",
      focus: item.focus || "center center",
      caption: item.summary || "",
      location: "",
      shot_at: "",
      migrated_from: `static-${pageKey}`,
    };
  }

  return {
    site_name: item.title,
    pricing: item.meta,
    recommend_reason: item.summary,
    button_label: "VISIT SITE",
    migrated_from: `static-${pageKey}`,
  };
}

function seedPayloadsForPage(pageKey) {
  return (staticContentSeeds[pageKey] || []).map((item, index) => {
    const tagSource = item.meta || item.group || "";
    const tags = String(tagSource)
      .split("/")
      .map((tag) => tag.trim())
      .filter(Boolean);

    return {
      page_key: pageKey,
      item_type: item.item_type || item.type?.toLowerCase() || pageConfigs[pageKey].itemTypes[0]?.value || "card",
      title: item.title,
      summary: item.summary,
      cover_url: item.cover_url,
      link_url: item.link_url,
      tags,
      sort_order: (index + 1) * 10,
      layout_variant: "normal",
      is_published: true,
      data: seedDataForPage(pageKey, item),
    };
  });
}

function tagsFromValue(value) {
  if (Array.isArray(value)) return value.map(String).map((tag) => tag.trim()).filter(Boolean);
  if (typeof value === "string") return parseTags(value);
  return [];
}

function bulkDataForPage(pageKey, item) {
  const data = { ...(item.data || {}) };
  const fieldKeys = new Set((pageConfigs[pageKey]?.fields || []).map((field) => field.key));

  Object.entries(item).forEach(([key, value]) => {
    if (!fieldKeys.has(key)) return;
    data[key] = value;
  });

  if (pageKey === "prompt-collection") {
    data.prompt_type ||= item.prompt_type || item.meta || item.category || "TEXT TO IMAGE";
    data.prompt ||= item.prompt || "";
    data.copy_button_label ||= item.copy_button_label || "点击复制";
  }

  if (pageKey === "skill-workflow") {
    data.skill_type ||= item.skill_type || item.type || item.item_type || "SKILL";
    data.includes ||= tagsFromValue(item.includes);
    data.use_cases ||= Array.isArray(item.use_cases)
      ? item.use_cases
      : String(item.use_cases || item.summary || "").split(/\n/).map((line) => line.trim()).filter(Boolean);
    data.button_label ||= item.button_label || "VIEW ON GITHUB";
  }

  return data;
}

function bulkPayloadsForPage(pageKey, rawItems) {
  const startSortOrder = nextSortOrderForCurrentPage();
  const config = pageConfigs[pageKey];

  return rawItems.map((item, index) => ({
    page_key: pageKey,
    item_type: item.item_type || item.type?.toLowerCase() || config.itemTypes[0]?.value || "card",
    title: String(item.title || item.name || `未命名卡片 ${index + 1}`).trim(),
    summary: String(item.summary || item.description || "").trim(),
    cover_url: item.cover_url || item.image || item.cover || null,
    link_url: item.link_url || item.url || item.href || null,
    tags: tagsFromValue(item.tags || item.category || item.meta),
    sort_order: Number(item.sort_order || startSortOrder + index * 10),
    layout_variant: item.layout_variant || "normal",
    is_published: item.is_published !== false,
    data: bulkDataForPage(pageKey, item),
  }));
}

async function bulkImportCards() {
  const raw = els.bulkImportJson.value.trim();
  if (!raw) {
    setStatus("请先粘贴 JSON 数组。", true);
    return;
  }

  const parsed = parseJson(raw, null);
  if (!Array.isArray(parsed)) {
    setStatus("批量导入需要 JSON 数组，例如 [{\"title\":\"...\"}]。", true);
    return;
  }

  const payloads = bulkPayloadsForPage(currentPageKey(), parsed).filter((item) => item.title);
  if (!payloads.length) {
    setStatus("没有可导入的卡片，请检查 title/name 字段。", true);
    return;
  }

  const ok = window.confirm(`将向当前页面导入 ${payloads.length} 张卡片，确定吗？`);
  if (!ok) return;

  setStatus(`正在批量导入 ${payloads.length} 张卡片...`);
  const { error } = await supabase.from("content_items").insert(payloads);
  if (error) throw error;
  els.bulkImportJson.value = "";
  await loadContentItems();
  resetRecommendationForm();
  setStatus(`已批量导入 ${payloads.length} 张卡片。`);
}

async function importStaticCards() {
  const pageKey = currentPageKey();
  const payloads = seedPayloadsForPage(pageKey);
  if (!payloads.length) {
    setStatus("当前页面还没有内置静态卡片可导入。", true);
    return;
  }

  const existingCount = contentItems.filter((item) => item.page_key === pageKey).length;
  if (existingCount) {
    setStatus(`这个页面已经有 ${existingCount} 张后台卡片，不再导入静态模板。请用新增、编辑、复制来维护。`, true);
    return;
  }

  if (placeholderStaticPages.has(pageKey)) {
    setStatus("这个页面的静态卡片是占位模板，不适合导入后台。请直接新增真实卡片。", true);
    return;
  }

  setStatus(`正在导入 ${payloads.length} 张静态卡片...`);
  const { error } = await supabase.from("content_items").insert(payloads);
  if (error) throw error;
  await loadContentItems();
  resetRecommendationForm();
  setStatus(`已导入 ${payloads.length} 张静态卡片。前台会优先读取后台数据。`);
}

async function normalizeCurrentPageSortOrder() {
  const pageKey = currentPageKey();
  const items = contentItems
    .filter((item) => item.page_key === pageKey)
    .sort((a, b) => {
      const sortDiff = Number(a.sort_order || 0) - Number(b.sort_order || 0);
      if (sortDiff) return sortDiff;
      return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
    });

  if (!items.length) {
    setStatus("当前页面还没有卡片可整理。", true);
    return;
  }

  const ok = window.confirm(`将把当前页面 ${items.length} 张卡片排序整理为 10 / 20 / 30...，确定吗？`);
  if (!ok) return;

  setStatus(`正在整理 ${items.length} 张卡片排序...`);
  for (let index = 0; index < items.length; index += 1) {
    const nextSortOrder = (index + 1) * 10;
    if (Number(items[index].sort_order || 0) === nextSortOrder) continue;
    const { error } = await supabase
      .from("content_items")
      .update({ sort_order: nextSortOrder })
      .eq("id", items[index].id);
    if (error) throw error;
  }

  await loadContentItems();
  setStatus(`当前页面排序已整理为 10 / 20 / ... / ${items.length * 10}。`);
}

function renderContentItems() {
  const items = contentItems.filter((item) => item.page_key === currentPageKey());
  renderPageStatusGrid();
  updateImportButtonState(items);
  const summary = summarizeItems(items);
  els.contentSummary.innerHTML = summary
    .map((item) => `
      <div class="summary-chip">
        <span>${escapeHtml(item.label)}</span>
        <strong>${item.value}</strong>
      </div>
    `)
    .join("");

  if (!items.length) {
    els.recommendationList.innerHTML = `<p class="status-line">这个页面还没有后台卡片。前台会继续显示当前静态内容。</p>`;
    return;
  }

  els.recommendationList.innerHTML = items
    .map((item) => `
      <article class="data-card" data-id="${item.id}">
        <div class="data-card__media">${mediaMarkup(item.cover_url)}</div>
        <div>
          <div class="data-card__meta">
            <span>#${Number(item.sort_order || 0)}</span>
            <span>${escapeHtml(item.item_type)}</span>
            <span class="state-pill ${item.is_published ? "is-live" : "is-hidden"}">${item.is_published ? "已发布" : "已隐藏"}</span>
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.summary || "")}</p>
          <div class="data-card__tags">${(item.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        </div>
        <div class="data-card__actions">
          <button class="ghost-button" type="button" data-action="up">上移</button>
          <button class="ghost-button" type="button" data-action="down">下移</button>
          <button class="ghost-button" type="button" data-action="toggle">${item.is_published ? "隐藏" : "发布"}</button>
          <button class="ghost-button" type="button" data-action="duplicate">复制</button>
          <button class="ghost-button" type="button" data-action="edit">编辑</button>
          <button class="danger-button" type="button" data-action="delete">删除</button>
        </div>
      </article>
    `)
    .join("");
}

async function loadContentPages() {
  const { data, error } = await supabase.from("content_pages").select("*").order("page_key");
  if (error) throw error;
  contentPages = data ?? [];
  fillPageForm();
}

async function loadContentItems() {
  const { data, error } = await supabase
    .from("content_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  contentItems = data ?? [];
  renderContentItems();
}

async function loadProfile() {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", true)
    .single();
  if (error) throw error;

  const form = els.profileForm;
  form.elements.nickname.value = data.nickname ?? "";
  form.elements.email.value = data.email ?? "";
  form.elements.avatar_url.value = data.avatar_url ?? "";
  form.elements.real_photo_url.value = data.real_photo_url ?? "";
  form.elements.intro.value = data.intro ?? "";
  form.elements.contacts.value = JSON.stringify(data.contacts ?? [], null, 2);
  form.elements.social_links.value = JSON.stringify(data.social_links ?? [], null, 2);
  renderUrlPreview(data.avatar_url, els.avatarPreview, "当前头像");
  renderUrlPreview(data.real_photo_url, els.realPhotoPreview, "当前真人照片");
}

async function verifyAdmin(session) {
  const userId = session?.user?.id;
  const email = session?.user?.email?.toLowerCase();
  if (!userId) return { ok: false, fallback: false, message: "没有拿到登录用户 ID。" };

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .limit(1);
  if (error) {
    if (fallbackAdminEmails.has(email)) {
      return {
        ok: true,
        fallback: true,
        message: `管理员表读取失败，已按登录邮箱临时放行：${error.message}`,
      };
    }
    throw error;
  }

  if (data?.length) return { ok: true, fallback: false, message: "" };

  if (fallbackAdminEmails.has(email)) {
    return {
      ok: true,
      fallback: true,
      message: "已登录，但 admin_users 表里没有匹配当前 User ID；编辑保存可能会失败。",
    };
  }

  return { ok: false, fallback: false, message: "这个账号还不是管理员。" };
}

async function showAdmin(session) {
  const adminCheck = await verifyAdmin(session);
  if (!adminCheck.ok) throw new Error(adminCheck.message);

  currentSession = session;
  els.loginPanel.hidden = true;
  els.adminPanel.hidden = false;
  els.logoutButton.hidden = false;
  els.sessionEmail.textContent = session.user.email;

  try {
    await Promise.all([loadContentPages(), loadContentItems(), loadProfile()]);
    resetRecommendationForm();
    setStatus(adminCheck.fallback ? adminCheck.message : "后台已连接。", adminCheck.fallback);
  } catch (error) {
    setStatus(`已登录，但内容读取失败：${error.message}`, true);
  }
}

function showLogin() {
  currentSession = null;
  els.loginPanel.hidden = false;
  els.adminPanel.hidden = true;
  els.logoutButton.hidden = true;
  els.sessionEmail.textContent = "未登录";
}

const UPLOAD_ERRORS = {
  "Payload too large": "文件超过了存储桶的大小限制。",
  "duplicate": "文件名已被占用，请稍后重试。",
  "not found": "存储桶不存在，请检查配置。",
  "Unauthorized": "上传权限不足，请重新登录后再试。",
  "JWT": "登录已过期，请重新登录后再上传。",
  "network": "网络连接失败，请检查网络后重试。",
  "row-level security": "没有操作权限，请确认管理员身份。",
};

function translateUploadError(error) {
  if (!error) return "未知错误，请重试。";
  const msg = (error.message || String(error)).trim();
  for (const [key, trans] of Object.entries(UPLOAD_ERRORS)) {
    if (msg.toLowerCase().includes(key.toLowerCase())) return `❌ ${trans}`;
  }
  return `❌ 上传失败：${msg}`;
}

function showProgress(progressEl, percent) {
  if (!progressEl) return;
  progressEl.hidden = percent >= 100;
  progressEl.value = percent;
}

function hideProgress(progressEl) {
  if (!progressEl) return;
  progressEl.hidden = true;
  progressEl.value = 0;
}

function encodeStoragePath(filePath) {
  return filePath.split("/").map(encodeURIComponent).join("/");
}

async function uploadToStorage(file, folder, progressEl) {
  if (!file) return "";
  showProgress(progressEl, 0);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const filePath = `admin-uploads/${folder}/${Date.now()}-${safeName}`;
  const token = currentSession?.access_token || "";

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${SUPABASE_URL}/storage/v1/object/site-media/${encodeStoragePath(filePath)}`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("apikey", SUPABASE_ANON_KEY);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        showProgress(progressEl, Math.round((event.loaded / event.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      hideProgress(progressEl);
      if (xhr.status >= 200 && xhr.status < 300) {
        const publicUrl = `${SITE_MEDIA_BASE_URL}/${encodeStoragePath(filePath)}`;
        resolve(publicUrl);
      } else {
        let errMsg = `上传失败 (${xhr.status})`;
        try {
          const body = JSON.parse(xhr.responseText);
          errMsg = body.message || body.error || errMsg;
        } catch (_) {}
        reject(new Error(translateUploadError({ message: errMsg })));
      }
    });

    xhr.addEventListener("error", () => {
      hideProgress(progressEl);
      reject(new Error(translateUploadError({ message: "network" })));
    });

    xhr.addEventListener("abort", () => {
      hideProgress(progressEl);
      reject(new Error("❌ 上传已取消。"));
    });

    xhr.send(file);
  });
}

function switchView(view) {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
  els.recommendationsView.hidden = view !== "recommendations";
  els.profileView.hidden = view !== "profile";
}

fillPageSelect(els.pageFilter);
fillPageSelect(els.recommendationForm.elements.page_key);
fillItemTypeSelect();
renderDynamicFields({});

function handlePageChange() {
  fillItemTypeSelect();
  fillPageForm();
  renderContentItems();
  resetRecommendationForm();
}

els.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("正在登录...");
  const form = new FormData(event.currentTarget);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: form.get("email"),
    password: form.get("password"),
  });
  if (error) {
    setStatus(error.message, true);
    return;
  }

  try {
    await showAdmin(data.session);
  } catch (error) {
    setStatus(error.message, true);
    showLogin();
  }
});

els.logoutButton.addEventListener("click", async () => {
  await supabase.auth.signOut();
  showLogin();
  setStatus("已退出。");
});

document.querySelectorAll(".nav-button").forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.view));
});

els.pageFilter.addEventListener("change", () => {
  handlePageChange();
});

els.pageStatusGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-page-key]");
  if (!button) return;
  els.pageFilter.value = button.dataset.pageKey;
  handlePageChange();
});

els.contentPageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("正在保存页面配置...");
  try {
    const form = event.currentTarget;
    const payload = {
      page_key: currentPageKey(),
      title: form.elements.title.value.trim(),
      intro: form.elements.intro.value.trim(),
      layout_type: form.elements.layout_type.value,
      settings: parseJson(form.elements.settings.value, {}),
      is_enabled: form.elements.is_enabled.checked,
    };
    const { error } = await supabase.from("content_pages").upsert(payload);
    if (error) throw error;
    await loadContentPages();
    setStatus("页面配置已保存。");
  } catch (error) {
    setStatus(error.message, true);
  }
});

els.resetRecommendation.addEventListener("click", resetRecommendationForm);

els.importStaticCards.addEventListener("click", async () => {
  try {
    await importStaticCards();
  } catch (error) {
    setStatus(error.message, true);
  }
});

els.normalizeSortOrder.addEventListener("click", async () => {
  try {
    await normalizeCurrentPageSortOrder();
  } catch (error) {
    setStatus(error.message, true);
  }
});

els.bulkImportCards?.addEventListener("click", async () => {
  try {
    await bulkImportCards();
  } catch (error) {
    setStatus(error.message, true);
  }
});

els.clearBulkImport?.addEventListener("click", () => {
  els.bulkImportJson.value = "";
  setStatus("批量导入输入框已清空。");
});

els.coverUpload.addEventListener("change", async (event) => {
  const file = event.currentTarget.files?.[0];
  if (!file) return;
  setStatus("正在上传封面...");
  try {
    previewSelectedFile(file, els.coverPreview, els.coverUploadInfo, "封面预览");
    const url = await uploadToStorage(file, "covers", els.coverUploadProgress);
    els.recommendationForm.elements.cover_url.value = url;
    updateUploadedFilePreview(url, file, els.coverPreview, els.coverUploadInfo, "封面预览");
    setStatus("封面上传完成。");
  } catch (error) {
    event.currentTarget.value = "";
    hideProgress(els.coverUploadProgress);
    els.coverUploadInfo.textContent = error.message;
    setStatus(error.message, true);
  }
});

els.avatarUpload.addEventListener("change", async (event) => {
  const file = event.currentTarget.files?.[0];
  if (!file) return;
  setStatus("正在上传头像...");
  try {
    previewSelectedFile(file, els.avatarPreview, els.avatarUploadInfo, "头像预览");
    const url = await uploadToStorage(file, "profile", els.avatarUploadProgress);
    els.profileForm.elements.avatar_url.value = url;
    updateUploadedFilePreview(url, file, els.avatarPreview, els.avatarUploadInfo, "头像预览");
    setStatus("头像上传完成。");
  } catch (error) {
    event.currentTarget.value = "";
    hideProgress(els.avatarUploadProgress);
    els.avatarUploadInfo.textContent = error.message;
    setStatus(error.message, true);
  }
});

els.realPhotoUpload.addEventListener("change", async (event) => {
  const file = event.currentTarget.files?.[0];
  if (!file) return;
  setStatus("正在上传真人照片...");
  try {
    previewSelectedFile(file, els.realPhotoPreview, els.realPhotoUploadInfo, "真人照片预览");
    const url = await uploadToStorage(file, "profile", els.realPhotoUploadProgress);
    els.profileForm.elements.real_photo_url.value = url;
    updateUploadedFilePreview(url, file, els.realPhotoPreview, els.realPhotoUploadInfo, "真人照片预览");
    setStatus("真人照片上传完成。");
  } catch (error) {
    event.currentTarget.value = "";
    hideProgress(els.realPhotoUploadProgress);
    els.realPhotoUploadInfo.textContent = error.message;
    setStatus(error.message, true);
  }
});

els.recommendationForm.elements.cover_url.addEventListener("input", (event) => {
  renderUrlPreview(event.currentTarget.value, els.coverPreview, "封面 URL 预览");
});

els.profileForm.elements.avatar_url.addEventListener("input", (event) => {
  renderUrlPreview(event.currentTarget.value, els.avatarPreview, "头像 URL 预览");
});

els.profileForm.elements.real_photo_url.addEventListener("input", (event) => {
  renderUrlPreview(event.currentTarget.value, els.realPhotoPreview, "真人照片 URL 预览");
});

window.addEventListener("pagehide", () => {
  objectUrls.forEach((url) => URL.revokeObjectURL(url));
  objectUrls.clear();
});

els.recommendationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("正在保存内容...");
  try {
    const payload = contentItemPayload(event.currentTarget);
    const id = event.currentTarget.elements.id.value;
    const request = id
      ? supabase.from("content_items").update(payload).eq("id", id)
      : supabase.from("content_items").insert(payload);
    const { error } = await request;
    if (error) throw error;
    setStatus("内容已保存。");
    await loadContentItems();
    resetRecommendationForm();
  } catch (error) {
    setStatus(error.message, true);
  }
});

els.recommendationList.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  const card = event.target.closest(".data-card");
  if (!button || !card) return;

  const item = contentItems.find((entry) => entry.id === card.dataset.id);
  if (!item) return;

  try {
    if (button.dataset.action === "edit") editContentItem(item);
    if (button.dataset.action === "up") await moveContentItem(item, -10);
    if (button.dataset.action === "down") await moveContentItem(item, 10);
    if (button.dataset.action === "toggle") await togglePublish(item);
    if (button.dataset.action === "duplicate") await duplicateContentItem(item);
    if (button.dataset.action === "delete") await deleteContentItem(item.id);
  } catch (error) {
    setStatus(error.message, true);
  }
});

els.profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("正在保存资料...");
  try {
    const form = new FormData(event.currentTarget);
    const payload = {
      id: true,
      nickname: form.get("nickname").trim(),
      email: form.get("email").trim() || null,
      avatar_url: form.get("avatar_url").trim() || null,
      real_photo_url: form.get("real_photo_url").trim() || null,
      intro: form.get("intro").trim(),
      contacts: parseJson(form.get("contacts"), []),
      social_links: parseJson(form.get("social_links"), []),
    };
    const { error } = await supabase.from("profile").upsert(payload);
    if (error) throw error;
    setStatus("关于页资料已保存。");
  } catch (error) {
    setStatus(error.message, true);
  }
});

const { data } = await supabase.auth.getSession();
if (data.session) {
  try {
    await showAdmin(data.session);
  } catch (error) {
    setStatus(error.message, true);
    showLogin();
  }
} else {
  showLogin();
}
