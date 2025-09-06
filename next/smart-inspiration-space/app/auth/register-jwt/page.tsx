import { JwtSignUpForm } from '@/components/auth/jwt-signup-form'

export default function JwtSignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">JWT 注册</h1>
          <p className="text-muted-foreground mt-2">
            创建新账户，使用 JWT 双 Token 认证系统
          </p>
        </div>

        <JwtSignUpForm />
      </div>
    </div>
  )
}
