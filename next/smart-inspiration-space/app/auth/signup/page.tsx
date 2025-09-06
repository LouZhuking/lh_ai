import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SignUpForm } from '@/components/auth/signup-form'

export default async function SignUpPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">创建账户</h1>
          <p className="text-muted-foreground mt-2">
            加入智能灵感空间
          </p>
        </div>

        <SignUpForm />
      </div>
    </div>
  )
}
