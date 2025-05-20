"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

const TemplateDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login")
  }, [router]);
  

  return (
    <div className="relative grid h-full place-items-center p-4">
    </div>
  );
};

export default TemplateDashboard;
