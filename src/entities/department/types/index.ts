
import { UserResponse } from "@/entities/user/types";
import type { DepartmentEnum } from "@prisma/client";
import { ReactNode } from "react";

export type DepartmentTypeSidebar ={ 
    id: number,
    name: DepartmentEnum,
    directorId: string; 
    users: UserResponse[];
}

export type DepartmentUserItem ={
    id: string;
    departmentId: number;
    username: string;
    position: string;
    url: string;
}

export type DepartmentListType = {
  id: number;
  title: string;
  icon?: ReactNode;
  url: string;
  directorId: string;
  items: DepartmentUserItem[];
};

