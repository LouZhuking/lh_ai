import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { NewSpaceForm } from '@/components/new-space-form'

export default async function NewSpacePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">创建新空间</h1>
            <p className="text-muted-foreground mt-2">
              开始构建你的知识库，记录想法和灵感
            </p>
          </div>

          <NewSpaceForm />
        </div>
      </div>
    </div>
  )
}
