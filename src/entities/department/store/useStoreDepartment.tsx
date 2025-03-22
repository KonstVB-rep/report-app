import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DepartmentInfo } from "../types";
import { formattedArr } from "../lib/utils";

// export type DeptFormattedItem = {
//     name: string;
//     users: Record<string, string>[];
// }

export type DeptFormatted = {
  id: number;
  name: string;
  description: string;
  users: Record<string, string>[];
};

type State = {
  departments: DepartmentInfo[] | null;
  setDepartments: (departments: DepartmentInfo[] | null) => void;
  deptsFormatted: DeptFormatted[] | null;
  resetStore: () => void;
};

const useStoreDepartment = create<State>()(
  persist(
    (set) => ({
      departments: null,
      deptsFormatted: null,
      setDepartments: (departments: DepartmentInfo[] | null) =>
        set({
          departments,
          deptsFormatted: departments ? formattedArr(departments) : null,
        }),
      resetStore: () => {
        set({
          departments: null,
          deptsFormatted: null,
        });
        localStorage.removeItem("deparments-storage");
      },
    }),
    {
      name: "deparments-storage",
    }
  )
);

export default useStoreDepartment;
