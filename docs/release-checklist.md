# FY Digital Life 发布前清单

更新时间：2026-07-11

## 当前状态

- 本地预览地址：`http://localhost:5173/`
- 后台地址：`http://localhost:5173/admin/`
- 构建输出目录：`dist/`
- 当前发布目标：GitHub Pages

## 本轮已确认

- `npm run validate:routes` 通过。
- `npm run build` 通过。
- 后台可管理推荐页卡片。
- 推荐页、摄影页、关于页可从 Supabase 读取内容。
- `/concept-lab` 已作为实验室页面保留，并做了中文提示、宽屏适配、不可点击卡片处理。
- 未发现密码、`service_role` 或 secret key 被写入公开文件。

## 提交前检查

1. 查看变更：
   ```bash
   git status --short
   git diff --stat
   ```

2. 跑校验：
   ```bash
   npm run validate:routes
   npm run build
   git diff --check
   ```

3. 抽查页面：
   - `/`
   - `/admin/`
   - `/studio/useful-websites`
   - `/studio/prompt-collection`
   - `/studio/skill-workflow`
   - `/studio/agent-guide`
   - `/studio/photography`
   - `/studio/digital-life`
   - `/concept-lab`

## 发布注意

- 不要把 Supabase `service_role`、数据库密码、邮箱密码写入仓库。
- 前端只允许使用 Supabase publishable/anon key。
- 后台登录使用 Supabase Auth 用户，不是邮箱登录密码。
- 如果 GitHub Pages 使用 `dist/` 发布，需要确认仓库工作流或 Pages 设置指向构建产物。

## 下一步

建议先提交当前稳定版本，再开始 GitHub Pages 发布配置。
