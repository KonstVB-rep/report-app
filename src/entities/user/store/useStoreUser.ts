
import { create  } from 'zustand'
import { User } from '../types'
import { persist } from 'zustand/middleware';
import { checkUserPermission } from '@/feature/auth/lib/checkUserPermission';

type UsersDepartment = {
  [key: string] : string
}

type State = {
    authUser: User | null,
    isAuth: boolean
    setAuthUser: (user:User | null) => void,
    setIsAuth: (isAuth: boolean) => void,
    hasPermission: boolean,
    usersDepartment: UsersDepartment | null,
    setUsersDepartment: (userDepartment: UsersDepartment | null) => void,
    resetStore: () => void
}

const useStoreUser = create<State>()(
    persist(
        (set) => ({
            authUser: null,
            isAuth: false,
            hasPermission: false,
            setAuthUser: (user: User | null) => set({ authUser: user, hasPermission: checkUserPermission(user) }),
            setIsAuth: (isAuth: boolean) => set({ isAuth }),
            usersDepartment: null,
            setUsersDepartment: (usersDepartment: UsersDepartment | null) => set({ usersDepartment }),
            resetStore: () => {
              set({
                authUser: null,
                isAuth: false,
                hasPermission: false,
                usersDepartment: null,
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