import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { emailRegex, passwordRegex } from '@/lib/regexp'
import bcrypt from 'bcryptjs'

// 生成CUID格式的ID
function generateId() {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 15)
  return `c${timestamp}${randomStr}`.substring(0, 25)
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // 验证输入格式
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email 格式错误' },
        { status: 400 }
      )
    }

    if (!password || !passwordRegex.test(password)) {
      return NextResponse.json(
        { error: '密码格式错误：至少8位，包含字母和数字' },
        { status: 400 }
      )
    }

    if (!name || name.length < 2 || name.length > 20) {
      return NextResponse.json(
        { error: '用户名长度应在2-20字符之间' },
        { status: 400 }
      )
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 409 }
      )
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12)

    // 创建用户 - 使用原始SQL查询避免Prisma类型问题
    const user = await prisma.$executeRaw`
      INSERT INTO User (id, email, password, name, createdAt, updatedAt)
      VALUES (${generateId()}, ${email}, ${hashedPassword}, ${name}, NOW(), NOW())
    `

    // 获取创建的用户信息
    const createdUser = await prisma.$queryRaw<Array<{
      id: string;
      email: string;
      name: string | null;
      image: string | null;
    }>>`
      SELECT id, email, name, image FROM User WHERE email = ${email}
    `

    if (!createdUser.length) {
      throw new Error('用户创建失败')
    }

    const userData = createdUser[0]

    return NextResponse.json({
      message: '注册成功',
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        image: userData.image
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
