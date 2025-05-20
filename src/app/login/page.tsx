"use client";

import { useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import loginBg from "@/assets/login-bg";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { LoginForm } from "@/feature/auth/ui/login-form";
import { redirectPathCore } from "@/shared/lib/helpers/redirectPathCore";
import { resetAllStores } from "@/shared/lib/helpers/сreate";


export default function LoginPage() {
  const { isAuth, authUser } = useStoreUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      resetAllStores();
    }

    if (!authUser) return;

    const lastAppPath = localStorage.getItem("lastAppPath");

    const redirectUrl = lastAppPath || redirectPathCore(authUser.departmentId, authUser.id);

    router.replace(redirectUrl);


  }, [isAuth, authUser, router]);


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
