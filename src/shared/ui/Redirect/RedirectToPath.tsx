// src/shared/ui/Redirect.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const  RedirectToPath = ({ to }: { to: string }) => {
  const router = useRouter();

  useEffect(() => {
    router.push(to);
  }, [to, router]);

  return null;
}

export default RedirectToPath;