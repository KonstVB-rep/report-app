import { persist } from "zustand/middleware";

import { checkUserPermission } from "@/shared/lib/helpers/checkUserPermission";
import { create } from "@/shared/lib/helpers/сreate";

import { User } from "../types";

type State = {
  authUser: User | null;
  isAuth: boolean;
  setAuthUser: (user: User | null) => void;
  setIsAuth: (isAuth: boolean) => void;
  hasPermissionByRole: boolean;
  resetStore: () => void;
};
const useStoreUser = create<State>()(
  persist(
    (set, get) => ({
      authUser: null,
      isAuth: false,
      hasPermissionByRole: false,

      setAuthUser: (user: User | null) =>
        set({
          authUser: user,
          hasPermissionByRole: checkUserPermission(user),
          isAuth: !!user,
        }),

      setIsAuth: (isAuth: boolean) => {
        if (!isAuth) {
          set({
            isAuth: false,
            authUser: null,
            hasPermissionByRole: false,
          });
        } else {
          set({ isAuth });
        }
      },

      resetStore: () => {
        set({
          authUser: null,
          isAuth: false,
          hasPermissionByRole: false,
        });
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        authUser: state.authUser,
        isAuth: state.isAuth,
      }),
    }
  )
);

export default useStoreUser;
