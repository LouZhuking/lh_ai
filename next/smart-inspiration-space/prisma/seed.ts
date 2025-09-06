import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始种子数据...')

  // 检查演示用户是否已存在
  const existingUser = await prisma.user.findUnique({
    where: { email: 'demo@example.com' }
  })

  if (!existingUser) {
    // 创建演示用户
    const hashedPassword = await bcrypt.hash('Demo123456', 12)

    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@example.com',
        password: hashedPassword,
        name: '演示用户',
        bio: '这是一个演示账户，用于展示系统功能',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      }
    })

    console.log('演示用户创建成功:', demoUser.email)

    // 创建演示空间
    const demoSpace = await prisma.space.create({
      data: {
        title: '我的第一个灵感空间',
        description: '欢迎来到智能灵感空间！这里是您记录想法、整理思路的地方。',
        isPublic: true,
        ownerId: demoUser.id,
        content: JSON.stringify({
          blocks: [
            {
              id: '1',
              type: 'heading',
              content: '欢迎使用智能灵感空间',
              order: 0
            },
            {
              id: '2',
              type: 'paragraph',
              content: '这是一个演示空间，展示了系统的基本功能。您可以：',
              order: 1
            },
            {
              id: '3',
              type: 'paragraph',
              content: '• 创建和编辑文档\n• 使用AI辅助功能\n• 分享您的想法\n• 与他人协作',
              order: 2
            }
          ]
        })
      }
    })

    console.log('演示空间创建成功:', demoSpace.title)

    // 创建一些标签
    const tags = await Promise.all([
      prisma.tag.create({
        data: { name: '创意', color: '#FF6B6B' }
      }),
      prisma.tag.create({
        data: { name: '工作', color: '#4ECDC4' }
      }),
      prisma.tag.create({
        data: { name: '学习', color: '#45B7D1' }
      }),
      prisma.tag.create({
        data: { name: '生活', color: '#96CEB4' }
      })
    ])

    console.log('标签创建成功:', tags.map(tag => tag.name).join(', '))
  } else {
    console.log('演示用户已存在，跳过创建')
  }

  console.log('种子数据完成!')
}

main()
  .catch((e) => {
    console.error('种子数据错误:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })