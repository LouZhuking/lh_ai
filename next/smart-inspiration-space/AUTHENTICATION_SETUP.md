# 认证系统设置说明

## 功能概述

本项目已经完善了完整的用户认证系统，包括：

1. **NextAuth.js 认证**：支持邮箱密码登录和OAuth登录（Google、GitHub）
2. **数据库集成**：用户数据存储在MySQL数据库中
3. **密码加密**：使用bcrypt进行密码哈希
4. **JWT双Token认证**：额外的JWT认证系统
5. **表单验证**：前端和后端双重验证
6. **演示账户**：预设演示用户便于测试

## 环境配置

请在项目根目录创建 `.env.local` 文件，添加以下环境变量：

```bash
# 数据库配置（必需）
DATABASE_URL="mysql://username:password@localhost:3306/smart_inspiration_space"

# NextAuth 配置（必需）
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"

# JWT 配置（必需）
JWT_SECRET_KEY="your-super-secret-jwt-key-change-this-in-production"

# OAuth 配置（可选）
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# 环境
NODE_ENV="development"
```

## 数据库设置

1. 确保MySQL数据库正在运行
2. 创建数据库：
   ```sql
   CREATE DATABASE smart_inspiration_space;
   ```

3. 生成Prisma客户端：
   ```bash
   npm run db:generate
   ```

4. 推送数据库架构：
   ```bash
   npm run db:push
   ```

5. 创建种子数据（包含演示用户）：
   ```bash
   npm run db:seed
   ```

## 演示账户

系统会自动创建演示账户：
- **邮箱**：demo@example.com
- **密码**：Demo123456

## 认证流程

### 用户注册
1. 用户访问 `/auth/signup` 注册页面
2. 填写邮箱、密码、用户名
3. 前端验证：邮箱格式、密码强度、确认密码
4. 后端验证：输入格式、邮箱唯一性
5. 密码使用bcrypt加密存储
6. 注册成功后自动登录

### 用户登录
1. 用户访问 `/auth/signin` 登录页面
2. 支持三种登录方式：
   - 邮箱密码登录（数据库验证）
   - Google OAuth登录
   - GitHub OAuth登录
3. NextAuth.js处理会话管理
4. 登录成功跳转到首页

### JWT认证（额外系统）
- 访问 `/auth/register-jwt` 进行JWT注册
- 访问 `/auth/signin-jwt` 进行JWT登录
- 使用双Token机制（Access Token + Refresh Token）
- Token存储在HttpOnly Cookie中

## API路由

### NextAuth API
- `GET/POST /api/auth/[...nextauth]` - NextAuth处理器

### 自定义认证API
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/register-jwt` - JWT注册
- `POST /api/auth/login-jwt` - JWT登录
- `GET /api/auth/refresh-jwt` - JWT刷新

## 数据库模型

### User表结构
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  bio           String?
  password      String?   // 加密密码
  refreshToken  String?   // JWT refresh token
  
  // NextAuth关联
  accounts Account[]
  sessions Session[]
  
  // 业务数据
  spaces      Space[]
  posts       Post[]
  comments    Comment[]
  // ... 其他关联
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 安全特性

1. **密码加密**：使用bcrypt，salt rounds = 12
2. **输入验证**：前后端双重验证
3. **SQL注入防护**：使用Prisma ORM
4. **XSS防护**：HttpOnly Cookie
5. **CSRF防护**：NextAuth内置
6. **会话管理**：JWT策略

## 启动项目

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 文件

# 设置数据库
npm run db:generate
npm run db:push
npm run db:seed

# 启动开发服务器
npm run dev
```

## 测试认证

1. 访问 http://localhost:3000/auth/signin
2. 使用演示账户登录：
   - 邮箱：demo@example.com
   - 密码：Demo123456
3. 或者注册新账户测试完整流程

## 注意事项

- 在生产环境中务必更改所有密钥
- 确保数据库连接信息正确
- OAuth功能需要相应的客户端ID和密钥
- 建议使用HTTPS在生产环境中运行
