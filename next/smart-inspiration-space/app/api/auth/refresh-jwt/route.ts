import {
  NextRequest,
  NextResponse
} from "next/server"
import { prisma } from '@/lib/prisma'
import { createTokens, verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('JWT refresh request received')

    const refreshToken = request.cookies.get("refresh_token")?.value
    const redirectUrl = request.nextUrl.searchParams.get('redirect')
      || "/dashboard"

    if (!refreshToken) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    const refreshPayload = await verifyToken(refreshToken)
    if (!refreshPayload || !refreshPayload.userId) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    const userId = refreshPayload.userId as string

    // 从数据库验证refreshToken
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    // 生成新的tokens
    const {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    } = await createTokens(userId)

    // 更新数据库中的refreshToken
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        refreshToken: newRefreshToken
      }
    })

    // 设置新的cookies并重定向
    const response = NextResponse.redirect(new URL(redirectUrl, request.url))
    response.cookies.set('access_token', newAccessToken, {
      httpOnly: true,
      maxAge: 60 * 15, // 15分钟
      sameSite: 'strict',
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    })
    response.cookies.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7天
      sameSite: 'strict',
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    })

    return response

  } catch (err) {
    console.error('Token refresh error:', err)
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  } finally {
    await prisma.$disconnect()
  }
}
