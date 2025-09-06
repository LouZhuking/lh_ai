import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'

type InitRequest = {
  fileHash: string
  fileName: string
  fileSize: number
  chunkSize: number
  totalChunks: number
}

type InitResponse = {
  complete: boolean
  uploaded: number[]
}

export async function POST(request: NextRequest) {
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

    const body: InitRequest = await request.json()
    const { fileHash, fileName, fileSize, chunkSize, totalChunks } = body

    // 验证必要参数
    if (!fileHash || !fileName || !fileSize || !chunkSize || !totalChunks) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // 创建上传目录
    const uploadDir = path.join(process.cwd(), 'data', 'uploads')
    const chunkDir = path.join(uploadDir, fileHash)
    const finalPath = path.join(uploadDir, fileName)

    // 确保目录存在
    await fs.mkdir(uploadDir, { recursive: true })

    // 检查文件是否已经完全上传
    if (existsSync(finalPath)) {
      // 文件已存在，返回完成状态（秒传）
      return NextResponse.json({
        complete: true,
        uploaded: []
      } as InitResponse)
    }

    // 检查分片目录
    if (!existsSync(chunkDir)) {
      await fs.mkdir(chunkDir, { recursive: true })
      return NextResponse.json({
        complete: false,
        uploaded: []
      } as InitResponse)
    }

    // 扫描已上传的分片
    const files = await fs.readdir(chunkDir)
    const uploaded = files
      .filter(file => file.startsWith('chunk-'))
      .map(file => parseInt(file.split('-')[1]))
      .filter(index => !isNaN(index))
      .sort((a, b) => a - b)

    // 检查是否所有分片都已上传
    const isComplete = uploaded.length === totalChunks &&
      uploaded.every((index, i) => index === i)

    return NextResponse.json({
      complete: isComplete,
      uploaded: uploaded
    } as InitResponse)

  } catch (error) {
    console.error('Upload init error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
