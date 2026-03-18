import type { $Enums } from "@prisma/client"
import { persist } from "zustand/middleware"
import { create } from "@/shared/lib/helpers/сreate"

export type AuthUserType = {
  permissions: $Enums.PermissionEnum[]
  id: string
  phone: string
  email: string
  position: string
  username: string
  departmentId: number
  role: $Enums.Role
  lastlogin: Date | null
  telegramInfo: {
    tgUserId: string
    tgUserName: string | null
  }[]
}

type State = {
  authUser: AuthUserType | null | undefined
  isAuth: boolean
  setAuthUser: (user: AuthUserType | null) => void
  setIsAuth: (isAuth: boolean) => void
  resetStore: () => void
}
const useStoreUser = create<State>()(
  persist(
    (set) => ({
      authUser: null,
      isAuth: false,

      setAuthUser: (user: AuthUserType | null) =>
        set({
          authUser: user,
          isAuth: !!user,
        }),

      setIsAuth: (isAuth: boolean) => {
        if (!isAuth) {
          set({
            isAuth: false,
            authUser: null,
          })
        } else {
          set({ isAuth })
        }
      },

      resetStore: () => {
        set({
          authUser: null,
          isAuth: false,
        })
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        authUser: state.authUser,
        isAuth: state.isAuth,
      }),
    },
  ),
)

export default useStoreUser

export const selectUserId = (state: State) => state.authUser?.id
export const selectSetAuthUser = (state: State) => state.setAuthUser
export const selectSetIsAuth = (state: State) => state.setIsAuth
export const selectIsAuth = (state: State) => state.isAuth
export const selectAuthUser = (state: State) => state.authUser
