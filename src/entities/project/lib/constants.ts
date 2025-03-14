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
  WHOLESALE = "Розница",
  EQUIPMENT_SUPPLY = "Поставка оборудования",
  WORK_SERVICES = "Работы и услуги",
  RENT = "Аренда",
  SOFTWARE_DELIVERY = "Доставка ПО",
  OTHER = "Иное",
}

export enum DeliveryRetail {
  COMPLEX = "Комплекс",
  WHOLESALE = "Розница",
  SUPPLY = "Поставка оборудования",
  WORK = "Работы",
}

export enum StatusProject {
  INVOICE_ISSUED = "Выставлен счет",
  ACTUAL = "Актуально",
  REJECT = "Не актуально / Отказ",
  PAID = "Оплачено",
  APPROVAL = "Согласование договора",
  FIRST_CP_APPROVAL = "1-е КП на согласовании",
  CONTRACT_ADVANCE_PAYMENT = "Договор / Авансирование",
  PROGRESS = "Проект в работе / Закупка / Производство",
  DELIVERY_WORKS = "Поставка / Выполнение работ",
  SIGN_ACTS_PAYMENT = "Подписание актов / Оплата",
  CLOSED = "Закрыт",
}

export enum StatusRetail {
  FIRST_CP_APPROVAL = "1-е КП на согласовании",
  APPROVAL = "На согласовании",
  ACTUAL = "Актуально",
  REJECT = "Не актуально / Отказ",
  INVOICE_ISSUED = "Выставлен счёт / Авансирование",
  PROGRESS = "Проект в работе / Закупка / Производство",
  PAID = "Оплачено",
  CLOSED = "Закрыт",
}

export enum DepartmentEnum {
  SALES = "Отдел продаж",
  TECHNICAL = "Технический отдел",
}

export enum EquipmentTypeEnum {
  BARRIER = "Шлагбаум",
  GUARD = "Ограждения",
  SAFETY_ISLAND = "Островок безопасности",
  ARROW = "Стрела шлагбаума",
}

// Labels

export const DirectionProjectLabels: Record<keyof typeof DirectionProject, string> = {
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

export const DirectionRetailLabels: Record<keyof typeof DirectionRetail, string> = {
  PARKING_EQUIPMENT: "Парковочное оборудование",
  SCUD: "СКУД",
  IDS_CONSUMABLES: "Идентификаторы и расходники",
  OTHER: "Иное",
} as const;

export const DeliveryProjectLabels: Record<keyof typeof DeliveryProject, string> = {
  COMPLEX: "Комплекс",
  WHOLESALE: "Розница",
  EQUIPMENT_SUPPLY: "Поставка оборудования",
  WORK_SERVICES: "Работы и услуги",
  RENT: "Аренда",
  SOFTWARE_DELIVERY: "Доставка ПО",
  OTHER: "Иное",
} as const;

export const DeliveryRetailLabels: Record<keyof typeof DeliveryRetail, string> = {
  COMPLEX: "Комплекс",
  WHOLESALE: "Розница",
  SUPPLY: "Поставка оборудования",
  WORK: "Работы",
} as const;

export const StatusProjectLabels: Record<keyof typeof StatusProject, string> = {
  INVOICE_ISSUED: "Выставлен счет",
  ACTUAL: "Актуально",
  REJECT: "Не актуально / Отказ",
  PAID: "Оплачено",
  APPROVAL: "Согласование договора",
  FIRST_CP_APPROVAL: "1-е КП на согласовании",
  CONTRACT_ADVANCE_PAYMENT: "Договор / Авансирование",
  PROGRESS: "Проект в работе / Закупка / Производство",
  DELIVERY_WORKS: "Поставка / Выполнение работ",
  SIGN_ACTS_PAYMENT: "Подписание актов / Оплата",
  CLOSED: "Закрыт",
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

export const DepartmentLabels: Record<keyof typeof DepartmentEnum, string> = {
  SALES: "Отдел продаж",
  TECHNICAL: "Технический отдел",
} as const;

export const EquipmentTypeLabels: Record<keyof typeof EquipmentTypeEnum, string> = {
  BARRIER: "Шлагбаум",
  GUARD: "Ограждения",
  SAFETY_ISLAND: "Островок безопасности",
  ARROW: "Стрела шлагбаума",
} as const;
