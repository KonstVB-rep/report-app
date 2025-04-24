"use server";

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
    console.log(error, "Ошибка getRetailsUserQuery");
    return [];
  }
};

export const getProjectsUserQuery = async (userId: string) => {
  try {
    const projects = await getProjectsUser(userId);
    return projects || [];
  } catch (error) {
    console.log(error, "Ошибка getProjectsUserQuery");
    return [];
  }
};

export const getAllProjectsByDepartmentQuery = async (departmentId?: string | undefined) => {
  try {
    return await getAllProjectsByDepartment(departmentId);
  } catch (error) {
    console.log(error, "Ошибка getAllProjectsByDepartmentQuery");
    return [];
  }
};

export const getAllRetailsByDepartmentQuery = async (departmentId?: string | undefined) => {
  try {
    return await getAllRetailsByDepartment(departmentId);
  } catch (error) {
    console.log(error, "Ошибка getAllRetailsByDepartmentQuery");
    return [];
  }
};
