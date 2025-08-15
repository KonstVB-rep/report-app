// src/shared/ui/Redirect.tsx
"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";



const RedirectToPath = ({ to }: { to: string }) => {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [to, router]);

  return null;
};

export default RedirectToPath;
