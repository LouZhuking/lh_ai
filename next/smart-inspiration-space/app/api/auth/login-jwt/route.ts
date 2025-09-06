import {
  NextRequest,
  NextResponse
} from 'next/server'
import { prisma } from '@/lib/prisma'
import { emailRegex, passwordRegex } from '@/lib/regexp'
import bcrypt from 'bcryptjs'
import { createTokens, setAuthCookies } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      password
    } = await request.json()

    // 验证输入格式
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({
        error: 'Email 格式错误'
      }, {
        status: 400
      })
    }

    if (!password || !passwordRegex.test(password)) {
      return NextResponse.json({
        error: '密码格式错误：至少8位，包含字母和数字'
      }, {
        status: 400
      })
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user || !user.password) {
      return NextResponse.json({
        error: '用户不存在或密码错误'
      }, {
        status: 401
      })
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({
        error: '用户不存在或密码错误'
      }, {
        status: 401
      })
    }

    // 生成JWT tokens
    const { accessToken, refreshToken } = await createTokens(user.id)

    // 更新用户的refreshToken
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        refreshToken
      }
    })

    // 设置cookie
    await setAuthCookies(accessToken, refreshToken)

    return NextResponse.json({
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        },
        accessToken,
        refreshToken
      }
    }, {
      status: 200
    })

  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({
      error: '服务器内部错误'
    }, {
      status: 500
    })
  } finally {
    await prisma.$disconnect()
  }
}
