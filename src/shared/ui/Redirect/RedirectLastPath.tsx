"use client";

import { ReactNode, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import useStoreUser from "@/entities/user/store/useStoreUser";

import { redirectPathCore } from "../../lib/helpers/redirectPathCore";
import { resetAllStores } from "../../lib/helpers/сreate";

const RedirectLastPath = ({children}:{children:ReactNode}) => {
  const { isAuth, authUser } = useStoreUser();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {

    if (!isAuth) {
      resetAllStores();
      return;
    }

    if (isAuth && authUser && !hasRedirected) {
      const lastAppPath = localStorage.getItem("lastAppPath");
      const redirectUrl =
        lastAppPath || redirectPathCore(authUser.departmentId, authUser.id);
      setHasRedirected(true);
      router.replace(redirectUrl);
    }
  }, [isAuth, authUser, hasRedirected, router]);

  return <>{children}</>;
};

export default RedirectLastPath;
