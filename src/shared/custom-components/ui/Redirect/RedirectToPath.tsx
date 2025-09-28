// src/shared/ui/Redirect.tsx
"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

// src/shared/ui/Redirect.tsx

// src/shared/ui/Redirect.tsx

// src/shared/ui/Redirect.tsx

const RedirectToPath = ({ to }: { to: string }) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    router.replace(to);
  }, [to, router]);

  return null;
};

export default RedirectToPath;
