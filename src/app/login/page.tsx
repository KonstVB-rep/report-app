import Image from "next/image";

import loginBg from "@/assets/login-bg";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
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
