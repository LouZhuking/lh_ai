import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'

export async function PUT(request: NextRequest) {
  try {
    // 验证用户身份
    const accessToken = request.cookies.get('access_token')?.value
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(accessToken)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // 获取分片信息
    const fileHash = request.headers.get('x-file-hash')
    const chunkIndex = request.headers.get('x-chunk-index')

    if (!fileHash || chunkIndex === null) {
      return NextResponse.json({ error: 'Missing chunk metadata' }, { status: 400 })
    }

    const index = parseInt(chunkIndex)
    if (isNaN(index)) {
      return NextResponse.json({ error: 'Invalid chunk index' }, { status: 400 })
    }

    // 创建分片目录
    const uploadDir = path.join(process.cwd(), 'data', 'uploads')
    const chunkDir = path.join(uploadDir, fileHash)
    const chunkPath = path.join(chunkDir, `chunk-${index}`)

    // 确保目录存在
    await fs.mkdir(chunkDir, { recursive: true })

    // 检查分片是否已经存在
    if (existsSync(chunkPath)) {
      return NextResponse.json({
        message: 'Chunk already exists',
        index
      })
    }

    // 获取分片数据
    const arrayBuffer = await request.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 保存分片
    await fs.writeFile(chunkPath, buffer)

    return NextResponse.json({
      message: 'Chunk uploaded successfully',
      index,
      size: buffer.length
    })

  } catch (error) {
    console.error('Chunk upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
