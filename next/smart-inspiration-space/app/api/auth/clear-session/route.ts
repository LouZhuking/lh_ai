import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()

    // 清除NextAuth相关的cookies
    const cookiesToClear = [
      'next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.session-token',
      '__Secure-next-auth.csrf-token',
      '__Host-next-auth.csrf-token',
      'access_token',
      'refresh_token'
    ]

    cookiesToClear.forEach(cookieName => {
      cookieStore.delete(cookieName)
    })

    return NextResponse.json({
      message: '会话已清除',
      success: true
    })
  } catch (error) {
    console.error('清除会话失败:', error)
    return NextResponse.json(
      { error: '清除会话失败' },
      { status: 500 }
    )
  }
}
