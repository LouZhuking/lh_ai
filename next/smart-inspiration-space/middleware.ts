import {
  NextRequest,
  NextResponse
} from 'next/server'
import { verifyToken } from './lib/jwt'

// 需要JWT认证保护的路径
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/space/new',
  '/upload',
  '/ai-assistant'
]

// 不需要认证的公开路径
const publicPaths = [
  '/auth',
  '/api/auth',
  '/',
  '/discover'
]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // 检查是否是公开路径
  const isPublicPath = publicPaths.some(p => path.startsWith(p))
  if (isPublicPath) {
    return NextResponse.next()
  }

  // 检查是否是受保护路径
  const isProtectedPath = protectedPaths.some(p => path.startsWith(p))
  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // 获取tokens
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  // 如果没有任何token，重定向到登录页
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // 验证accessToken
  if (accessToken) {
    const accessPayload = await verifyToken(accessToken)
    if (accessPayload && accessPayload.userId) {
      // accessToken有效，添加用户ID到请求头
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', accessPayload.userId as string)

      return NextResponse.next({
        request: {
          headers: requestHeaders
        }
      })
    }
  }

  // accessToken无效或过期，尝试用refreshToken刷新
  if (refreshToken) {
    const refreshPayload = await verifyToken(refreshToken)
    if (refreshPayload && refreshPayload.userId) {
      // refreshToken有效，重定向到刷新接口
      const refreshUrl = new URL('/api/auth/refresh-jwt', request.url)
      refreshUrl.searchParams.set('redirect', request.url)
      return NextResponse.redirect(refreshUrl)
    }
  }

  // 两个token都无效，重定向到登录页
  return NextResponse.redirect(new URL('/auth/signin', request.url))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
