(() => {
  const pageSize = 3;
  let currentPage = 0;
  let lastFocus = null;
  let lockedScrollY = 0;

  let tools = [
    {
      title: "Hermes Agent",
      group: "HOT / OVERSEAS",
      description: "Nous Research 的开源 Agent 客户端，适合想用一个桌面端或命令行入口连接不同模型的人。它能跑日常对话、工具调用和本地工作流，对 DeepSeek 接入也比较友好。",
      tags: ["Mac", "Windows", "CLI", "DeepSeek"],
      difficulty: "入门偏中等",
      model: "OpenAI / Anthropic / DeepSeek / 自定义 API",
      success: "能打开 Hermes，或终端运行 hermes 后进入设置界面。",
      source: "https://hermes-agent.nousresearch.com/docs/",
      guide: {
        quick: [
          "先去 Hermes 官网下载桌面版；如果你喜欢终端，Mac/Linux/WSL 用官方 shell 脚本安装。",
          "打开 Hermes 后跟着 setup 走，先确认能进入主界面。",
          "要接 DeepSeek，就运行 hermes setup，选择 Quick Setup，再选 DeepSeek。",
          "DeepSeek 的 Base URL 填 https://api.deepseek.com，API Key 从 DeepSeek 开放平台复制。"
        ],
        what: "Hermes Agent 是 Nous Research 做的 Agent 客户端。你可以把它理解成一个能连接多种大模型的工作台：桌面端适合小白，CLI 适合喜欢终端的人。",
        fit: "适合想尝试外国 Agent 工具，但又希望接入 DeepSeek 等国产模型的人；也适合想把模型、工具和本地文件操作放到一个入口里的人。",
        prepare: [
          "准备一个可用网络环境。",
          "准备一个模型 API Key。用 DeepSeek 的话，先去 DeepSeek 开放平台创建 API Key。",
          "Windows 用户建议用 PowerShell；如果用 WSL，就在 WSL 里面按 Linux 方法装。"
        ],
        mac: [
          { text: "桌面端：去 Hermes 官网下载安装包，安装后直接打开。", code: "" },
          { text: "CLI：在终端运行官方安装脚本。", code: "curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash" }
        ],
        windows: [
          { text: "桌面端：去 Hermes 官网下载 Windows 安装包。", code: "" },
          { text: "PowerShell 一键安装：", code: "iex (irm https://hermes-agent.nousresearch.com/install.ps1)" }
        ],
        verify: [
          "桌面端能正常打开，并进入设置或聊天界面。",
          "CLI 能运行 hermes 或 hermes setup。",
          "配置模型后，发送一句“你好，帮我列一个安装检查清单”，能得到回复。"
        ],
        deepseek: [
          "运行 hermes setup。",
          "选择 Quick Setup。",
          "Provider 选择 DeepSeek。",
          "API Key 粘贴你的 DeepSeek Key。",
          "Base URL 填 https://api.deepseek.com。",
          "模型选择 deepseek-chat、deepseek-reasoner，或官方教程中当前推荐的模型名。"
        ],
        errors: [
          "命令无法识别：关闭终端重新打开，或检查安装目录是否进了 PATH。",
          "401/鉴权失败：API Key 复制错了，或 Key 前后多了空格。",
          "请求超时：先确认网络，再确认 Base URL 没写错。"
        ],
        sources: [
          ["Hermes Agent Docs", "https://hermes-agent.nousresearch.com/docs/"],
          ["Hermes GitHub", "https://github.com/NousResearch/hermes-agent"],
          ["DeepSeek Hermes 接入", "https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/hermes"]
        ]
      }
    },
    {
      title: "OpenAI Codex",
      group: "HOT / OFFICIAL",
      description: "OpenAI 官方代码 Agent，适合让 AI 在本地项目里读代码、改代码、跑命令、做 review。它有 App、CLI、IDE Extension、Web 等形态，小白优先从 App 或 CLI 入门。",
      tags: ["Mac", "Windows", "CLI", "IDE"],
      difficulty: "入门友好",
      model: "OpenAI 官方模型 / ChatGPT 登录 / OpenAI API Key",
      success: "终端能输出 codex --version，或 Codex App 能登录并打开项目。",
      source: "https://developers.openai.com/codex/",
      guide: {
        quick: [
          "先确定你要用哪种形态：App 更像桌面软件，CLI 更适合终端，IDE Extension 更适合 VS Code 类编辑器。",
          "Mac/Linux/WSL 可以用 OpenAI 官方脚本安装 CLI。",
          "Windows 可以用官方 PowerShell 脚本，也可以用 Codex Windows App。",
          "安装后运行 codex，按提示用 ChatGPT 账号或 OpenAI API Key 登录。"
        ],
        what: "Codex 是 OpenAI 官方的软件开发 Agent。它可以在你授权的项目文件夹里读文件、改代码、运行测试，并把过程留在可审查的线程中。",
        fit: "适合做网站、写代码、修 bug、读项目、自动化重构的人。纯小白可以先用 App，看得见项目和线程；熟悉终端后再用 CLI。",
        prepare: [
          "准备 ChatGPT 账号，或 OpenAI Platform API Key。",
          "Windows 推荐 Windows 11；Windows 10 需要较新的版本。",
          "如果项目依赖 Git、Node、Python 等工具，需要按项目本身要求安装。Codex 不是替你安装所有开发环境的魔法盒。"
        ],
        mac: [
          { text: "安装 Codex CLI：", code: "curl -fsSL https://chatgpt.com/codex/install.sh | sh" },
          { text: "启动并登录：", code: "codex" },
          { text: "如果要从 CLI 打开桌面 App，可以使用：", code: "codex app" }
        ],
        windows: [
          { text: "PowerShell 安装 Codex CLI：", code: "irm https://chatgpt.com/codex/install.ps1 | iex" },
          { text: "也可以安装 Codex Windows App；如果你偏 Linux 开发，先装 WSL，再在 WSL 里跑 Linux 安装脚本。", code: "wsl --install\nwsl\ncurl -fsSL https://chatgpt.com/codex/install.sh | sh\ncodex" },
          { text: "Windows 上如果要配 Git，建议：", code: "winget install Git.Git" }
        ],
        verify: [
          "终端运行 codex --version，能看到版本号。",
          "运行 codex doctor，检查本地安装、认证、运行环境是否正常。",
          "进入一个项目目录运行 codex，问它“请解释这个项目结构”，能得到项目级回答。"
        ],
        deepseek: [
          "Codex 官方默认服务 OpenAI 模型，不建议把第三方非官方中转教程写成主路径。",
          "如果只想使用 DeepSeek，优先看 Hermes、OpenClaw、DeepCode、Nanobot 等支持自定义模型的工具。",
          "需要用 OpenAI API Key 登录 Codex 时，去 OpenAI Dashboard 创建 Key。DeepSeek Key 不是 OpenAI Key，不能混用。"
        ],
        errors: [
          "登录打不开浏览器：尝试 codex login --device-auth。",
          "Windows 权限或沙箱失败：先跑 codex doctor，看是不是 Git、winget、沙箱权限或企业策略问题。",
          "项目命令跑不起来：先手动在终端运行 npm install、npm test 等项目命令，确认本地开发环境本身可用。"
        ],
        sources: [
          ["OpenAI Codex Docs", "https://developers.openai.com/codex/"],
          ["OpenAI API Keys", "https://platform.openai.com/api-keys"],
          ["Codex Open Source", "https://github.com/openai/codex"]
        ]
      }
    },
    {
      title: "Claude Code",
      group: "HOT / OVERSEAS",
      description: "Anthropic 官方命令行代码 Agent，适合在终端里让 Claude 读项目、改文件、跑测试。它非常适合代码任务，但账号权限和终端环境要提前准备好。",
      tags: ["Mac", "Windows", "WSL", "Code"],
      difficulty: "入门偏中等",
      model: "Claude 官方模型 / 账号订阅或 Console",
      success: "运行 claude --version 和 claude doctor 正常，进入项目后能发起对话。",
      source: "https://code.claude.com/docs/en/setup.md",
      guide: {
        quick: [
          "Mac/Linux/WSL 用官方 install.sh；Windows 原生用官方 PowerShell 脚本。",
          "Windows 如果要更像 Linux 开发，推荐装 WSL；原生 Windows 建议装 Git for Windows。",
          "安装后运行 claude，按提示登录。",
          "进入项目目录，先问“请阅读这个项目并总结结构”，确认它能读到当前项目。"
        ],
        what: "Claude Code 是 Anthropic 官方的终端代码 Agent。它不是普通聊天框，而是可以在你的项目目录里执行读写、搜索、测试等开发动作的 CLI 工具。",
        fit: "适合写代码、修 bug、重构、读老项目的人。它更适合愿意使用终端的人；如果完全不碰终端，学习成本会比网页工具高。",
        prepare: [
          "准备支持 Claude Code 的 Anthropic/Claude 账号权限。",
          "Windows 原生环境建议安装 Git for Windows，因为很多项目命令依赖 Git Bash 或常见 Unix 工具。",
          "如果使用 WSL，请在 WSL 里面安装 Claude Code，不要 Windows 装一份、WSL 又混用一份。"
        ],
        mac: [
          { text: "官方一键安装：", code: "curl -fsSL https://claude.ai/install.sh | bash" },
          { text: "Homebrew 方式：", code: "brew install --cask claude-code" },
          { text: "启动：", code: "claude" }
        ],
        windows: [
          { text: "PowerShell 官方安装：", code: "irm https://claude.ai/install.ps1 | iex" },
          { text: "WinGet 方式：", code: "winget install Anthropic.ClaudeCode" },
          { text: "如果使用 CMD：", code: "curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd" }
        ],
        verify: [
          "运行 claude --version，确认版本号。",
          "运行 claude doctor，检查终端、登录和运行环境。",
          "在项目目录运行 claude，能进入交互界面。"
        ],
        deepseek: [
          "Claude Code 官方主路径使用 Claude 模型，不把 DeepSeek 当作官方默认模型。",
          "如果目标是 Claude Code 风格但使用 DeepSeek，可以看 DeepSeek 官方 Coding Agents 文档中列出的兼容工具或代理方案。",
          "不建议小白一开始就用非官方中转改 Claude Code 模型，容易卡在鉴权和 Base URL。"
        ],
        errors: [
          "Windows 脚本无法运行：用管理员 PowerShell，或检查执行策略提示。",
          "找不到 claude 命令：重开终端，确认安装目录在 PATH。",
          "登录失败：确认账号套餐或 Console 权限支持 Claude Code。"
        ],
        sources: [
          ["Claude Code Setup", "https://code.claude.com/docs/en/setup.md"],
          ["Claude Code Overview", "https://code.claude.com/docs/en/overview.md"],
          ["DeepSeek Coding Agents", "https://api-docs.deepseek.com/zh-cn/guides/coding_agents"]
        ]
      }
    },
    {
      title: "腾讯元器",
      group: "CHINA / NO-CODE",
      description: "腾讯面向普通用户的智能体创建平台，适合不写代码做一个问答助手、知识库助手或微信生态入口。它更像“搭一个可发布的 Agent”，不是本地代码工具。",
      tags: ["Web", "No-Code", "微信", "国内"],
      difficulty: "入门友好",
      model: "腾讯生态模型 / 平台内模型",
      success: "能创建一个智能体，并在预览窗口得到稳定回复。",
      source: "https://yuanqi.tencent.com/",
      guide: {
        quick: [
          "打开腾讯元器官网并登录。",
          "新建智能体，先写清角色：它帮谁、解决什么问题、不能做什么。",
          "上传知识或配置问答能力。",
          "在预览区问 3 个真实问题，确认回答能用，再发布。"
        ],
        what: "腾讯元器是一个低代码/无代码智能体平台。它的重点不是安装到电脑，而是在网页里创建、调试和发布一个 Agent。",
        fit: "适合公众号、客服、社群问答、知识库助手、小程序或微信生态里的轻量智能体。",
        prepare: [
          "准备腾讯账号。",
          "准备智能体说明：目标用户、回答范围、语气、禁止事项。",
          "如果要做知识库，提前整理 PDF、文档或问答资料。"
        ],
        mac: [{ text: "Mac 不需要本地安装，用浏览器打开官网即可。", code: "https://yuanqi.tencent.com/" }],
        windows: [{ text: "Windows 同样使用浏览器；建议用 Chrome、Edge 或腾讯官方推荐浏览器。", code: "https://yuanqi.tencent.com/" }],
        verify: [
          "智能体能创建成功。",
          "预览区能连续回答问题。",
          "如果接入微信或其他渠道，发布后用真实入口测试一次。"
        ],
        deepseek: [
          "元器以平台内模型和腾讯生态能力为主；是否支持外部模型以后台当前配置为准。",
          "如果明确要用 DeepSeek API，自建网页/后端或用支持自定义模型的 Agent 工具会更直接。"
        ],
        errors: [
          "回答跑偏：先改角色提示词和知识边界，不要急着换模型。",
          "知识库命中差：把资料拆成结构更清晰的文档，标题写具体。",
          "发布后访问不了：检查发布渠道权限和账号认证状态。"
        ],
        sources: [
          ["腾讯元器", "https://yuanqi.tencent.com/"],
          ["创建第一个智能体", "https://yuanqi.tencent.com/guide/agent-build-first-agent"],
          ["微信智能体指南", "https://yuanqi.tencent.com/guide/agent-build-wechat-agent"]
        ]
      }
    },
    {
      title: "扣子 Coze",
      group: "CHINA / WORKFLOW",
      description: "字节系智能体搭建平台，适合做聊天机器人、工作流、多 Agent 和工具调用。它偏产品化，适合小白从模板开始，也适合进阶用户做流程编排。",
      tags: ["Web", "Workflow", "Multi-Agent", "国内"],
      difficulty: "入门友好",
      model: "扣子平台模型 / 火山方舟生态",
      success: "能创建 Bot，添加工作流或知识库，并在预览里完成一次任务。",
      source: "https://www.coze.cn/",
      guide: {
        quick: [
          "打开扣子官网并登录。",
          "新建 Bot，先选择模板或空白智能体。",
          "补充人设、技能、知识库和工作流。",
          "预览测试 3 个真实任务，再考虑发布到目标渠道。"
        ],
        what: "扣子 Coze 是一个 Agent/Bot 创建平台，核心能力包括角色设定、插件、工作流、知识库和多 Agent 编排。",
        fit: "适合做个人助手、内容助手、客服助手、运营流程助手，以及需要调用工具或工作流的 Agent。",
        prepare: [
          "准备手机号或平台账号。",
          "准备智能体要解决的任务列表。",
          "如果要使用知识库，先整理资料；如果要使用 API，先准备接口说明。"
        ],
        mac: [{ text: "Mac 用浏览器进入扣子官网，无需本地安装。", code: "https://www.coze.cn/" }],
        windows: [{ text: "Windows 用浏览器进入扣子官网，无需本地安装。", code: "https://www.coze.cn/" }],
        verify: [
          "Bot 能保存并进入预览。",
          "工作流节点能成功运行。",
          "发布渠道里能收到 Bot 回复。"
        ],
        deepseek: [
          "扣子的可选模型和外部模型能力以平台当前开放情况为准。",
          "如果只是想体验 DeepSeek API，先看本页 DeepSeek API 基础设施卡，再选择支持自定义 Base URL 的 Agent。"
        ],
        errors: [
          "工作流失败：先单独测试每个节点，再串起来。",
          "知识库答非所问：检查知识库是否被启用，问题是否能命中文档关键词。",
          "发布失败：检查渠道授权和平台审核要求。"
        ],
        sources: [
          ["扣子 Coze", "https://www.coze.cn/"],
          ["Coze Agent Overview", "https://docs.coze.cn/guides_agent_overview"],
          ["火山引擎豆包", "https://www.volcengine.com/product/doubao"]
        ]
      }
    },
    {
      title: "阿里百炼 Agent",
      group: "CHINA / CLOUD",
      description: "阿里云百炼的智能体应用平台，适合企业或开发者做知识库问答、流程助手和可集成的 Agent 应用。它更像云端 Agent 平台，适合和阿里云生态结合。",
      tags: ["Web", "Cloud", "API", "国内"],
      difficulty: "中等",
      model: "通义千问 / 百炼模型 / 阿里云生态",
      success: "能在百炼控制台创建单 Agent 应用，并完成一次预览调用。",
      source: "https://www.alibabacloud.com/help/zh/model-studio/single-agent-application",
      guide: {
        quick: [
          "登录阿里云百炼控制台。",
          "创建单 Agent 应用，选择模型和应用模板。",
          "配置提示词、知识库或工具。",
          "在控制台预览测试，再生成 API 或发布入口。"
        ],
        what: "阿里百炼 Agent 是阿里云 Model Studio 里的智能体应用能力，适合把模型、知识库、工具调用和企业系统连接起来。",
        fit: "适合已有阿里云账号、想做企业知识库、客服、内部流程助手或可 API 集成应用的人。",
        prepare: [
          "准备阿里云账号并完成必要认证。",
          "开通百炼/Model Studio 相关服务。",
          "准备模型调用额度、知识库资料和应用说明。"
        ],
        mac: [{ text: "控制台方式不需要本地安装，用浏览器打开百炼控制台。", code: "https://bailian.console.aliyun.com/" }],
        windows: [{ text: "Windows 同样用浏览器；如使用百炼 CLI，再按官方 install.md 配置。", code: "https://bailian.console.aliyun.com/" }],
        verify: [
          "应用能保存成功。",
          "预览窗口能回答问题。",
          "如果启用 API，能用官方示例发起一次调用。"
        ],
        deepseek: [
          "百炼主要服务阿里云模型和平台能力；外部模型接入以控制台当前支持为准。",
          "如果你只想用 DeepSeek，先获取 DeepSeek API Key，再选支持自定义 provider 的 Agent。"
        ],
        errors: [
          "没有权限：检查阿里云账号实名认证、RAM 权限和服务开通状态。",
          "调用失败：检查模型是否开通、额度是否充足。",
          "知识库不可用：确认文档已解析完成并绑定到应用。"
        ],
        sources: [
          ["阿里百炼单 Agent 应用", "https://www.alibabacloud.com/help/zh/model-studio/single-agent-application"],
          ["阿里云百炼 CLI 说明", "https://bailian.aliyun.com/cli/install.md"],
          ["通义灵码", "https://lingma.aliyun.com/"]
        ]
      }
    },
    {
      title: "Trae",
      group: "CODE / IDE",
      description: "字节系 AI IDE/代码助手，适合想在编辑器里直接写代码、改代码、理解项目的人。它比网页 Agent 更接近开发工具，适合网站和应用开发。",
      tags: ["Mac", "Windows", "IDE", "国内"],
      difficulty: "入门友好",
      model: "平台内模型 / 部分版本支持自定义能力",
      success: "能打开项目，并让 AI 解释或修改一个文件。",
      source: "https://www.trae.ai/",
      guide: {
        quick: [
          "打开 Trae 官网，下载对应系统安装包。",
          "安装后打开一个代码项目文件夹。",
          "登录账号，选择可用模型。",
          "让它解释当前项目结构，确认能读到文件。"
        ],
        what: "Trae 是 AI 原生 IDE/代码工具，重点是把 Agent 能力放进编码环境里，帮助你理解、生成和修改代码。",
        fit: "适合做网页、App、脚本和项目开发的人；小白可以把它当作“带 AI 的编辑器”。",
        prepare: [
          "准备一个代码项目文件夹。",
          "如果项目是前端，提前安装 Node.js；如果是 Python 项目，提前安装 Python。",
          "准备账号登录。"
        ],
        mac: [{ text: "去官网下载 macOS 安装包，拖入 Applications 后打开。", code: "https://www.trae.ai/" }],
        windows: [{ text: "去官网下载 Windows 安装包，按向导安装。国内版本可同时关注 trae.com.cn。", code: "https://www.trae.ai/" }],
        verify: [
          "能打开项目目录。",
          "AI 面板能识别当前文件。",
          "让它修改一个小文案或解释函数，能给出可用结果。"
        ],
        deepseek: [
          "Trae 的模型选择以当前版本开放为准。",
          "如果支持自定义模型，按它的模型设置页填入 DeepSeek API Key 和 Base URL。"
        ],
        errors: [
          "项目跑不起来：这通常是项目依赖问题，先在终端安装依赖。",
          "AI 不知道当前文件：确认你打开的是项目文件夹，不是单个孤立文件。",
          "登录失败：切换国内/国际版本入口再试。"
        ],
        sources: [
          ["Trae", "https://www.trae.ai/"],
          ["Trae 中国站", "https://www.trae.com.cn/"],
          ["MarsCode", "https://www.marscode.com/"]
        ]
      }
    },
    {
      title: "通义灵码",
      group: "CODE / CHINA",
      description: "阿里推出的 AI 编程助手，适合在 IDE 里补全、问答、生成单测、解释代码。它更像国内开发者常用的代码助手，不是完整工作流平台。",
      tags: ["IDE", "VS Code", "JetBrains", "国内"],
      difficulty: "入门友好",
      model: "通义系列模型",
      success: "IDE 里能登录通义灵码，并出现代码补全或问答回复。",
      source: "https://lingma.aliyun.com/",
      guide: {
        quick: [
          "打开通义灵码官网。",
          "按你的编辑器选择 VS Code、JetBrains 等插件。",
          "安装插件后登录阿里账号。",
          "打开项目，测试代码补全和侧边栏问答。"
        ],
        what: "通义灵码是阿里面向开发者的 AI 编码助手，主要能力是代码补全、代码解释、生成、测试和研发问答。",
        fit: "适合中国开发者、学生、前端/后端程序员，尤其适合已经在 VS Code 或 JetBrains 里写代码的人。",
        prepare: [
          "准备 VS Code、Cursor、JetBrains 系列 IDE 或官方支持的编辑器。",
          "准备阿里账号。",
          "打开一个真实代码项目测试，效果比空文件更容易判断。"
        ],
        mac: [{ text: "在你的 IDE 插件市场搜索“通义灵码”，或从官网下载入口跳转安装。", code: "https://lingma.aliyun.com/" }],
        windows: [{ text: "Windows 同样从 IDE 插件市场安装，安装后重启 IDE 并登录。", code: "https://lingma.aliyun.com/" }],
        verify: [
          "插件图标出现在 IDE 侧边栏。",
          "能成功登录。",
          "输入注释或函数名后能触发补全。"
        ],
        deepseek: [
          "通义灵码主要使用通义模型，不把 DeepSeek 作为默认接入路径。",
          "如果想用 DeepSeek 写代码，优先看 DeepCode、OpenClaw、Hermes。"
        ],
        errors: [
          "插件安装后不显示：重启 IDE，检查插件是否启用。",
          "补全不出现：确认当前文件类型受支持，并登录成功。",
          "企业网络问题：检查代理或公司网络限制。"
        ],
        sources: [
          ["通义灵码官网", "https://lingma.aliyun.com/"],
          ["阿里云百炼", "https://bailian.console.aliyun.com/"],
          ["阿里 Model Studio", "https://www.alibabacloud.com/help/zh/model-studio/"]
        ]
      }
    },
    {
      title: "OpenClaw / 龙虾",
      group: "OPEN / CODE",
      description: "面向代码任务的开源 Agent 工具，适合想用 DeepSeek、OpenAI 或自定义模型跑本地编码任务的人。它更适合愿意折腾命令行和配置文件的用户。",
      tags: ["CLI", "Open Source", "DeepSeek", "Code"],
      difficulty: "中等",
      model: "DeepSeek / OpenAI Compatible / 自定义 Base URL",
      success: "能配置模型 Key，并让工具在项目里完成一次读文件或改文件任务。",
      source: "https://api-docs.deepseek.com/zh-cn/guides/coding_agents",
      guide: {
        quick: [
          "先看项目 README，确认当前推荐安装方式。",
          "准备 Node.js 或项目要求的运行环境。",
          "把 DeepSeek API Key 放到环境变量或配置文件。",
          "在一个测试项目里运行，让它解释项目结构。"
        ],
        what: "OpenClaw/龙虾可以理解为偏开源路线的代码 Agent。它的价值在于更容易接 OpenAI Compatible 的模型服务，包括 DeepSeek 这类国产模型。",
        fit: "适合想省模型成本、想使用国产模型、愿意看 README 和跑命令的开发者。",
        prepare: [
          "准备 Git、Node.js 或 README 里要求的运行环境。",
          "准备 DeepSeek API Key。",
          "准备一个非重要项目先测试，避免一上来改正式项目。"
        ],
        mac: [{ text: "按项目 README 的当前命令安装；如果是 npm 包，一般类似：", code: "npm install -g <package-name>\n<command> --version" }],
        windows: [{ text: "Windows 建议使用 PowerShell 或 WSL。若项目依赖 Unix 工具，优先用 WSL。", code: "wsl --install" }],
        verify: [
          "版本命令能输出。",
          "配置文件能读取 DeepSeek Key。",
          "在测试项目中能完成一次解释或小改动。"
        ],
        deepseek: [
          "Base URL 使用 https://api.deepseek.com。",
          "模型名按工具当前文档填写 deepseek-chat 或 deepseek-reasoner。",
          "如果工具支持 OpenAI Compatible Provider，通常填 API Key、Base URL、Model 三项。"
        ],
        errors: [
          "包名或命令变了：以官方 README 为准，不复制过期教程。",
          "模型报错：确认模型名和 Base URL。",
          "改坏项目：用 Git 提前提交或新建测试分支。"
        ],
        sources: [
          ["DeepSeek Coding Agents", "https://api-docs.deepseek.com/zh-cn/guides/coding_agents"],
          ["Awesome DeepSeek Agent", "https://github.com/deepseek-ai/awesome-deepseek-agent/blob/main/README.zh-CN.md"],
          ["DeepSeek API Docs", "https://api-docs.deepseek.com/zh-cn/"]
        ]
      }
    },
    {
      title: "DeepSeek API Key",
      group: "KEY / INFRA",
      description: "这不是一个普通 Agent，而是很多 Agent 接入国产模型的钥匙。先搞懂 API Key、Base URL 和模型名，后面 Hermes、OpenClaw、DeepCode 等教程都会顺很多。",
      tags: ["API", "DeepSeek", "基础设施", "必看"],
      difficulty: "入门友好",
      model: "deepseek-chat / deepseek-reasoner",
      success: "拿到 API Key，并知道 Base URL 是 https://api.deepseek.com。",
      source: "https://api-docs.deepseek.com/zh-cn/",
      guide: {
        quick: [
          "打开 DeepSeek 开放平台并登录。",
          "进入 API Keys 页面，新建一个 Key。",
          "复制后立刻保存到安全位置，之后页面通常不会再完整显示。",
          "记住三件事：API Key、Base URL、模型名。"
        ],
        what: "DeepSeek API Key 是让第三方 Agent 调用 DeepSeek 模型的凭证。没有 Key，工具就不知道该用谁的额度、向哪个账号计费。",
        fit: "适合想把 DeepSeek 接进 Hermes、OpenClaw、DeepCode、Nanobot、自己写的脚本或其他 OpenAI Compatible 工具的人。",
        prepare: [
          "准备 DeepSeek 账号。",
          "准备可用余额或额度。",
          "准备一个安全的 Key 保存位置，不要发给别人。"
        ],
        mac: [{ text: "Mac 上可以把 Key 临时放进终端环境变量。", code: "export DEEPSEEK_API_KEY=\"你的 key\"\necho $DEEPSEEK_API_KEY" }],
        windows: [{ text: "Windows PowerShell 临时设置环境变量：", code: "$env:DEEPSEEK_API_KEY=\"你的 key\"\necho $env:DEEPSEEK_API_KEY" }],
        verify: [
          "你能在控制台看到 Key 已创建。",
          "Base URL 记为 https://api.deepseek.com。",
          "工具里填 Key 后不再报 401。"
        ],
        deepseek: [
          "常见三件套：API Key、Base URL、Model。",
          "Base URL：https://api.deepseek.com。",
          "聊天模型通常看 deepseek-chat；推理模型看 deepseek-reasoner；以官方模型页当前名称为准。"
        ],
        errors: [
          "401：Key 错了、Key 被删了、复制时多了空格。",
          "余额不足：去控制台检查额度或充值。",
          "把 Key 发到公开仓库：立刻删除并重新生成新 Key。"
        ],
        sources: [
          ["DeepSeek API Docs", "https://api-docs.deepseek.com/zh-cn/"],
          ["DeepSeek Coding Agents", "https://api-docs.deepseek.com/zh-cn/guides/coding_agents"],
          ["DeepSeek Agent Integrations", "https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/hermes"]
        ]
      }
    },
    {
      title: "DeepSeek 接入总教程",
      group: "MODEL / BRIDGE",
      description: "一张卡讲清怎么把 DeepSeek 接到 Agent 工具里：看工具是否支持 OpenAI Compatible，填 API Key、Base URL、模型名，再做一次最小验证。",
      tags: ["DeepSeek", "OpenAI Compatible", "教程", "桥接"],
      difficulty: "入门偏中等",
      model: "DeepSeek / 其他国产模型",
      success: "任意一个 Agent 能用 DeepSeek 成功回复一次。",
      source: "https://api-docs.deepseek.com/zh-cn/guides/coding_agents",
      guide: {
        quick: [
          "先确认工具支持自定义模型或 OpenAI Compatible Provider。",
          "准备 API Key、Base URL、Model 三项。",
          "Base URL 填 https://api.deepseek.com。",
          "保存后问一个简单问题，再让它读一个测试文件。"
        ],
        what: "这是国产模型接入 Agent 的通用方法。大部分支持 OpenAI Compatible 的工具，本质都是把请求发到一个兼容接口。",
        fit: "适合已经有 DeepSeek Key，但不知道该填在哪里的人。",
        prepare: [
          "确认你的 Agent 工具有 Model Provider、API Base、Base URL 或 OpenAI Compatible 设置项。",
          "准备 DeepSeek API Key。",
          "确认工具文档是否要求特殊模型名。"
        ],
        mac: [{ text: "通用环境变量写法：", code: "export DEEPSEEK_API_KEY=\"你的 key\"\nexport OPENAI_BASE_URL=\"https://api.deepseek.com\"" }],
        windows: [{ text: "PowerShell 通用写法：", code: "$env:DEEPSEEK_API_KEY=\"你的 key\"\n$env:OPENAI_BASE_URL=\"https://api.deepseek.com\"" }],
        verify: [
          "先发一句普通聊天，看是否回复。",
          "再做一个低风险任务，比如总结 README。",
          "最后再让它改一个测试文件，不要一开始改正式项目。"
        ],
        deepseek: [
          "Hermes：用 hermes setup 选择 DeepSeek。",
          "OpenClaw：按 README 填 OpenAI Compatible 配置。",
          "DeepCode/Nanobot：按 DeepSeek 官方集成文档安装和配置。"
        ],
        errors: [
          "Base URL 写成网页地址：必须是 API 地址，不是 deepseek.com 首页。",
          "模型名过期：查官方模型列表。",
          "工具不支持自定义模型：换 Hermes、OpenClaw、DeepCode 等更适合的工具。"
        ],
        sources: [
          ["DeepSeek Coding Agents", "https://api-docs.deepseek.com/zh-cn/guides/coding_agents"],
          ["Hermes DeepSeek 接入", "https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/hermes"],
          ["Awesome DeepSeek Agent", "https://github.com/deepseek-ai/awesome-deepseek-agent/blob/main/README.zh-CN.md"]
        ]
      }
    },
    {
      title: "DeepCode / Nanobot",
      group: "DEEPSEEK / CLI",
      description: "DeepSeek 官方文档里提到的编码 Agent 集成方向，适合想直接围绕 DeepSeek 做终端代码任务的人。DeepCode 偏 coding CLI，Nanobot 偏轻量 Agent。",
      tags: ["CLI", "DeepSeek", "Code", "Open"],
      difficulty: "中等",
      model: "DeepSeek-V4 / DeepSeek API",
      success: "deepcode 或 nanobot 版本命令正常，并能调用 DeepSeek 完成一次任务。",
      source: "https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/deepcode",
      guide: {
        quick: [
          "先安装 Node.js 18+ 或 uv，取决于你选 DeepCode 还是 Nanobot。",
          "DeepCode 用 npm 全局安装。",
          "Nanobot 用 uv tool install。",
          "配置 DeepSeek API Key 后，在测试项目里运行一次。"
        ],
        what: "DeepCode 和 Nanobot 都是更偏命令行的 Agent 工具。它们适合把 DeepSeek 作为主模型来完成代码或自动化任务。",
        fit: "适合愿意使用终端、想用 DeepSeek 降低模型成本的开发者。",
        prepare: [
          "DeepCode：准备 Node.js 18+。",
          "Nanobot：准备 uv。",
          "准备 DeepSeek API Key。"
        ],
        mac: [
          { text: "DeepCode：", code: "npm install -g @vegamo/deepcode-cli\ndeepcode --version" },
          { text: "Nanobot：", code: "uv tool install nanobot-ai\nnanobot --version" }
        ],
        windows: [
          { text: "DeepCode：先装 Node.js LTS，再运行：", code: "npm install -g @vegamo/deepcode-cli\ndeepcode --version" },
          { text: "Nanobot：安装 uv 后运行；如果命令找不到，执行 uv tool update-shell 或把 .local/bin 加进 PATH。", code: "uv tool install nanobot-ai\nuv tool update-shell" }
        ],
        verify: [
          "版本命令能输出。",
          "DeepSeek API Key 能被工具读取。",
          "在测试目录里能完成一次 README 总结或小代码生成。"
        ],
        deepseek: [
          "这些工具本来就围绕 DeepSeek 集成，重点是 Key、额度和模型名正确。",
          "如果调用失败，先用最简单 prompt 测试，不要直接跑复杂项目。"
        ],
        errors: [
          "npm 权限错误：换 Node 版本管理器或修正全局 npm 权限。",
          "uv 命令找不到：重开终端或更新 PATH。",
          "模型调用失败：检查 DeepSeek Key、余额和网络。"
        ],
        sources: [
          ["DeepCode 集成", "https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/deepcode"],
          ["Nanobot 集成", "https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/nanobot"],
          ["DeepSeek API Docs", "https://api-docs.deepseek.com/zh-cn/"]
        ]
      }
    },
    {
      title: "CloudBase AI Agent",
      group: "TENCENT / API",
      description: "腾讯云 CloudBase 的 AI Agent 接入能力，适合把已经配置好的 Agent 通过 HTTP API 接到小程序、网页、客服或后端服务里。",
      tags: ["API", "腾讯云", "小程序", "SSE"],
      difficulty: "中等",
      model: "腾讯云 Agent / 平台配置模型",
      success: "拿到 Agent Token，并通过 HTTP API 收到一次 SSE 回复。",
      source: "https://docs.cloudbase.net/http-api/ai-bot/ai-agent-%E6%8E%A5%E5%85%A5",
      guide: {
        quick: [
          "先在腾讯云/CloudBase 创建或配置 Agent。",
          "获取接入 Token 或接口凭证。",
          "用官方 HTTP API 示例发起请求。",
          "确认前端或后端能处理 SSE 流式返回。"
        ],
        what: "CloudBase AI Agent 更偏开发集成，不是普通网页聊天工具。它让你把腾讯云里的 Agent 接进自己的应用。",
        fit: "适合做小程序、网页客服、企业应用、后端 API 集成的人。",
        prepare: [
          "腾讯云账号和 CloudBase 环境。",
          "已配置好的 Agent。",
          "能发 HTTP 请求的前端或后端项目。"
        ],
        mac: [{ text: "Mac 不需要安装专门客户端；用浏览器配置平台，用 curl 或项目代码测试 API。", code: "curl --version" }],
        windows: [{ text: "Windows 用浏览器配置平台；API 测试可用 PowerShell、Postman 或项目代码。", code: "curl --version" }],
        verify: [
          "接口返回 200。",
          "能收到流式文本。",
          "应用前端能正确展示回复。"
        ],
        deepseek: [
          "CloudBase 主要跟腾讯云内的 Agent 配置绑定。",
          "若后台 Agent 支持外部模型，再按平台模型配置页处理；否则不要强行把 DeepSeek Key 塞进 HTTP 接入层。"
        ],
        errors: [
          "401/403：Token、环境 ID 或权限错误。",
          "前端没有流式显示：检查 SSE 解析。",
          "跨域失败：把调用放后端，或按 CloudBase 文档配置域名。"
        ],
        sources: [
          ["CloudBase AI Agent 接入", "https://docs.cloudbase.net/http-api/ai-bot/ai-agent-%E6%8E%A5%E5%85%A5"],
          ["腾讯云 CloudBase", "https://cloud.tencent.com/product/tcb"],
          ["腾讯云 ADP", "https://cloud.tencent.com/product/adp"]
        ]
      }
    },
    {
      title: "腾讯云 ADP",
      group: "TENCENT / ENTERPRISE",
      description: "腾讯云智能体开发平台，适合企业做 RAG、Workflow、多 Agent 和业务系统集成。它更偏企业级平台，不是个人本地安装软件。",
      tags: ["Cloud", "RAG", "Workflow", "企业"],
      difficulty: "中等偏高",
      model: "腾讯云模型 / 企业模型配置",
      success: "能在控制台创建应用，并完成一次知识库或工作流测试。",
      source: "https://cloud.tencent.com/product/adp",
      guide: {
        quick: [
          "打开腾讯云 ADP 产品页，进入控制台。",
          "创建智能体应用，选择模型、知识库或工作流。",
          "配置测试数据。",
          "在控制台完成一次端到端预览。"
        ],
        what: "ADP 是腾讯云面向企业的智能体开发平台，重点在 RAG、Workflow、多 Agent 协作和业务集成。",
        fit: "适合企业知识库、内部流程自动化、客服、数据查询和业务系统集成。",
        prepare: [
          "腾讯云账号和相关权限。",
          "企业资料、知识库或业务 API。",
          "明确 Agent 的业务边界和上线渠道。"
        ],
        mac: [{ text: "使用浏览器进入腾讯云控制台，无需本地安装。", code: "https://cloud.tencent.com/product/adp" }],
        windows: [{ text: "Windows 同样使用浏览器进入控制台。", code: "https://cloud.tencent.com/product/adp" }],
        verify: [
          "应用能创建成功。",
          "知识库检索或工作流节点能跑通。",
          "能拿到发布或 API 集成方式。"
        ],
        deepseek: [
          "ADP 的模型接入以腾讯云平台当前能力为准。",
          "企业场景优先考虑平台支持、合规和权限，不建议小白自行中转模型。"
        ],
        errors: [
          "权限不够：联系腾讯云主账号或管理员开权限。",
          "知识库效果差：先优化文档结构和切分策略。",
          "成本不清楚：上线前看清模型调用、存储和流量计费。"
        ],
        sources: [
          ["腾讯云 ADP", "https://cloud.tencent.com/product/adp"],
          ["ADP 官网", "https://adp.tencentcloud.com/zh"],
          ["腾讯云", "https://cloud.tencent.com/"]
        ]
      }
    },
    {
      title: "AutoGLM",
      group: "ZHIPU / OPEN",
      description: "智谱生态的 Agent/自动化方向工具，适合研究 GUI Agent、自动操作和国产模型智能体能力。它更偏实验和开发者，不是最小白的第一站。",
      tags: ["Open Source", "GUI", "国产模型", "实验"],
      difficulty: "中等偏高",
      model: "GLM / BigModel / 兼容模型",
      success: "能安装示例项目，并让它完成一次安全的演示任务。",
      source: "https://github.com/zai-org/Open-AutoGLM",
      guide: {
        quick: [
          "先阅读 GitHub README，确认当前推荐环境。",
          "准备 Python 环境和模型 API Key。",
          "如果使用 AutoGLM-GUI，可先 pip 安装包进行体验。",
          "只在测试环境运行自动操作任务。"
        ],
        what: "AutoGLM 是智谱生态里围绕自动化和 GUI Agent 的方向。它适合研究 Agent 如何操作界面、完成多步骤任务。",
        fit: "适合开发者、研究者、想了解国产 GUI Agent 的人；不建议完全小白一上来就作为主力工具。",
        prepare: [
          "准备 Python 环境。",
          "准备 BigModel/智谱或兼容模型 API Key。",
          "准备一个安全测试环境，不要让它直接操作重要账号。"
        ],
        mac: [{ text: "以 AutoGLM-GUI 为例，可先尝试：", code: "pip install autoglm-gui\nautoglm-gui --help" }],
        windows: [{ text: "Windows 先安装 Python，再用 PowerShell 或 CMD 安装。", code: "pip install autoglm-gui\nautoglm-gui --help" }],
        verify: [
          "包能安装成功。",
          "help 命令能输出。",
          "配置 Key 后能跑官方示例。"
        ],
        deepseek: [
          "AutoGLM 更偏 GLM/BigModel 生态。",
          "部分 GUI 包支持 base-url 参数时，可以尝试兼容模型，但要以项目说明为准。"
        ],
        errors: [
          "Python 版本不对：按 README 指定版本创建虚拟环境。",
          "GUI 权限问题：检查系统辅助功能或屏幕录制权限。",
          "模型不兼容：先用官方推荐模型跑通，再尝试其他模型。"
        ],
        sources: [
          ["Open-AutoGLM", "https://github.com/zai-org/Open-AutoGLM"],
          ["AutoGLM-GUI", "https://github.com/suyiiyii/AutoGLM-GUI"],
          ["智谱开放平台", "https://open.bigmodel.cn/"]
        ]
      }
    }
  ];

  let pages = [
    "热门国外 Agent",
    "国内智能体平台",
    "代码与开发 Agent",
    "DeepSeek 接入基础",
    "云端与实验型 Agent"
  ];

  function lockPageScroll() {
    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    document.documentElement.classList.add("agent-modal-lock");
    document.body.classList.add("agent-modal-lock");
    document.body.style.top = `-${lockedScrollY}px`;
  }

  function unlockPageScroll() {
    document.documentElement.classList.remove("agent-modal-lock");
    document.body.classList.remove("agent-modal-lock");
    document.body.style.top = "";
    window.scrollTo(0, lockedScrollY);
  }

  function ensureStylesheet() {
    if (document.querySelector('link[href*="agent-guide.css"]')) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/assets/custom/agent-guide.css?v=20260706a";
    document.head.appendChild(link);
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function renderList(items, className = "agent-modal__list") {
    const list = el("ul", className);
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
    return list;
  }

  function renderInstallSteps(steps) {
    const wrap = document.createDocumentFragment();
    steps.forEach((step) => {
      const text = el("p", "agent-modal__text", step.text);
      wrap.appendChild(text);
      if (step.code) {
        const code = el("pre", "agent-modal__code", step.code);
        wrap.appendChild(code);
      }
    });
    return wrap;
  }

  function addSection(parent, title, content) {
    const section = el("section", "agent-modal__section");
    section.appendChild(el("span", "agent-modal__section-title", title));

    if (Array.isArray(content)) section.appendChild(renderList(content));
    else if (content instanceof DocumentFragment) section.appendChild(content);
    else section.appendChild(el("p", "agent-modal__text", content));

    parent.appendChild(section);
  }

  function listFrom(value) {
    if (Array.isArray(value)) return value.filter(Boolean).map(String);
    if (typeof value !== "string") return [];
    return value
      .split(/\n|[,，]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function stepsFrom(value) {
    if (Array.isArray(value)) {
      return value.map((item) => {
        if (typeof item === "string") return { text: item, code: "" };
        return { text: item.text || "", code: item.code || "" };
      }).filter((item) => item.text || item.code);
    }

    return listFrom(value).map((text) => ({ text, code: "" }));
  }

  function sourcesFrom(value, fallbackUrl) {
    if (Array.isArray(value)) {
      return value.map((item, index) => {
        if (Array.isArray(item)) return [item[0] || `资料 ${index + 1}`, item[1] || fallbackUrl || "#"];
        if (typeof item === "object" && item) return [item.label || item.title || `资料 ${index + 1}`, item.url || item.href || fallbackUrl || "#"];
        return [`资料 ${index + 1}`, String(item)];
      });
    }

    const links = listFrom(value);
    if (links.length) return links.map((href, index) => [`资料 ${index + 1}`, href]);
    return [[fallbackUrl ? "官网 / 文档" : "资料入口", fallbackUrl || "#"]];
  }

  function mapContentItem(item) {
    const data = item.data || {};
    const tags = listFrom(item.tags);
    const requirements = listFrom(data.prepare || data.requirements);
    const steps = stepsFrom(data.steps);
    const link = item.link_url || data.tool_url || "#";

    return {
      title: item.title,
      group: data.group || item.category || "AGENT / GUIDE",
      description: item.summary || "",
      tags: tags.length ? tags : ["Agent", "Guide"],
      difficulty: data.difficulty || "入门友好",
      model: data.model || data.tool_type || "按教程配置",
      success: data.success || "能按步骤完成一次验证。",
      source: link,
      guide: {
        quick: listFrom(data.quick).length ? listFrom(data.quick) : (steps.length ? steps.map((step) => step.text || step.code) : ["打开教程入口。", "按步骤完成配置。", "做一次最小验证。"]),
        what: data.what || item.summary || "这是一个可以通过后台维护的 Agent 教程卡片。",
        fit: data.use_cases || "适合需要按步骤安装、配置或理解这个工具的人。",
        prepare: requirements.length ? requirements : ["准备账号、网络环境和需要的 API Key。"],
        mac: stepsFrom(data.mac).length ? stepsFrom(data.mac) : steps,
        windows: stepsFrom(data.windows).length ? stepsFrom(data.windows) : steps,
        verify: listFrom(data.verify).length ? listFrom(data.verify) : ["完成一次打开、登录或调用测试。"],
        deepseek: listFrom(data.deepseek || data.call_instruction).length ? listFrom(data.deepseek || data.call_instruction) : ["按工具文档填写模型、API Key 和 Base URL。"],
        errors: listFrom(data.errors).length ? listFrom(data.errors) : ["如果失败，先检查账号、权限、网络和填写内容。"],
        sources: sourcesFrom(data.tool_links, link),
      },
    };
  }

  function buildCard(card, index) {
    const button = el("button", "agent-card");
    button.type = "button";
    button.dataset.index = String(index);
    button.innerHTML = `
      <div class="agent-card__aside">
        <div class="agent-card__meta-row">
          <span class="agent-card__meta"></span>
        </div>
        <h2 class="agent-card__title"></h2>
        <div class="agent-card__tags"></div>
        <span class="agent-card__source">OPEN TUTORIAL</span>
      </div>
      <div class="agent-card__content">
        <p class="agent-card__description"></p>
        <div class="agent-card__details">
          <div class="agent-card__detail">
            <span class="agent-card__detail-label">DIFFICULTY</span>
            <span class="agent-card__detail-value"></span>
          </div>
          <div class="agent-card__detail">
            <span class="agent-card__detail-label">MODEL</span>
            <span class="agent-card__detail-value"></span>
          </div>
          <div class="agent-card__detail">
            <span class="agent-card__detail-label">SUCCESS</span>
            <span class="agent-card__detail-value"></span>
          </div>
        </div>
      </div>
    `;

    button.querySelector(".agent-card__meta").textContent = card.group;
    button.querySelector(".agent-card__title").textContent = card.title;
    button.querySelector(".agent-card__description").textContent = card.description;
    const values = button.querySelectorAll(".agent-card__detail-value");
    values[0].textContent = card.difficulty;
    values[1].textContent = card.model;
    values[2].textContent = card.success;

    const tagWrap = button.querySelector(".agent-card__tags");
    card.tags.forEach((tag) => tagWrap.appendChild(el("span", "agent-card__tag", tag)));

    button.onclick = () => openModal(card, button);
    button.onkeydown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openModal(card, button);
    };
    return button;
  }

  function buildModal() {
    const modal = el("div", "agent-modal");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="agent-modal__panel" role="document">
        <header class="agent-modal__header">
          <div>
            <span class="agent-modal__eyebrow"></span>
            <h2 class="agent-modal__title"></h2>
          </div>
          <button class="agent-modal__close" type="button" aria-label="关闭教程">x</button>
        </header>
        <div class="agent-modal__body"></div>
      </div>
    `;

    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    modal.addEventListener("wheel", (event) => {
      const body = modal.querySelector(".agent-modal__body");
      if (!body) return;

      if (!body.contains(event.target)) {
        event.preventDefault();
        body.scrollTop += event.deltaY;
      }
      event.stopPropagation();
    }, { passive: false });
    modal.querySelector(".agent-modal__close").addEventListener("click", closeModal);
    document.body.appendChild(modal);
    return modal;
  }

  function openModal(card, trigger) {
    lastFocus = trigger;
    const modal = document.querySelector(".agent-modal") || buildModal();
    modal.querySelector(".agent-modal__eyebrow").textContent = card.group;
    modal.querySelector(".agent-modal__title").textContent = card.title;

    const body = modal.querySelector(".agent-modal__body");
    body.innerHTML = "";
    addSection(body, "3 MIN QUICK START", card.guide.quick);
    addSection(body, "这个 Agent 是什么", card.guide.what);
    addSection(body, "适合谁", card.guide.fit);
    addSection(body, "官网 / 下载入口", `官网或文档入口：${card.source}`);
    addSection(body, "安装前要准备什么", card.guide.prepare);
    addSection(body, "Mac 安装", renderInstallSteps(card.guide.mac));
    addSection(body, "Windows 安装", renderInstallSteps(card.guide.windows));
    addSection(body, "验证是否成功", card.guide.verify);
    addSection(body, "如何接入 DeepSeek / 国产模型", card.guide.deepseek);
    addSection(body, "常见报错", card.guide.errors);

    const sourceSection = el("section", "agent-modal__section");
    sourceSection.appendChild(el("span", "agent-modal__section-title", "官方资料"));
    const sourceList = el("ul", "agent-modal__source-list");
    card.guide.sources.forEach(([label, href]) => {
      const item = document.createElement("li");
      const link = el("a", "agent-modal__source-link", label);
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener";
      item.appendChild(link);
      sourceList.appendChild(item);
    });
    sourceSection.appendChild(sourceList);
    body.appendChild(sourceSection);

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    body.scrollTop = 0;
    lockPageScroll();
    modal.querySelector(".agent-modal__close").focus();
  }

  function closeModal() {
    const modal = document.querySelector(".agent-modal");
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    unlockPageScroll();
    if (lastFocus) lastFocus.focus();
  }

  function renderPage(section) {
    const cards = section.querySelector(".agent-guide__cards");
    const pageTitle = section.querySelector(".agent-guide__page-title");
    const pageCount = section.querySelector(".agent-guide__page-count");
    const start = currentPage * pageSize;
    const currentTools = tools.slice(start, start + pageSize);

    pageTitle.textContent = pages[currentPage] || `Agent Page ${currentPage + 1}`;
    pageCount.textContent = `PAGE ${currentPage + 1} / ${Math.ceil(tools.length / pageSize)}`;
    cards.innerHTML = "";
    currentTools.forEach((card, offset) => cards.appendChild(buildCard(card, start + offset)));
    revealCards(section);
    renderPager(section);
  }

  function renderPager(section) {
    const pager = section.querySelector(".agent-guide__pager");
    const total = Math.ceil(tools.length / pageSize);
    pager.innerHTML = "";

    const prev = el("button", "agent-guide__page-button", "PREV");
    prev.type = "button";
    prev.disabled = currentPage === 0;
    prev.addEventListener("click", () => {
      currentPage = Math.max(0, currentPage - 1);
      renderPage(section);
    });
    pager.appendChild(prev);

    for (let i = 0; i < total; i += 1) {
      const page = el("button", `agent-guide__page-button${i === currentPage ? " is-active" : ""}`, String(i + 1));
      page.type = "button";
      page.setAttribute("aria-label", `打开第 ${i + 1} 页`);
      page.addEventListener("click", () => {
        currentPage = i;
        renderPage(section);
      });
      pager.appendChild(page);
    }

    const next = el("button", "agent-guide__page-button", "NEXT");
    next.type = "button";
    next.disabled = currentPage === total - 1;
    next.addEventListener("click", () => {
      currentPage = Math.min(total - 1, currentPage + 1);
      renderPage(section);
    });
    pager.appendChild(next);
  }

  function buildSection() {
    const section = document.createElement("section");
    section.className = "agent-guide";
    section.setAttribute("aria-label", "Agent 工具安装教程库");
    section.innerHTML = `
      <div class="agent-guide__inner">
        <div class="agent-guide__label">AGENT INSTALL GUIDE</div>
        <div class="agent-guide__intro">
          <h1 class="agent-guide__title">Agent 工具安装教程库</h1>
          <p class="agent-guide__copy">每张卡片都是一个 Agent 工具入口：先看它是什么、适合谁、怎么判断装成功，再点开完整教程。第一页放热门工具，后面按国内平台、代码工具和模型接入继续翻页。</p>
        </div>
        <div class="agent-guide__toolbar">
          <h2 class="agent-guide__page-title"></h2>
          <span class="agent-guide__page-count"></span>
        </div>
        <div class="agent-guide__cards"></div>
        <div class="agent-guide__pager" aria-label="Agent 教程分页"></div>
      </div>
    `;
    section.addEventListener("click", (event) => {
      const card = event.target.closest?.(".agent-card");
      if (!card) return;
      const index = Number(card.dataset.index);
      if (!Number.isInteger(index) || !tools[index]) return;
      openModal(tools[index], card);
    });
    renderPage(section);
    return section;
  }

  async function hydrateContent(section) {
    try {
      const { fetchPublishedContentItems } = await import("/assets/custom/content-api.js?v=20260708a");
      const items = await fetchPublishedContentItems("agent-guide");
      if (!items.length) return;

      tools = items.map(mapContentItem);
      pages = Array.from({ length: Math.ceil(tools.length / pageSize) }, (_, index) => `Agent 教程 ${index + 1}`);
      currentPage = 0;
      renderPage(section);
    } catch (error) {
      console.warn("[FY Content] agent-guide fallback content used:", error);
    }
  }

  function normalizeBreadcrumb() {
    const breadcrumb = document.querySelector('[data-framer-name="breadcrumb"]');
    if (!breadcrumb) return;

    const textNodes = [];
    const walker = document.createTreeWalker(breadcrumb, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    const words = ["FY", "/", "Agent Guide"];
    textNodes.forEach((node, index) => {
      const value = node.nodeValue || "";
      node.nodeValue = index < words.length ? value.replace(value.trim(), words[index]) : "";
    });
  }

  function normalizeAnimatedTitle() {
    document.querySelectorAll('[data-framer-name="Title Container"] h2, [data-framer-name="Title Container"] h4').forEach((heading) => {
      const compact = heading.textContent.replace(/\s+/g, "").toLowerCase();
      const legacyIdentity = String.fromCharCode(106, 228, 114, 118, 97, 118, 101, 99, 107, 97, 110, 105, 100, 101, 110, 116, 105, 116, 121);
      const newIdentity = ["agent", "guide", "identity"].join("");
      if (compact !== legacyIdentity && compact !== newIdentity) return;

      const words = ["Agent", "Guide"];
      const wordNodes = Array.from(heading.children).filter((node) => node.tagName === "SPAN");
      wordNodes.forEach((wordNode, wordIndex) => {
        const letters = Array.from(wordNode.querySelectorAll("span")).filter((span) => {
          return span.children.length === 0 && span.textContent.trim();
        });
        const nextLetters = Array.from(words[wordIndex] || "");

        letters.forEach((letter, index) => {
          const wrapper = letter.parentElement;
          if (index < nextLetters.length) {
            letter.textContent = nextLetters[index];
            if (wrapper) wrapper.style.display = "";
            return;
          }
          letter.textContent = "";
          if (wrapper) wrapper.style.display = "none";
        });
      });

      heading.setAttribute("aria-label", "Agent Guide");
      heading.dataset.agentGuideTitleNormalized = "true";
    });
  }

  function normalizeHomeLinks() {
    document.querySelectorAll("a").forEach((link) => {
      if (link.textContent.trim() !== "主页") return;
      link.setAttribute("href", "/");
      if (link.dataset.agentHomeFixed === "true") return;
      link.dataset.agentHomeFixed = "true";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.location.assign("/");
      }, true);
    });
  }

  function normalizeFooterWechatText() {
    document.querySelectorAll("a").forEach((link) => {
      if (!link.textContent.includes("数字生命丰胖子")) return;
      if (link.dataset.agentFooterTextOnly === "true") return;

      const textOnly = document.createElement("div");
      Array.from(link.attributes).forEach((attribute) => {
        if (["href", "target", "rel"].includes(attribute.name)) return;
        textOnly.setAttribute(attribute.name, attribute.value);
      });
      textOnly.classList.add("agent-footer-text-only");
      textOnly.dataset.agentFooterTextOnly = "true";
      textOnly.innerHTML = link.innerHTML;
      link.replaceWith(textOnly);
    });
  }

  function revealCards(section) {
    const items = Array.from(section.querySelectorAll(".agent-card"));
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    items.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 80, 240)}ms`;
      observer.observe(item);
    });
  }

  function init() {
    ensureStylesheet();
    document.documentElement.classList.add("agent-guide-page");
    normalizeBreadcrumb();
    normalizeAnimatedTitle();
    normalizeHomeLinks();
    normalizeFooterWechatText();

    if (document.querySelector(".agent-guide")) return true;

    const header = document.querySelector('[data-framer-name="case-header"]');
    const fallback = document.querySelector('[data-framer-name="Video Case Section"]');
    const anchor = header || fallback;
    if (!anchor?.parentNode) return false;

    const section = buildSection();
    anchor.parentNode.insertBefore(section, anchor.nextSibling);
    hydrateContent(section);
    return true;
  }

  function scheduleInit() {
    init();
    [120, 480, 1200, 2400].forEach((delay) => window.setTimeout(init, delay));

    if ("MutationObserver" in window) {
      const observer = new MutationObserver(() => {
        normalizeAnimatedTitle();
        normalizeFooterWechatText();
        if (!document.querySelector(".agent-guide")) init();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      window.setTimeout(() => observer.disconnect(), 5000);
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleInit, { once: true });
  } else {
    scheduleInit();
  }
})();
