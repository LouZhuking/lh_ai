# 智能灵感空间 - 部署指南

这是一个基于 Next.js 15 和 React 19 构建的现代化知识管理平台，具有块编辑器、AI 增强功能和社交特性。

## 🚀 快速开始

### 1. 环境要求

- Node.js 18+ 
- npm/yarn/pnpm
- SQLite (开发环境) 或 PostgreSQL (生产环境)

### 2. 安装依赖

```bash
# 安装依赖
npm install

# 或使用 pnpm (推荐)
pnpm install
```

### 3. 环境配置

创建 `.env.local` 文件并配置以下环境变量：

```env
# Database
DATABASE_URL="file:./dev.db"

# Next-Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here-change-in-production"

# OAuth Providers (可选)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""

# AI Integration (可选)
OPENAI_API_KEY=""
DEEPSEEK_API_KEY=""
```

### 4. 数据库设置

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库架构
npm run db:push

# 填充种子数据
npm run db:seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## 📝 功能特性

### 🎯 核心功能

- **块编辑器系统**：支持段落、标题、待办、代码、引用、图片、列表、分割线等多种块类型
- **双向链接**：使用 `[[页面名称]]` 创建内部链接
- **标签系统**：为空间添加标签，方便分类和发现
- **响应式设计**：完美适配桌面端和移动端

### 🤖 AI 增强功能

- **内容摘要**：自动生成内容摘要
- **内容扩写**：根据指定风格扩展内容
- **标签生成**：AI 自动生成相关标签
- **写作改善**：改善语言表达和流畅度
- **多语言翻译**：支持多种语言互译
- **关联发现**：发现相关概念和主题

### 👥 社交功能

- **公开空间**：分享你的知识和想法
- **发现页面**：探索其他用户的精彩内容
- **点赞收藏**：为喜欢的内容点赞和收藏
- **关注系统**：关注感兴趣的用户

### 🔐 身份认证

- **多种登录方式**：支持邮箱密码、Google、GitHub 登录
- **演示账户**：demo@example.com / demo123
- **权限控制**：私有/公开空间权限管理

## 🛠️ 开发指南

### 项目结构

```
smart-inspiration-space/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # 认证页面
│   └── space/             # 空间页面
├── components/            # 可复用组件
│   ├── ui/                # Shadcn/ui 组件
│   ├── blocks/            # 块编辑器组件
│   └── layout/            # 布局组件
├── lib/                   # 工具函数和配置
├── prisma/                # 数据库相关
├── types/                 # TypeScript 类型定义
└── public/                # 静态资源
```

### 技术栈

- **框架**: Next.js 15 (App Router)
- **UI**: React 19 + Shadcn/ui + Tailwind CSS
- **数据库**: Prisma + SQLite/PostgreSQL
- **认证**: NextAuth.js
- **AI**: OpenAI/DeepSeek API
- **类型**: TypeScript
- **主题**: next-themes

### API 路由

#### 空间管理
- `GET /api/spaces` - 获取空间列表
- `POST /api/spaces` - 创建新空间
- `GET /api/spaces/[id]` - 获取特定空间
- `PATCH /api/spaces/[id]` - 更新空间
- `DELETE /api/spaces/[id]` - 删除空间

#### AI 功能
- `POST /api/ai` - AI 处理请求
- `GET /api/ai` - 获取 AI 服务状态

#### 认证
- `/api/auth/*` - NextAuth.js 路由

## 📦 部署

### Vercel 部署 (推荐)

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署

### 环境变量配置

生产环境需要配置的环境变量：

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"

# 如果使用 OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# 如果使用 AI 功能
DEEPSEEK_API_KEY="..."
```

### 数据库迁移

对于生产环境，建议使用 PostgreSQL：

```bash
# 修改 DATABASE_URL 为 PostgreSQL 连接字符串
npx prisma db push
npx prisma generate
```

## 🎨 自定义主题

应用支持明暗主题切换，主题配置在 `app/globals.css` 中。你可以：

1. 修改 CSS 变量来调整颜色
2. 在 `tailwind.config.ts` 中添加自定义样式
3. 使用 `next-themes` 添加更多主题选项

## 🔧 常见问题

### 1. 数据库连接失败

检查 `DATABASE_URL` 环境变量是否正确配置。

### 2. AI 功能不可用

确保配置了 `OPENAI_API_KEY` 或 `DEEPSEEK_API_KEY`。

### 3. OAuth 登录失败

检查 OAuth 应用配置和回调 URL 设置。

### 4. 图片上传问题

当前版本使用本地 URL，生产环境建议集成云存储服务。

## 📚 更多资源

- [Next.js 文档](https://nextjs.org/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [Shadcn/ui 组件](https://ui.shadcn.com)
- [NextAuth.js 文档](https://next-auth.js.org)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
