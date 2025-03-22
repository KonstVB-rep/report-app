"use server";

import { TOAST } from "@/entities/user/ui/Toast";
import {
  getAllProjectsByDepartment,
  getAllRetailsByDepartment,
  getProjectsUser,
  getRetailsUser,
} from ".";

export const getRetailsUserQuery = async (userId: string) => {
  try {
    return await getRetailsUser(userId as string);
  } catch (error) {
    TOAST.ERROR((error as Error).message);
    throw error;
  }
};

export const getProjectsUserQuery = async (userId: string) => {
  try {
    return await getProjectsUser(userId as string);
  } catch (error) {
    TOAST.ERROR((error as Error).message);
    throw error;
  }
};

export const getAllProjectsByDepartmentQuery = async () => {
  try {
    return await getAllProjectsByDepartment();
  } catch (error) {
    console.log(error);
    TOAST.ERROR((error as Error).message);
    throw error;
  }
};

export const getAllRetailsByDepartmentQuery = async () => {
  try {
    return await getAllRetailsByDepartment();
  } catch (error) {
    console.log(error);
    TOAST.ERROR((error as Error).message);
    throw error;
  }
};
