"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import useStoreUser from "@/entities/user/store/useStoreUser";

const withAuthGuard = <P extends object>(Component: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const { isAuth } = useStoreUser();
    const router = useRouter();

    useEffect(() => {
      if (isAuth === false) {
        router.push("/login");
      }
    }, [isAuth, router]);

    if (isAuth === undefined) return <div>Загрузка...</div>;
    if (isAuth === false) return null;

    return <Component {...props} />;
  };

  Wrapper.displayName = `withAuthGuard(${Component.displayName || Component.name})`;

  return Wrapper;
};

export default withAuthGuard;
