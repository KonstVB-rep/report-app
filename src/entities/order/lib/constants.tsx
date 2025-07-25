import { DealType, StatusOrder } from "@prisma/client";

export const STATUS_ORDER = {
  SUBMITTED_TO_WORK: "Передано в работу",
  AT_WORK: "В работе",
} as const;

export const defaultOrderValues = {
  dateRequest: undefined,
  nameDeal: "",
  contact: "",
  email: "",
  manager: "",
  comments: "",
  phone: "",
  resource: "",
  orderStatus: StatusOrder.SUBMITTED_TO_WORK,
};

export const OrderType = {
  [DealType.PROJECT]: "Проект",
  [DealType.RETAIL]: "Розница",
  [DealType.ORDER]: "Не определен",
};
