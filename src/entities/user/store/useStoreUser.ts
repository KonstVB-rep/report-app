import { persist } from "zustand/middleware";

import { checkUserPermission } from "@/shared/lib/helpers/checkUserPermission";
import { create } from "@/shared/lib/helpers/сreate";

import { User } from "../types";

type State = {
  authUser: Omit<User, "user_password"> | null;
  isAuth: boolean;
  setAuthUser: (user: Omit<User, "user_password"> | null) => void;
  setIsAuth: (isAuth: boolean) => void;
  resetStore: () => void;
};
const useStoreUser = create<State>()(
  persist(
    (set, get) => ({
      authUser: null,
      isAuth: false,

      setAuthUser: (user: Omit<User, "user_password"> | null) =>
        set({
          authUser: user,
          isAuth: !!user,
        }),

      setIsAuth: (isAuth: boolean) => {
        if (!isAuth) {
          set({
            isAuth: false,
            authUser: null,
          });
        } else {
          set({ isAuth });
        }
      },

      resetStore: () => {
        set({
          authUser: null,
          isAuth: false,
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
