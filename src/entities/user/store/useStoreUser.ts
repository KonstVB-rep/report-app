import { persist } from "zustand/middleware";

import { checkUserPermission } from "@/feature/auth/lib/checkUserPermission";
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
    (set) => ({
      authUser: null,
      isAuth: false,
      hasPermissionByRole: false,
      setAuthUser: (user: User | null) =>
        set({ authUser: user, hasPermissionByRole: checkUserPermission(user) }),
      setIsAuth: (isAuth: boolean) => set({ isAuth }),
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
    }
  )
);

export default useStoreUser;
