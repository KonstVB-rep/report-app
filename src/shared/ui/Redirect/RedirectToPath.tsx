// src/shared/ui/Redirect.tsx
"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

// src/shared/ui/Redirect.tsx

// src/shared/ui/Redirect.tsx

const RedirectToPath = ({ to }: { to: string }) => {
  const router = useRouter();

  useEffect(() => {
    router.push(to);
  }, [to, router]);

  return null;
};

export default RedirectToPath;
