import { persist } from "zustand/middleware";
import { DepartmentInfo } from "../types";
import { formattedArr } from "../lib/utils";
import { create } from "@/shared/lib/helpers/сreate";

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
      },
    }),
    {
      name: "deparments-storage",
    }
  )
);

export default useStoreDepartment;
