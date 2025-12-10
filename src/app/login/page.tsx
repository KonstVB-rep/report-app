"use client"

import Image from "next/image"
import loginBg from "@/assets/login-bg"
import LoginForm from "@/feature/auth/ui/login-form"
import { useAuthRedirect } from "@/shared/hooks/useAuthRedirect"

const LoginPage = () => {
  useAuthRedirect()
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Image
        alt="login background"
        className="object-cover opacity-20 brightness-75 filter"
        fill
        placeholder="blur"
        priority
        quality={50}
        sizes="(max-width: 768px) 100vw, 50vw"
        src={loginBg}
      />
      <div className="relative z-10 w-full max-w-sm md:max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
