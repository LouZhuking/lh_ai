import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { emailRegex } from './regexp'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // 数据库凭证登录
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // 验证邮箱格式
        if (!emailRegex.test(credentials.email)) return null

        try {
          // 从数据库查找用户（使用原始查询以获取password字段）
          const user = await prisma.$queryRaw<Array<{
            id: string;
            email: string;
            name: string | null;
            image: string | null;
            password: string | null;
          }>>`
            SELECT id, email, name, image, password 
            FROM User 
            WHERE email = ${credentials.email}
          `

          // 如果未找到用户或密码为空，返回 null
          if (!user.length || !user[0].password) return null

          const foundUser = user[0]

          // 验证密码（此时已确保foundUser.password不为null）
          const isPasswordValid = await bcrypt.compare(credentials.password, foundUser.password!)
          if (!isPasswordValid) return null

          // 返回用户信息
          return {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            image: foundUser.image,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    }),
    // Google OAuth（如果配置了环境变量）
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    // GitHub OAuth（如果配置了环境变量）
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      })
    ] : [])
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  events: {
    async signOut() {
      // 清除所有相关cookie
      console.log('用户登出，清除会话')
    }
  },
  pages: {
    signIn: '/auth/signin',
    // signUp 字段被移除以修复类型错误
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
