# FY Digital Life

一个为个人长期内容站准备的数字生活网站。

[![Deploy GitHub Pages](https://github.com/fengyu-look/fy-digital-life-site/actions/workflows/pages.yml/badge.svg)](https://github.com/fengyu-look/fy-digital-life-site/actions/workflows/pages.yml)

## 项目简介

FY Digital Life 是一个静态前端 + Supabase 后台的个人网站工程，主要用于展示：

- AI 工具与网站推荐
- Prompt 收藏与复制
- Skill / Agent 使用教程
- 摄影作品
- 个人数字生命介绍页
- 实验室页面 `/concept-lab`

网站前台保持视觉优先，后台用于维护推荐卡片、图片、链接、分类、排序和上下架状态，避免每次更新内容都手动改页面代码。

## 技术栈

- 静态前端：HTML / CSS / JavaScript
- 本地服务：Node.js 脚本
- 后台数据：Supabase Database / Auth / Storage
- 部署：GitHub Pages 工作流

## 本地运行

```bash
npm run dev
```

默认访问：

- 前台：`http://localhost:5173/`
- 后台：`http://localhost:5173/admin/`

## 构建

```bash
npm run validate:routes
npm run build
```

构建产物会输出到：

```text
dist/
```

## 内容管理

后台支持维护以下内容：

- 推荐页卡片新增、编辑、删除
- 卡片排序、发布/隐藏
- 图片上传与封面 URL 预览
- 关于页个人信息、头像、真人照片
- 从当前静态页面导入已有卡片到后台

推荐页读取 Supabase 内容；如果后台暂时没有内容，前台会保留当前静态页面作为兜底展示。

## 环境变量

复制 `.env.example` 后按自己的 Supabase 项目填写：

```bash
cp .env.example .env.local
```

注意：

- 前端只能使用 Supabase anon / publishable key。
- 不要把数据库密码、`service_role` key、邮箱密码写入仓库。
- `.env.local` 已经被 `.gitignore` 忽略。

## GitHub Pages

项目包含 GitHub Actions 工作流：

```text
.github/workflows/pages.yml
```

每次推送 `main` 后会自动：

1. 执行 `npm run build`
2. 上传 `dist/`
3. 部署到 GitHub Pages

如果仓库是私有仓库，免费计划可能无法启用 GitHub Pages。可以将仓库改为公开，或改用 Cloudflare Pages / Vercel / Netlify。

## 目录说明

```text
public/                 网站源码与静态资源
public/admin/           后台管理入口
public/assets/custom/   自定义脚本、样式、图标与页面增强
public/studio/          主要内容页面
scripts/                构建、路由校验、本地服务脚本
supabase/               Supabase 初始化相关资料
docs/                   项目说明、发布清单、交接文档
dist/                   构建产物，不提交到仓库
```

## 许可证

代码可参考和复用；网站文案、个人照片、摄影作品、Logo、视频和视觉素材不授权复用。

详见 [LICENSE](./LICENSE)。
