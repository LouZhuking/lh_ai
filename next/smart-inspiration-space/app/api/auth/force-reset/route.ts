import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()

    // 获取所有cookie名称
    const allCookies = cookieStore.getAll()

    // 清除所有可能相关的cookies
    const cookiesToClear = [
      'next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.session-token',
      '__Secure-next-auth.csrf-token',
      '__Host-next-auth.csrf-token',
      'access_token',
      'refresh_token',
      // 添加所有以next-auth开头的cookie
      ...allCookies.filter(cookie =>
        cookie.name.includes('next-auth') ||
        cookie.name.includes('session') ||
        cookie.name.includes('token')
      ).map(cookie => cookie.name)
    ]

    // 删除所有相关cookies
    const uniqueCookies = [...new Set(cookiesToClear)]
    uniqueCookies.forEach(cookieName => {
      // 设置多种路径和域的组合来确保完全清除
      cookieStore.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: false
      })
      cookieStore.set(cookieName, '', {
        expires: new Date(0),
        path: '/api/auth',
        httpOnly: false
      })
    })

    console.log('强制重置：清除了以下cookies:', uniqueCookies)

    return NextResponse.json({
      message: '所有会话数据已强制清除',
      clearedCookies: uniqueCookies,
      success: true
    })
  } catch (error) {
    console.error('强制重置失败:', error)
    return NextResponse.json(
      { error: '强制重置失败', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
