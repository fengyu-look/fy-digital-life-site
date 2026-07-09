# FY Digital Life 后台改造交接与剩余计划

更新日期：2026-07-09

本文给后续接手的 Agent 使用。请只基于当前项目代码和本文工作，不要追溯旧对话。

## 当前目标

网站前端已经基本完成，正在把内容改造成可通过后台维护的长期在线内容站。

现阶段重点不是重做页面设计，而是：

- 保持现有新站前台视觉不变。
- 后台可管理 5 个推荐页内容。
- Supabase 负责数据库、登录、图片/视频存储。
- GitHub Pages 负责静态站发布。

## 已完成内容

### 1. 部署与发布

- 源码仓库：`https://github.com/fengyu-look/fy-digital-life-site`
- 线上站点：`https://fengyu-look.github.io/`
- 后台页面：`https://fengyu-look.github.io/admin/`
- 发布仓库：`https://github.com/fengyu-look/fengyu-look.github.io`
- 发布脚本：`npm run deploy:pages`
- 最新源码提交：`b6c3871 Improve admin content controls`
- 最新 Pages 发布提交：`962217a Deploy FY Digital Life site`

### 2. Supabase

已接入 Supabase：

- Project URL：`https://wwobcjkakedxyruxulfj.supabase.co`
- Publishable key 已写在 `public/assets/custom/site-supabase.js`
- Storage bucket：`site-media`
- 管理员登录邮箱：`fengyuaimengyu@outlook.com`

不要把用户密码写进文件或提交。

已建表和迁移文件：

- `supabase/migrations/202607080001_initial_content.sql`
- `supabase/migrations/202607080002_flexible_content_admin.sql`

核心表：

- `admin_users`
- `recommendations`，早期版本，当前已基本被新模型替代
- `profile`
- `site_settings`
- `content_pages`
- `content_items`

### 3. 后台页面

后台入口：

- `public/admin/index.html`
- `public/assets/custom/admin.js`
- `public/assets/custom/admin.css`

后台已支持：

- 登录 / 退出
- 推荐卡片管理
- 关于资料管理
- 封面上传到 Supabase Storage
- 头像 / 真人照片上传
- 页面配置管理
- 每个推荐页独立字段
- 卡片新增、编辑、删除
- 卡片发布 / 隐藏
- 上移 / 下移排序
- 复制卡片
- 卡片缩略图预览
- 当前页统计：全部、已发布、已隐藏

### 4. 前台读取后台数据

公共读取模块：

- `public/assets/custom/content-api.js`

已接入后台读取的页面：

- `/studio/useful-websites`
- `/studio/prompt-collection`
- `/studio/skill-workflow`
- `/studio/photography`
- `/studio/agent-guide`

策略：

- 只读取 `content_items` 中 `is_published = true` 的数据。
- 如果后台没有已发布数据，页面继续显示当前静态内容。
- 这保证了后台空数据或 Supabase 临时不可用时，前台不崩、不空白。

已更新脚本缓存号：

- `useful-websites.js?v=20260708a`
- `prompt-collection.js?v=20260708a`
- `skill-workflow.js?v=20260708a`
- `studio-photography.js?v=20260708a`
- `agent-guide.js?v=20260708a`
- `admin.css?v=20260709a`
- `admin.js?v=20260709a`

## 当前半成品状态

后台功能已经能用，但还不是最终舒适版。

现在后台偏“轻量表单 + 卡片列表”，下一阶段可以继续优化：

1. 图片上传体验还比较基础。
   - 现在是上传后填入 URL。
   - 可以继续做上传进度、失败提示、文件大小提示、上传后缩略图即时预览。

2. 排序是简单的 `sort_order +/- 10`。
   - 已可用，但不是拖拽排序。
   - 后续可以做拖拽排序或“保存当前顺序”。

3. 每个推荐页的字段已经分开，但编辑体验还可以更专属。
   - 例如提示词页做“提示词大文本区域 + 一键复制预览”。
   - 摄影页做“图片网格管理”。
   - Agent 教程页做步骤编辑器，而不是 JSON。

4. 关于页已经接入 `profile` 表读取。
   - `/studio/digital-life` 会读取昵称、介绍、联系方式、真人照片。
   - `real_photo_url` 只用于关于页正文真人照片。
   - `avatar_url` 仍保留给导航悬浮卡片/后台资料使用，不会覆盖关于页真人照片。

5. 旧表 `recommendations` 还保留。
   - 当前新模型使用 `content_pages` + `content_items`。
   - 可以暂时保留，避免误删影响早期代码。
   - 等确认没有任何引用后再做数据库清理。

## 下一步建议

建议按以下顺序继续，不要跳太大：

### Step 1：关于页读取 `profile`（已完成）

目标：

- `/studio/digital-life` 自动读取 `profile` 表。
- 后台改真人照片、昵称、介绍、联系方式后，关于页自动同步。

注意：

- 导航悬浮卡片头像是赛博朋克动漫头像。
- 关于页正文照片是真人照片。
- 不要再搞反。

相关文件：

- `public/studio/digital-life/index.html`
- `public/assets/custom/digital-life.js`
- `public/assets/custom/content-api.js`
- 以及当前关于页相关图片：
  - `public/assets/custom/about-card-cyber-20260704.png`
  - `public/assets/custom/about-card-portrait.png`

### Step 2：后台图片上传体验优化（下一步建议）

建议做：

- 上传前显示文件名和大小。
- 上传完成后立即显示缩略图。
- 超过 Supabase 或浏览器限制时给中文提示。
- 封面 URL 输入框旁加“预览”。

### Step 3：前台动态数据可视化测试

建议建一张“隐藏测试卡片”和一张“已发布测试卡片”，分别验证：

- 后台能保存。
- 后台列表能显示。
- 已隐藏不会出现在前台。
- 已发布会出现在对应前台页。
- 删除后前台恢复。

测试完成后删除测试卡片，避免污染正式内容。

### Step 4：正式内容迁移

目前前台卡片大多是静态占位内容。

后续可以逐页把当前静态内容迁移到 Supabase：

1. 实用网站
2. 提示词宇宙
3. Skill 工具箱
4. 摄影页
5. Agent 安装教程

迁移时建议一页一页做，每页迁完后截图对照。

### Step 5：后台登录与权限增强

当前是 Supabase Auth + RLS + `admin_users`。

后续可增强：

- 更清晰的登录过期提示。
- 管理员身份错误时显示“当前 UID”方便复制。
- 后台隐藏在不公开导航中即可，不需要前台入口。

## 必跑测试

每次改代码后至少跑：

```bash
npm run validate:routes
MEDIA_BASE_URL="https://wwobcjkakedxyruxulfj.supabase.co/storage/v1/object/public/site-media" npm run build
```

发布：

```bash
npm run deploy:pages
```

本地预览：

```bash
npm run dev
```

线上重点检查：

- `https://fengyu-look.github.io/`
- `https://fengyu-look.github.io/admin/`
- `https://fengyu-look.github.io/studio/useful-websites/`
- `https://fengyu-look.github.io/studio/prompt-collection/`
- `https://fengyu-look.github.io/studio/skill-workflow/`
- `https://fengyu-look.github.io/studio/photography/`
- `https://fengyu-look.github.io/studio/agent-guide/`
- `https://fengyu-look.github.io/studio/digital-life/`

## 不要做的事

- 不要重新设计首页。
- 不要重做字体效果。
- 不要改导航、页尾、动画、视频、视觉资源，除非用户明确要求。
- 不要删除 Framer 运行依赖。
- 不要删除 `framer-*`、`data-framer-*`、`framerusercontent.com` 相关资源路径。
- 不要把用户密码、私密 key、邮箱验证码写进项目。
- 不要把关于页真人照片和导航赛博头像搞反。

## 当前项目状态

截至本文创建时：

- `main` 已推送到源码仓库。
- GitHub Pages 已发布。
- `npm run validate:routes` 通过。
- `npm run build` 通过。
- 后台新版 CSS/JS 线上已能访问。
