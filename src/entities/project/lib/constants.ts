import { Delivery } from "@prisma/client";

export enum Direction {
  PARKING = "Парковка",
  SKD = "СКД",
  GLK = "ГЛК",
  OTHER = "Иное",
  KATOK = "Каток",
  MUSEUM = "Музей",
  SPORT = "Спорткомплекс",
  FOK = "ФОК",
}

export enum Status {
  INVOICE_ISSUED = "Выставлен счет",
  DEAL_SUCCESSFUL = "Сделка успешна",
  ACTUAL = "Актуально",
  REJECT = "Отказ",
  PAID = "Оплачено",
  APPROVAL = "На согласовании",
}

export const DirectionLabels: Record<keyof typeof Direction, string> = {
  PARKING: "Парковка",
  SKD: "СКД",
  GLK: "ГЛК",
  OTHER: "Иное",
  KATOK: "Каток",
  MUSEUM: "Музей",
  SPORT: "Спорткомплекс",
  FOK: "ФОК",
} as const;

// Отображение для Status
export const StatusLabels: Record<keyof typeof Status, string> = {
  INVOICE_ISSUED: "Выставлен счет",
  DEAL_SUCCESSFUL: "Сделка успешна",
  ACTUAL: "Актуально",
  REJECT: "Отказ",
  PAID: "Оплачено",
  APPROVAL: "На согласовании",
};

export const DeliveryLabels: Record<keyof typeof Delivery, string> = {
  COMPLEX: "Комплекс",
  WHOLESALE: "Розница",
  SUPPLY: "Поставка оборудования",
  WORK: "Работы",
} as const;

