import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 只在开发环境下提供此端点
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_SET',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ? 'SET' : 'NOT_SET',
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
    timestamp: new Date().toISOString()
  })
}
