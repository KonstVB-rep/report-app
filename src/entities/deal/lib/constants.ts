import { StatusContract } from "@prisma/client";

export enum DirectionProject {
  PARKING = "Парковка",
  GLK = "ГЛК",
  SKD = "СКД",
  KATOK = "Каток",
  MUSEUM = "Музей",
  SPORT = "Спорткомплекс",
  FOK_BASIN = "ФОК/Бассейн",
  BPS = "БПС",
  PPS = "ППС",
  PARK_ATTRACTION = "Парк/Аттракцион",
  STADIUM_ARENA = "Стадион/Арена",
}

export enum DirectionRetail {
  PARKING_EQUIPMENT = "Parking equipment",
  SCUD = "СКУД",
  IDS_CONSUMABLES = "Идентификаторы и расходники",
  OTHER = "Иное",
}

export enum DeliveryProject {
  COMPLEX = "Комплекс",
  EQUIPMENT_SUPPLY = "Поставка оборудования",
  WORK_SERVICES = "Работы и услуги",
  RENT = "Аренда",
  SOFTWARE_DELIVERY = "Доставка ПО",
  OTHER = "Иное",
}

export enum DeliveryRetail {
  SUPPLY = "Поставка оборудования",
  EXPENDABLE_MATERIALS = "Расходные материалы",
  WORK = "Работы",
}

export enum DealType {
  PROJECT = "Проект",
  RETAIL = "Розница",
  ORDER = "Заявки",
}

export enum StatusProject {
  INVOICE_ISSUED = "Выставлен счет",
  ACTUAL = "Актуально",
  REJECT = "Не актуально / Отказ",
  PAID = "Оплачено",
  APPROVAL = "Согласование договора",
  UNDER_APPROVAL = "На согласовании",
  FIRST_CP_APPROVAL = "1-е КП на согласовании",
  CONTRACT_ADVANCE_PAYMENT = "Договор / Авансирование",
  // PROGRESS = "Проект в работе / Закупка / Производство",
  // DELIVERY_WORKS = "Поставка / Выполнение работ",
  // SIGN_ACTS_PAYMENT = "Подписание актов / Оплата",
  // CLOSED = "Закрыт",
}

export enum StatusRetail {
  FIRST_CP_APPROVAL = "1-е КП на согласовании",
  APPROVAL = "На согласовании",
  ACTUAL = "Актуально",
  REJECT = "Не актуально / Отказ",
  INVOICE_ISSUED = "Выставлен счёт / Авансирование",
  PROGRESS = "В работе / Закупка / Производство",
  PAID = "Оплачено",
  CLOSED = "Закрыт",
}

export enum EquipmentTypeEnum {
  BARRIER = "Шлагбаум",
  GUARD = "Ограждения",
  SAFETY_ISLAND = "Островок безопасности",
  ARROW = "Стрела шлагбаума",
}

// Labels

export const DirectionProjectLabels: Record<
  keyof typeof DirectionProject,
  string
> = {
  PARKING: "Парковка",
  GLK: "ГЛК",
  SKD: "СКД",
  KATOK: "Каток",
  MUSEUM: "Музей",
  SPORT: "Спорткомплекс",
  FOK_BASIN: "ФОК/Бассейн",
  BPS: "БПС",
  PPS: "ППС",
  PARK_ATTRACTION: "Парк/Аттракцион",
  STADIUM_ARENA: "Стадион/Арена",
} as const;

export const DirectionRetailLabels: Record<
  keyof typeof DirectionRetail,
  string
> = {
  PARKING_EQUIPMENT: "Парковочное оборудование",
  SCUD: "СКУД",
  IDS_CONSUMABLES: "Идентификаторы и расходники",
  OTHER: "Иное",
} as const;

export const DeliveryProjectLabels: Record<
  keyof typeof DeliveryProject,
  string
> = {
  COMPLEX: "Комплекс",
  EQUIPMENT_SUPPLY: "Поставка оборудования",
  WORK_SERVICES: "Работы и услуги",
  RENT: "Аренда",
  SOFTWARE_DELIVERY: "Доставка ПО",
  OTHER: "Иное",
} as const;

export const DeliveryRetailLabels: Record<keyof typeof DeliveryRetail, string> =
  {
    EXPENDABLE_MATERIALS: "Расходные материалы",
    SUPPLY: "Поставка оборудования",
    WORK: "Работы",
  } as const;

type StatusProjectLabelsType = Record<keyof typeof StatusProject, string>;

export const StatusProjectLabels: StatusProjectLabelsType = {
  INVOICE_ISSUED: "Выставлен счет",
  ACTUAL: "Актуально",
  REJECT: "Не актуально / Отказ",
  PAID: "Оплачено",
  APPROVAL: "Согласование договора",
  UNDER_APPROVAL: "На согласовании",
  FIRST_CP_APPROVAL: "1-е КП на согласовании",
  CONTRACT_ADVANCE_PAYMENT: "Договор / Авансирование",
  // PROGRESS: "Проект в работе / Закупка / Производство",
  // DELIVERY_WORKS: "Поставка / Выполнение работ",
  // SIGN_ACTS_PAYMENT: "Подписание актов / Оплата",
  // CLOSED: "Закрыт",
} as const;

export const DealTypeLabels: Record<keyof typeof DealType, string> = {
  PROJECT: "Проект",
  RETAIL: "Розница",
  ORDER: "Заявки",
} as const;

export const StatusRetailLabels: Record<keyof typeof StatusRetail, string> = {
  FIRST_CP_APPROVAL: "1-е КП на согласовании",
  APPROVAL: "На согласовании",
  ACTUAL: "Актуально",
  REJECT: "Не актуально / Отказ",
  INVOICE_ISSUED: "Выставлен счёт / Авансирование",
  PROGRESS: "Проект в работе / Закупка / Производство",
  PAID: "Оплачено",
  CLOSED: "Закрыт",
} as const;

export const LABELS = {
  RETAIL: {
    DIRECTION: DirectionRetailLabels,
    DELIVERY: DeliveryRetailLabels,
    STATUS: StatusRetailLabels,
  },
  PROJECT: {
    DIRECTION: DirectionProjectLabels,
    DELIVERY: DeliveryProjectLabels,
    STATUS: StatusProjectLabels,
  },
} as const;

export type AllStatusKeys =
  | keyof typeof StatusProject
  | keyof typeof StatusRetail;

type ExcludedKeys = "PAID" | "CLOSED" | "REJECT";

export type StatusesInWorkType = {
  [K in Exclude<AllStatusKeys, ExcludedKeys>]?: string;
};
export const StatusesInWork: StatusesInWorkType = {
  INVOICE_ISSUED: "Выставлен счет",
  ACTUAL: "Актуально",
  APPROVAL: "Согласование договора",
  FIRST_CP_APPROVAL: "1-е КП на согласовании",
  CONTRACT_ADVANCE_PAYMENT: "Договор / Авансирование",
  // PROGRESS: "Проект в работе / Закупка / Производство",
  // DELIVERY_WORKS: "Поставка / Выполнение работ",
  // SIGN_ACTS_PAYMENT: "Подписание актов / Оплата",
};

export const StatusesContract = {
  CONTRACT_ADVANCE_PAYMENT: "Договор / Авансирование",
  PROGRESS: "Проект в работе / Закупка / Производство",
  DELIVERY_WORKS: "Поставка / Выполнение работ",
  SIGN_ACTS_PAYMENT: "Подписание актов / Оплата",
  CLOSED: "Закрыт",
};

export type StatusContractLabelsType = Record<
  keyof typeof StatusContract,
  string
>;

export const StatusContractLabels: StatusContractLabelsType = {
  CONTRACT_ADVANCE_PAYMENT: "Договор / Авансирование",
  PROGRESS: "Проект в работе / Закупка / Производство",
  DELIVERY_WORKS: "Поставка / Выполнение работ",
  SIGN_ACTS_PAYMENT: "Подписание актов / Оплата",
  CLOSED: "Закрыт",
} as const;
