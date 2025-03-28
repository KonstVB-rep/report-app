import { create } from "zustand";
import { User } from "../types";
import { persist } from "zustand/middleware";
import { checkUserPermission } from "@/feature/auth/lib/checkUserPermission";
import { UserFilter } from "@prisma/client";

type State = {
  authUser: User | null;
  isAuth: boolean;
  setAuthUser: (user: User | null) => void;
  setIsAuth: (isAuth: boolean) => void;
  hasPermissionByRole: boolean;
  resetStore: () => void;
  userFilters:UserFilter[] | [];
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
        localStorage.removeItem("user-storage");
      },
    }),
    {
      name: "user-storage",
    }
  )
);

export default useStoreUser;
