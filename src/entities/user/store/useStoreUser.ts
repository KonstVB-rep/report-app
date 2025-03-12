
import { create  } from 'zustand'
import { User } from '../types'
import { persist } from 'zustand/middleware';

type UsersDepartment = {
  [key: string] : string
}

type State = {
    authUser: User | null,
    isAuth: boolean
    setAuthUser: (user:User | null) => void,
    setIsAuth: (isAuth: boolean) => void,
    usersDepartment: UsersDepartment | null,
    setUsersDepartment: (userDepartment: UsersDepartment | null) => void
}

const useStoreUser = create<State>()(
    persist(
        (set) => ({
            authUser: null,
            isAuth: false,
            setAuthUser: (user: User | null) => set({ authUser: user }),
            setIsAuth: (isAuth: boolean) => set({ isAuth }),
            usersDepartment: null,
            setUsersDepartment: (usersDepartment: UsersDepartment | null) => set({ usersDepartment }),
          }),
      {
        name: 'user-storage',
      }
    )
  );


export default useStoreUser;