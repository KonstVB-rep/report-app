"use server";

import { TOAST } from "@/entities/user/ui/Toast";
import { getDepartmentsWithUsers } from ".";

export const getDepartmentsWithUsersQuery = async () => {
  try {
    return await getDepartmentsWithUsers();
  } catch (error) {
    TOAST.ERROR((error as Error).message);
    throw error;
  }
};
