"use client";

import Image from "next/image";

import loginBg from "@/assets/login-bg";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { LoginForm } from "@/feature/auth/ui/login-form";
import Redirect from "@/shared/ui/Redirect";

export default function LoginPage() {
  const { isAuth } = useStoreUser();

  if (isAuth) return <Redirect />;

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Image
        src={loginBg}
        alt="login background"
        placeholder="blur"
        priority
        fill
        className="object-cover opacity-20 brightness-75 filter"
      />
      <div className="relative z-10 w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
