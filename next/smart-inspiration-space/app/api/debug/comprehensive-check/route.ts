import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  // 只在开发环境下提供此端点
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    console.log('=== 综合系统检查 ===')

    const results: any = {
      timestamp: new Date().toISOString(),
      checks: {}
    }

    // 1. 检查环境变量
    results.checks.environment = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'SET' : 'NOT_SET',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
      JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ? 'SET' : 'NOT_SET'
    }

    // 2. 检查数据库连接
    try {
      await prisma.$queryRaw`SELECT 1 as test`
      results.checks.database = {
        connection: 'SUCCESS',
        message: '数据库连接正常'
      }
    } catch (dbError) {
      results.checks.database = {
        connection: 'FAILED',
        error: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }
    }

    // 3. 检查用户认证
    try {
      const session = await getServerSession(authOptions)
      results.checks.authentication = {
        hasSession: !!session,
        hasUser: !!session?.user,
        hasUserId: !!session?.user?.id,
        userEmail: session?.user?.email || null,
        userId: session?.user?.id || null
      }
    } catch (authError) {
      results.checks.authentication = {
        error: authError instanceof Error ? authError.message : 'Authentication check failed'
      }
    }

    // 4. 检查数据库表结构
    try {
      const userTable = await prisma.$queryRaw`DESCRIBE User`
      const spaceTable = await prisma.$queryRaw`DESCRIBE Space`
      const blockTable = await prisma.$queryRaw`DESCRIBE Block`

      results.checks.database_schema = {
        userTable: {
          exists: true,
          hasPasswordField: Array.isArray(userTable) && userTable.some((field: any) => field.Field === 'password'),
          fields: Array.isArray(userTable) ? userTable.map((f: any) => f.Field) : []
        },
        spaceTable: {
          exists: true,
          fields: Array.isArray(spaceTable) ? spaceTable.map((f: any) => f.Field) : []
        },
        blockTable: {
          exists: true,
          fields: Array.isArray(blockTable) ? blockTable.map((f: any) => f.Field) : []
        }
      }
    } catch (schemaError) {
      results.checks.database_schema = {
        error: schemaError instanceof Error ? schemaError.message : 'Schema check failed'
      }
    }

    // 5. 检查是否有测试数据
    try {
      const userCount = await prisma.user.count()
      const spaceCount = await prisma.space.count()
      const blockCount = await prisma.block.count()

      results.checks.data_status = {
        userCount,
        spaceCount,
        blockCount,
        hasTestData: userCount > 0 && spaceCount > 0
      }
    } catch (dataError) {
      results.checks.data_status = {
        error: dataError instanceof Error ? dataError.message : 'Data check failed'
      }
    }

    // 6. 检查API路由
    const apiChecks = [
      '/api/auth/[...nextauth]',
      '/api/auth/register',
      '/api/spaces',
      '/api/spaces/[id]'
    ]

    results.checks.api_routes = {
      available: apiChecks,
      note: '这些路由应该存在于项目中'
    }

    return NextResponse.json(results)

  } catch (error) {
    console.error('Comprehensive check error:', error)
    return NextResponse.json({
      error: 'Comprehensive check failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
