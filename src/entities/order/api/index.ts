'use server'

import prisma from "@/prisma/prisma-client";
import { OrderCreateData, OrderResponse } from "../types";
import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import { handleError } from "@/shared/api/handleError";
// import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole";
// import { PermissionEnum } from "@prisma/client";

export const getAllOrder = async (
  departmentId: string
): Promise<OrderResponse[]> => {
  try {
    const { user } = await handleAuthorization();

    // const permissionError = await checkUserPermissionByRole(user!, [
    //   PermissionEnum.VIEW_UNION_REPORT,
    // ]);

    // if (permissionError) return permissionError;
    const departmentIdValue =
      departmentId !== undefined ? +departmentId : +user!.departmentId;

    const orders = await prisma.order.findMany({
      where: {
        departmentId: departmentIdValue
      },
      orderBy: {
        dateRequest: "asc",
      },
    });

    return orders ?? [];
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};


export const createOrder = async (order: OrderCreateData): Promise<OrderResponse>=> {
  try {

    const data = await handleAuthorization();
    const { user } = data!;
    if (!order) {
      return handleError("Ошибка: данные не переданы в createOrder");
    }

    // Например, деструктурируем и приводим типы, если надо
    const { dateRequest, nameDeal, contact, comments, ...rest } = order;

    // Проверяем обязательные поля
    if (!dateRequest || !nameDeal || !contact || !comments) {
      return handleError("Отсутствуют обязательные поля");
    }

    // const safeNameDeal = String(nameDeal);

    const newOrder = await prisma.order.create({
      data: {
        dateRequest,
        nameDeal, 
        contact, 
        comments,
        departmentId: user!.departmentId,
        ...rest
      },
    });

    return newOrder;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};


// export const getOrderById = async (
//   dealId: string,
//   idDealOwner: string
// ): Promise<OrderResponse | null> => {
//   try {
//     const data = await handleAuthorization();

//     const { user, userId } = data!;

//     if (!dealId || !idDealOwner) {
//       handleError("Недостаточно данных");
//     }

//     const userOwnerProject = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { role: true, departmentId: true },
//     });

//     if (!userOwnerProject) {
//       return handleError("Пользователь не найден");
//     }

//     const isOwner = userId === idDealOwner;

//     if (!isOwner && user) {
//       await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT]);
//     }

//     const deal = await prisma.project.findUnique({
//       where: { id: dealId },
//     });

//     if (!deal) {
//       return null;
//     }

//     const dealFiles = await prisma.dealFile.findMany({
//       where: { dealId: dealId }, // Фильтруем по dealId
//     });

//     const formattedProject = {
//       ...deal,
//       amountCP: deal.amountCP ? deal.amountCP.toString() : "", // Преобразуем Decimal в строку
//       amountWork: deal.amountWork ? deal.amountWork.toString() : "",
//       amountPurchase: deal.amountPurchase ? deal.amountPurchase.toString() : "",
//       delta: deal.delta ? deal.delta.toString() : "",
//       dealFiles,
//     };

//     return formattedProject;
//   } catch (error) {
//     console.error(error);
//     return handleError((error as Error).message);
//   }
// };