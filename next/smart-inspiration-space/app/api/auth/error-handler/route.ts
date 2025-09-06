import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const error = searchParams.get('error')

  console.log('NextAuth错误:', error)

  // 重定向到登录页面并清除可能损坏的会话
  return NextResponse.redirect(new URL('/auth/signin?error=SessionError', request.url))
}

export async function POST(request: NextRequest) {
  return GET(request)
}
