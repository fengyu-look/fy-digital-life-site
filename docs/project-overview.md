# FY Digital Life 项目整体说明

更新日期：2026-07-09

这是一个个人内容站 / 数字生活站。前台主要展示首页、关于页、推荐页、摄影页和作品页；后台用于维护推荐卡片和个人资料。

## 项目定位

网站名称：

- `FY Digital Life`

当前目标：

- 保持新站现有视觉风格。
- 提供长期在线访问。
- 后期通过后台更新内容，而不是每次手动改代码。

当前线上地址：

- `https://fengyu-look.github.io/`

后台地址：

- `https://fengyu-look.github.io/admin/`

## 技术架构

### 前台

- 静态 HTML / CSS / JS
- 保留 Framer 导出的运行结构与资源
- 自定义逻辑放在 `public/assets/custom/`

### 后台

- 静态后台页面：`public/admin/index.html`
- 后台脚本：`public/assets/custom/admin.js`
- 后台样式：`public/assets/custom/admin.css`
- 通过 Supabase REST API 读写数据

### 数据与存储

- Supabase Auth：后台登录
- Supabase Database：内容数据
- Supabase Storage：图片 / 视频上传
- Storage bucket：`site-media`

### 部署

- 源码仓库：`fy-digital-life-site`
- Pages 仓库：`fengyu-look.github.io`
- 静态构建目录：`dist/`
- 发布命令：`npm run deploy:pages`

## 页面体系

当前新站页面：

- `/`
- `/studio/useful-websites`
- `/studio/prompt-collection`
- `/studio/skill-workflow`
- `/studio/photography`
- `/studio/agent-guide`
- `/studio/vibe-coding-lab`
- `/studio/digital-life`

其中 5 个推荐页已经接入后台内容读取：

- `/studio/useful-websites`
- `/studio/prompt-collection`
- `/studio/skill-workflow`
- `/studio/photography`
- `/studio/agent-guide`

`/studio/digital-life` 是关于页，已经接入 `profile` 表读取。后台修改昵称、介绍、联系方式、真人照片后，前台会自动同步；导航悬浮卡片头像和关于页真人照片分开处理。

## 重要文件结构

```text
.
├── docs/
│   ├── cloudflare-pages.md
│   ├── supabase-setup.md
│   ├── agent-handoff-next-plan.md
│   └── project-overview.md
├── public/
│   ├── admin/
│   │   └── index.html
│   ├── assets/
│   │   └── custom/
│   │       ├── admin.css
│   │       ├── admin.js
│   │       ├── content-api.js
│   │       ├── digital-life.js
│   │       ├── site-supabase.js
│   │       ├── site-route-guard.js
│   │       ├── useful-websites.js
│   │       ├── prompt-collection.js
│   │       ├── skill-workflow.js
│   │       ├── studio-photography.js
│   │       └── agent-guide.js
│   ├── index.html
│   └── studio/
│       ├── useful-websites/
│       ├── prompt-collection/
│       ├── skill-workflow/
│       ├── photography/
│       ├── agent-guide/
│       ├── vibe-coding-lab/
│       └── digital-life/
├── scripts/
│   ├── build-site.mjs
│   ├── deploy-pages.mjs
│   ├── check-cloudflare-pages.mjs
│   ├── route-policy.mjs
│   ├── routes.mjs
│   ├── server.mjs
│   └── validate-routes.mjs
└── supabase/
    └── migrations/
        ├── 202607080001_initial_content.sql
        └── 202607080002_flexible_content_admin.sql
```

## NPM 命令

```bash
npm run dev
```

启动本地预览，默认：

- `http://localhost:5173/`

```bash
npm run validate:routes
```

检查发布路由，防止旧站路径回流。

```bash
npm run build
```

构建到 `dist/`。

```bash
npm run deploy:pages
```

完整发布到 GitHub Pages。这个命令会自动执行：

1. `validate:routes`
2. `build`
3. `deploy:check`
4. 推送 `dist/` 到 `fengyu-look.github.io`

## 环境变量

构建发布需要媒体外链：

```bash
MEDIA_BASE_URL="https://wwobcjkakedxyruxulfj.supabase.co/storage/v1/object/public/site-media"
```

如果使用 `npm run deploy:pages`，也可以放在 `.env.local`：

```text
MEDIA_BASE_URL=https://wwobcjkakedxyruxulfj.supabase.co/storage/v1/object/public/site-media
```

不要把任何密码或私密服务端 key 写入仓库。

## Supabase 数据模型

### `content_pages`

用于配置每个推荐页：

- `page_key`
- `title`
- `intro`
- `layout_type`
- `settings`
- `is_enabled`

### `content_items`

用于存放不同页面的卡片内容：

- `id`
- `page_key`
- `item_type`
- `title`
- `summary`
- `cover_url`
- `link_url`
- `tags`
- `sort_order`
- `layout_variant`
- `is_published`
- `data`

`data` 是 JSONB，用来放不同页面的个性化字段。

### `profile`

用于关于页个人资料：

- `nickname`
- `email`
- `avatar_url`
- `real_photo_url`
- `intro`
- `contacts`
- `social_links`

### `admin_users`

用于判断后台管理员。

## 5 个推荐页字段设计

### 实用网站：`useful-websites`

字段：

- 网页名称
- 简介
- 链接
- 封面
- 分类
- 标签
- 价格 / 状态
- 推荐理由
- 按钮文案

### 提示词宇宙：`prompt-collection`

字段：

- 标题
- 说明
- 封面
- 提示词分类
- 完整提示词
- 反向提示词
- 模型 / 工具
- 复制按钮文案

### Skill 工具箱：`skill-workflow`

字段：

- Skill / Workflow 名称
- 用途说明
- 适用场景
- 包含项
- 链接
- 调用说明
- 按钮文案

### 摄影页：`photography`

字段：

- 图片 / 视频 URL
- 标题
- 说明
- 图片比例
- 焦点
- 地点
- 拍摄时间

### Agent 安装教程：`agent-guide`

字段：

- 教程标题
- 难度
- 前置要求
- 步骤 JSON
- 工具链接 JSON
- 封面图
- 链接

## 设计原则

必须保持：

- 首页英文艺术字效果不变。
- 首页视频、动效、导航不变。
- 关于页正文是真人照片。
- 导航悬浮卡片是赛博头像。
- 摄影页图片和动画不破。
- 新站 8 个页面保持当前视觉体系。

不要随便改：

- `data-framer-*`
- `framer-*`
- Framer 模块 preload
- Framer 字体和资源引用
- 页面导航、页尾、视频、动效

## 发布注意事项

GitHub Pages 有文件大小限制。

项目构建时通过 `MEDIA_BASE_URL` 把大视频资源改成 Supabase Storage 外链，并从 `dist/` 移除本地大文件。

发布前必须跑：

```bash
npm run validate:routes
MEDIA_BASE_URL="https://wwobcjkakedxyruxulfj.supabase.co/storage/v1/object/public/site-media" npm run build
```

如果要直接发布：

```bash
npm run deploy:pages
```

## 当前风险点

1. 前台大量页面仍是 Framer 导出结构，不能像普通 React/Vue 项目那样随便重构。
2. 后台已经能用，但仍是轻量版管理系统，不是完整 CMS。
3. 关于页前台读取 `profile` 仍建议继续完善。
4. 旧表 `recommendations` 暂时保留，避免误删。
5. 如果 Supabase 权限策略被改坏，后台会出现 `permission denied` 或 `JWT expired`。

## 给后续 Agent 的工作建议

优先级：

1. 不改前台视觉。
2. 先做关于页 profile 动态读取。
3. 再优化后台图片上传和卡片编辑体验。
4. 再迁移正式内容到 Supabase。
5. 每次只改一小块，跑校验、构建、线上检查。
