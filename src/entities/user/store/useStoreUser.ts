import type { PermissionEnum } from "@prisma/client"
import { persist } from "zustand/middleware"
import { create } from "@/shared/lib/helpers/сreate"
import type { UserWithoutPassword } from "@/shared/types"

type AuthUserType = UserWithoutPassword & { permissions?: PermissionEnum[] }

type State = {
  authUser: AuthUserType | null
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

export const userIdSelector = (state: State) => state.authUser?.id
