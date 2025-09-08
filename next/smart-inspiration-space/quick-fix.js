const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function quickFix() {
  console.log('🔧 开始快速修复...')
  
  try {
    // 1. 检查数据库连接
    console.log('1️⃣ 检查数据库连接...')
    await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ 数据库连接正常')
    
    // 2. 检查User表结构
    console.log('2️⃣ 检查User表结构...')
    const userTableInfo = await prisma.$queryRaw`DESCRIBE User`
    const hasPassword = userTableInfo.some(field => field.Field === 'password')
    
    if (!hasPassword) {
      console.log('❌ User表缺少password字段，正在添加...')
      await prisma.$executeRaw`
        ALTER TABLE User 
        ADD COLUMN password VARCHAR(191) NULL,
        ADD COLUMN refreshToken TEXT NULL
      `
      console.log('✅ password字段添加成功')
    } else {
      console.log('✅ User表结构正常')
    }
    
    // 3. 检查是否有演示用户
    console.log('3️⃣ 检查演示用户...')
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@example.com' }
    })
    
    if (!demoUser) {
      console.log('❌ 演示用户不存在，正在创建...')
      const hashedPassword = await bcrypt.hash('Demo123456', 12)
      
      await prisma.user.create({
        data: {
          email: 'demo@example.com',
          password: hashedPassword,
          name: '演示用户',
          bio: '这是一个演示账户，用于展示系统功能'
        }
      })
      console.log('✅ 演示用户创建成功')
      console.log('📧 邮箱: demo@example.com')
      console.log('🔑 密码: Demo123456')
    } else {
      console.log('✅ 演示用户已存在')
    }
    
    // 4. 检查是否有测试空间
    console.log('4️⃣ 检查测试空间...')
    const spaceCount = await prisma.space.count()
    
    if (spaceCount === 0) {
      console.log('❌ 没有找到空间，正在创建测试空间...')
      const user = await prisma.user.findUnique({
        where: { email: 'demo@example.com' }
      })
      
      if (user) {
        await prisma.space.create({
          data: {
            title: '我的第一个灵感空间',
            description: '欢迎来到智能灵感空间！这里是您记录想法、整理思路的地方。',
            isPublic: true,
            ownerId: user.id,
            content: JSON.stringify({
              blocks: [
                {
                  id: '1',
                  type: 'heading',
                  content: '欢迎使用智能灵感空间',
                  order: 0
                }
              ]
            })
          }
        })
        console.log('✅ 测试空间创建成功')
      }
    } else {
      console.log(`✅ 找到 ${spaceCount} 个空间`)
    }
    
    // 5. 检查统计信息
    console.log('5️⃣ 系统统计信息:')
    const userCount = await prisma.user.count()
    const blockCount = await prisma.block.count()
    
    console.log(`👥 用户数量: ${userCount}`)
    console.log(`📄 空间数量: ${spaceCount}`)
    console.log(`🧱 块数量: ${blockCount}`)
    
    console.log('\n🎉 快速修复完成！')
    console.log('\n📋 接下来的步骤:')
    console.log('1. 访问 http://localhost:3000/error-diagnosis 查看系统状态')
    console.log('2. 访问 http://localhost:3000/test-auth 测试认证功能')
    console.log('3. 访问 http://localhost:3000/auth/signin 使用演示账户登录')
    
  } catch (error) {
    console.error('❌ 快速修复失败:', error)
    
    if (error.message.includes('Duplicate column name')) {
      console.log('ℹ️  字段已存在，跳过添加')
    } else if (error.message.includes('connect ECONNREFUSED')) {
      console.log('❌ 数据库连接失败，请检查:')
      console.log('   - MySQL服务是否启动')
      console.log('   - DATABASE_URL环境变量是否正确')
      console.log('   - 数据库用户名和密码是否正确')
    } else {
      console.log('❌ 其他错误，请查看详细信息:')
      console.log(error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 运行快速修复
quickFix().catch(console.error)
