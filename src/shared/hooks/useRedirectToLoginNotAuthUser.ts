'use client'
import useStoreUser from '@/entities/user/store/useStoreUser';
import { useRouter } from 'next/navigation';
import  { useEffect } from 'react'

const useRedirectToLoginNotAuthUser = () => {
    const router = useRouter();

    console.log('useRedirectToLoginNotAuthUser')

    const { isAuth } = useStoreUser();
  
    useEffect(() => {
      if (isAuth === false) {
        router.push("/login");
      }
    }, [isAuth, router]);
  
}

export default useRedirectToLoginNotAuthUser