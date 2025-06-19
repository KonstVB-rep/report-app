"use server";

import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import prisma from "@/prisma/prisma-client";
import { handleError } from "@/shared/api/handleError";

import { OrderCreateData, OrderResponse } from "../types";
import { sendNotification } from "./telegram";
import { StatusOrder } from "@prisma/client";

/*****************************************************Получить************************************************************/

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
        departmentId: departmentIdValue,
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

export const getOrderById = async (
  orderId: string
): Promise<OrderResponse | null> => {
  try {
    await handleAuthorization();

    // const { user, userId } = data!;

    if (!orderId) {
      handleError("Недостаточно данных");
    }

    // const userOwnerProject = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: { role: true, departmentId: true },
    // });

    // if (!userOwnerProject) {
    //   return handleError("Пользователь не найден");
    // }

    // const isOwner = userId === idDealOwner;

    // if (!isOwner && user) {
    //   await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT]);
    // }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return null;
    }

    return order;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};


export const getOrdersByUserId = async (
  userId: string
): Promise<OrderResponse[]> => {
  try {
    await handleAuthorization();

    // const { user, userId } = data!;

    if (!userId) {
      handleError("Недостаточно данных");
    }

    // const userOwnerProject = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: { role: true, departmentId: true },
    // });

    // if (!userOwnerProject) {
    //   return handleError("Пользователь не найден");
    // }

    // const isOwner = userId === idDealOwner;

    // if (!isOwner && user) {
    //   await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT]);
    // }

    const orders = await prisma.order.findMany({
      where: { manager: userId, orderStatus: StatusOrder.SUBMITTED_TO_WORK },
    });

    return orders ?? [];
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

/*****************************************************Создать************************************************************/

export const createOrder = async (
  order: OrderCreateData
): Promise<{ order: OrderResponse, telegramError: string | undefined }> => {
  try {
    const data = await handleAuthorization();
    const { user } = data!;
    if (!order) {
      return handleError("Ошибка: данные не переданы в createOrder");
    }

    // Например, деструктурируем и приводим типы, если надо
    const { dateRequest, nameDeal, contact, comments, manager, ...rest } = order;

    // Проверяем обязательные поля
    if (!dateRequest || !nameDeal || !contact || !comments || !manager) {
      return handleError("Отсутствуют обязательные поля");
    }

    const newOrder = await prisma.order.create({
      data: {
        dateRequest,
        nameDeal,
        contact,
        comments,
        departmentId: user!.departmentId,
        manager,
        ...rest,
      },
    });

    const botName = "ErtelOrderQueueBot";
    const userId = manager; 
    const phoneText = newOrder.phone ? newOrder.phone : "отсутствует";
    const emailText = newOrder.email ? newOrder.email : "отсутствует";
    const commentsText = comments ? comments : "отсутствуют";

   const message = `<b>Новая заявка</b>: ${nameDeal}
<b>Контакты</b>: ${contact}
<b>Телефон</b>: ${phoneText}
<b>Email</b>: ${emailText}
<b>Комментарии</b>: ${commentsText}`;

    // Вызов отправки уведомления (можно await, если нужно дождаться)
    let telegramError: string | undefined = undefined;

    try {
      const sendData = await sendNotification(botName, userId, message);
      const sendJson = await sendData.json();
      if (!sendData.ok) {
        telegramError = sendJson.error || "Ошибка при отправке уведомления в Telegram";
      }
    } catch (notifyError) {
      console.error("Ошибка отправки уведомления:", notifyError);
      telegramError = (notifyError as Error).message;
    }

    return { order: newOrder, telegramError };
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};


/*****************************************************Удалить************************************************************/

export const delOrder = async (
  orderId: string
): Promise<OrderResponse | null> => {
  try {
    await handleAuthorization();

    // const { user, userId } = data!;

    if (!orderId) {
      handleError("Недостаточно данных");
    }

    // const userOwnerProject = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: { role: true, departmentId: true },
    // });

    // if (!userOwnerProject) {
    //   return handleError("Пользователь не найден");
    // }

    // const isOwner = userId === idDealOwner;

    // if (!isOwner && user) {
    //   await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT]);
    // }

    // Проверим, что заказ существует
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return handleError("Заявка не найдена");
    }

    // Удаляем заказ
    const deletedOrder = await prisma.order.delete({
      where: { id: orderId },
    });

    return deletedOrder;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

/***********************************************Обновить***************************************************/

export const updateOrder = async (
  orderId: string,
  data: OrderResponse // данные для обновления (кроме id)
): Promise<{ order: OrderResponse, telegramError: string | undefined }> => {
  try {
    await handleAuthorization();

    const { dateRequest, nameDeal, contact, comments, manager } = data;

    // Проверяем обязательные поля
    if (!dateRequest || !nameDeal || !contact || !comments || !manager) {
      return handleError("Отсутствуют обязательные поля");
    }


    // Проверим, что заказ существует
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return handleError("Заявка не найдена");
    }

    // Обновляем заказ
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data:{...data},
    });

    const botName = "ErtelOrderQueueBot";
    const userId = manager; 
    const phoneText = updatedOrder.phone ? updatedOrder.phone : "отсутствует";
    const emailText = updatedOrder.email ? updatedOrder.email : "отсутствует";
    const commentsText = comments ? comments : "отсутствуют";

    const message = `Скорректированная заявка: ${nameDeal}
                     Контакты: ${contact}
                     Телефон: ${phoneText}
                     Email: ${emailText}
                     Комментарии: ${commentsText}`;

    // Вызов отправки уведомления (можно await, если нужно дождаться)
    let telegramError: string | undefined = undefined;

    try {
      const sendData = await sendNotification(botName, userId, message);
      const sendJson = await sendData.json();

      if (!sendData.ok) {
        telegramError = sendJson.error || "Ошибка при отправке уведомления в Telegram";
      }
    } catch (notifyError) {
      console.error("Ошибка отправки уведомления:", notifyError);
      telegramError = (notifyError as Error).message;
    }

    return { order: updatedOrder, telegramError };
  } catch (error) {
    console.error("Ошибка обновления заказа:", error);
    return handleError((error as Error).message);
  }
};


export const updateOrderOnly = async (
  data: OrderResponse // данные для обновления (кроме id)
): Promise<OrderResponse | undefined > => {
  try {
    await handleAuthorization();

    const { dateRequest, nameDeal, contact, comments, manager, id } = data;

    // Проверяем обязательные поля
    if (!dateRequest || !nameDeal || !contact || !comments || !manager) {
      return handleError("Отсутствуют обязательные поля");
    }


    // Проверим, что заказ существует
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return handleError("Заявка не найдена");
    }

    // Обновляем заказ
    const updatedOrder = await prisma.order.update({
      where: { id },
      data:{...data},
    });

    
    return updatedOrder;
  } catch (error) {
    console.error("Ошибка обновления заказа:", error);
    return handleError((error as Error).message);
  }
};
