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
    return projects || []; // Возвращаем пустой массив, если projects === null
  } catch (error) {
    console.log(error, "Ошибка getProjectsUserQuery");
    return [];
  }
};

export const getAllProjectsByDepartmentQuery = async () => {
  try {
    return await getAllProjectsByDepartment();
  } catch (error) {
    console.log(error, "Ошибка getAllProjectsByDepartmentQuery");
    return [];
  }
};

export const getAllRetailsByDepartmentQuery = async () => {
  try {
    return await getAllRetailsByDepartment();
  } catch (error) {
    console.log(error, "Ошибка getAllRetailsByDepartmentQuery");
    return [];
  }
};
