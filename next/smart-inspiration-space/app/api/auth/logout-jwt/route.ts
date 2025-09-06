import {
  NextRequest,
  NextResponse
} from 'next/server'
import { prisma } from '@/lib/prisma'
import { clearAuthCookies } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value

    // 如果有refreshToken，从数据库中清除
    if (refreshToken) {
      await prisma.user.updateMany({
        where: {
          refreshToken
        },
        data: {
          refreshToken: null
        }
      })
    }

    // 清除cookies
    await clearAuthCookies()

    return NextResponse.json({
      message: '退出登录成功'
    }, {
      status: 200
    })

  } catch (err) {
    console.error('Logout error:', err)
    return NextResponse.json({
      error: '退出登录失败'
    }, {
      status: 500
    })
  } finally {
    await prisma.$disconnect()
  }
}
