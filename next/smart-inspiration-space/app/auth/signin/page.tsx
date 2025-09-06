import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SignInForm } from '@/components/auth/signin-form'

export default async function SignInPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">欢迎回来</h1>
          <p className="text-muted-foreground mt-2">
            登录到你的智能灵感空间
          </p>
        </div>

        <SignInForm />
      </div>
    </div>
  )
}
