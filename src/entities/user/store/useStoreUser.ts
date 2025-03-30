import { User } from "../types";
import { persist } from "zustand/middleware";
import { checkUserPermission } from "@/feature/auth/lib/checkUserPermission";
import { UserFilter } from "@prisma/client";
import { create } from "@/shared/lib/helpers/сreate";

type State = {
  authUser: User | null;
  isAuth: boolean;
  setAuthUser: (user: User | null) => void;
  setIsAuth: (isAuth: boolean) => void;
  hasPermissionByRole: boolean;
  resetStore: () => void;
  userFilters: UserFilter[] | [];
  setUserFilters: (filters: UserFilter[]) => void;
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
      userFilters: [],
      setUserFilters: (filters: UserFilter[]) => set({ userFilters: filters }),
      resetStore: () => {
        set({
          authUser: null,
          isAuth: false,
          hasPermissionByRole: false,
          userFilters: [],
        });
      },
    }),
    {
      name: "user-storage",
    }
  )
);

export default useStoreUser;
