
import { create  } from 'zustand'
import { User } from '../types'
import { persist } from 'zustand/middleware';
import { checkUserPermission } from '@/feature/auth/lib/checkUserPermission';


type State = {
    authUser: User | null,
    isAuth: boolean
    setAuthUser: (user:User | null) => void,
    setIsAuth: (isAuth: boolean) => void,
    hasPermissionByRole: boolean,
    resetStore: () => void
}

const useStoreUser = create<State>()(
    persist(
        (set) => ({
            authUser: null,
            isAuth: false,
            hasPermissionByRole: false,
            setAuthUser: (user: User | null) => set({ authUser: user, hasPermissionByRole: checkUserPermission(user) }),
            setIsAuth: (isAuth: boolean) => set({ isAuth }),
            resetStore: () => {
              set({
                authUser: null,
                isAuth: false,
                hasPermissionByRole: false,
              });
              localStorage.removeItem("user-storage");
            },
          }),
      {
        name: 'user-storage',
      }
    )
  );


export default useStoreUser;