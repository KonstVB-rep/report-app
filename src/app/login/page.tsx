import Image from "next/image";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Image
        src="/login-page-bg.jpg"
        alt="logo"
        width={0}
        height={0}
        sizes="100vw"
        priority
        className="absolute inset-0 z-[0] h-full w-full object-cover opacity-20 brightness-75 filter"
      />
      <div className="relative z-10 w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
