# 环境配置说明

## 必需的环境变量

请在项目根目录创建 `.env.local` 文件，并添加以下环境变量：

```bash
# JWT Secret Key (请更改为您自己的密钥)
JWT_SECRET_KEY="your-super-secret-jwt-key-change-this-in-production"

# 数据库连接 (MySQL)
DATABASE_URL="mysql://username:password@localhost:3306/smart_inspiration_space"

# NextAuth配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"

# AI配置 (可选)
OPENAI_API_KEY="your-openai-api-key"
DEEPSEEK_API_KEY="your-deepseek-api-key"

# 开发环境
NODE_ENV="development"
```

## 数据库设置

1. 确保您已安装并运行了 MySQL 数据库
2. 创建一个名为 `smart_inspiration_space` 的数据库
3. 更新 `DATABASE_URL` 中的用户名、密码和数据库信息

## 初始化步骤

1. 安装依赖：
   ```bash
   npm install
   ```

2. 生成 Prisma 客户端：
   ```bash
   npx prisma generate
   ```

3. 运行数据库迁移：
   ```bash
   npx prisma db push
   ```

4. 生成种子数据（包含演示用户）：
   ```bash
   npx prisma db seed
   ```

5. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 演示账户信息

系统会自动创建以下演示账户：

- **邮箱**: demo@example.com
- **密码**: Demo123456

您可以使用此账户登录系统并测试所有功能。

## 注意事项

- 请确保在生产环境中更改所有的密钥和密码
- JWT_SECRET_KEY 应该是一个强随机字符串
- 数据库连接字符串应该使用实际的数据库凭据
- 如果不使用 AI 功能，可以省略 AI 相关的环境变量
