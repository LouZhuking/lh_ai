import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import path from 'path'
import fs from 'fs/promises'
import { existsSync, createWriteStream } from 'fs'

type MergeRequest = {
  fileHash: string
  fileName?: string
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

    const body: MergeRequest = await request.json()
    const { fileHash, fileName } = body

    if (!fileHash) {
      return NextResponse.json({ error: 'Missing file hash' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'data', 'uploads')
    const chunkDir = path.join(uploadDir, fileHash)
    const finalPath = path.join(uploadDir, fileName || `${fileHash}.file`)

    // 检查分片目录是否存在
    if (!existsSync(chunkDir)) {
      return NextResponse.json({ error: 'Chunks not found' }, { status: 404 })
    }

    // 检查文件是否已经存在
    if (existsSync(finalPath)) {
      // 清理分片目录
      await fs.rm(chunkDir, { recursive: true, force: true })
      return NextResponse.json({
        ok: true,
        message: 'File already exists',
        path: finalPath
      })
    }

    // 读取所有分片
    const files = await fs.readdir(chunkDir)
    const chunkFiles = files
      .filter(file => file.startsWith('chunk-'))
      .map(file => ({
        index: parseInt(file.split('-')[1]),
        path: path.join(chunkDir, file)
      }))
      .sort((a, b) => a.index - b.index)

    if (chunkFiles.length === 0) {
      return NextResponse.json({ error: 'No chunks found' }, { status: 404 })
    }

    // 合并分片
    const writeStream = createWriteStream(finalPath)

    for (const chunk of chunkFiles) {
      const chunkBuffer = await fs.readFile(chunk.path)
      writeStream.write(chunkBuffer)
    }

    writeStream.end()

    // 等待写入完成
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve)
      writeStream.on('error', reject)
    })

    // 验证文件完整性（可选）
    const stats = await fs.stat(finalPath)

    // 清理分片目录
    await fs.rm(chunkDir, { recursive: true, force: true })

    return NextResponse.json({
      ok: true,
      message: 'File merged successfully',
      path: finalPath,
      size: stats.size
    })

  } catch (error) {
    console.error('Merge error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
