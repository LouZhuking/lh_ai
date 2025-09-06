import { JwtSignInForm } from '@/components/auth/jwt-signin-form'

export default function JwtSignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">JWT 登录</h1>
          <p className="text-muted-foreground mt-2">
            使用 JWT 双 Token 认证系统登录
          </p>
        </div>

        <JwtSignInForm />
      </div>
    </div>
  )
}
