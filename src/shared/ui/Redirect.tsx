'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { redirectPathCore } from '../lib/helpers/redirectPathCore';
import { resetAllStores } from '../lib/helpers/сreate';
import useStoreUser from '@/entities/user/store/useStoreUser';
import Loading from '@/app/login/loading';

const Redirect = () => {
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

  return (
    <Loading/>
  )
}

export default Redirect