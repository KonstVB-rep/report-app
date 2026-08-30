export type DealFile = {
  name: string
  id: string
  localPath: string
  storageType: "YANDEX_DISK"
  userId: string | null
  dealId: string
  dealType: DealType
  createdAt: Date
  updatedAt: Date
}

export type RetailWithoutDateCreateAndUpdate = Omit<RetailResponse, "createdAt" | "updatedAt">

export interface MutationResponse<T> {
  success: boolean
  data?: T
  error?: string
  code?: number
}

export const DEAL_TYPE = {
  PROJECT: "PROJECT",
  RETAIL: "RETAIL",
  ORDER: "ORDER",
} as const

export const StatusProject = {
  INVOICE_ISSUED: "INVOICE_ISSUED",
  ACTUAL: "ACTUAL",
  REJECT: "REJECT",
  PAID: "PAID",
  APPROVAL: "APPROVAL",
  UNDER_APPROVAL: "UNDER_APPROVAL",
  FIRST_CP_APPROVAL: "FIRST_CP_APPROVAL",
  CONTRACT_ADVANCE_PAYMENT: "CONTRACT_ADVANCE_PAYMENT",
  PROGRESS: "PROGRESS",
  DELIVERY_WORKS: "DELIVERY_WORKS",
  SIGN_ACTS_PAYMENT: "SIGN_ACTS_PAYMENT",
  CLOSED: "CLOSED",
  REQUEST: "REQUEST",
} as const

export type StatusProject = keyof typeof StatusProject

export const StatusRetail = {
  FIRST_CP_APPROVAL: "FIRST_CP_APPROVAL",
  APPROVAL: "APPROVAL",
  ACTUAL: "ACTUAL",
  REJECT: "REJECT",
  INVOICE_ISSUED: "INVOICE_ISSUED",
  PROGRESS: "PROGRESS",
  PAID: "PAID",
  CLOSED: "CLOSED",
  REQUEST: "REQUEST",
} as const

export type StatusRetail = keyof typeof StatusRetail

export const DeliveryProject = {
  COMPLEX: "COMPLEX",
  EQUIPMENT_SUPPLY: "EQUIPMENT_SUPPLY",
  WORK_SERVICES: "WORK_SERVICES",
  RENT: "RENT",
  SOFTWARE_DELIVERY: "SOFTWARE_DELIVERY",
  OTHER: "OTHER",
}

export type DeliveryProject = keyof typeof DeliveryProject

export const DirectionProject = {
  PARKING: "PARKING",
  GLK: "GLK",
  SKD: "SKD",
  KATOK: "KATOK",
  MUSEUM: "MUSEUM",
  SPORT: "SPORT",
  FOK_BASIN: "FOK_BASIN",
  BPS: "BPS",
  PPS: "PPS",
  PARK_ATTRACTION: "PARK_ATTRACTION",
  LOCKER: "LOCKER",
  STADIUM_ARENA: "STADIUM_ARENA",
} as const

export type DirectionProject = (typeof DirectionProject)[keyof typeof DirectionProject]

export const DeliveryRetail = {
  EXPENDABLE_MATERIALS: "EXPENDABLE_MATERIALS",
  SUPPLY: "SUPPLY",
  WORK: "WORK",
}

export type DeliveryRetail = keyof typeof DeliveryRetail

export const DirectionRetail = {
  PARKING_EQUIPMENT: "PARKING_EQUIPMENT",
  LOCKER: "LOCKER",
  SCUD: "SCUD",
  IDS_CONSUMABLES: "IDS_CONSUMABLES",
  OTHER: "OTHER",
}
export type DirectionRetail = keyof typeof DirectionRetail

export type DealType = (typeof DEAL_TYPE)[keyof typeof DEAL_TYPE]

export type ManagerShortInfo = {
  id: string
  username: string
  position: string
}

export interface ProjectResponse {
  id: string
  userId: string | null
  nameDeal: string
  nameObject: string
  inn?: string | null
  dateRequest: Date
  direction: DirectionProject
  deliveryType: DeliveryProject | null
  contact: string
  phone: string | null
  email: string | null
  amountCP: string
  amountWork: string
  amountPurchase: string
  delta: string
  dealStatus: StatusProject
  comments: string
  lastDateConnection: Date | null
  commentsLastConnection: string | null
  plannedDateConnection: Date | null
  resource: string | null
  createdAt: Date
  updatedAt: Date
  type: DealType
  managers?: ManagerShortInfo[]
  highlights?: string | null
}

type ProjectResponseWithContactsAndFiles = ProjectResponse & {
  additionalContacts: Contact[] | []
  dealFiles: DealFile[] | []
}

export interface RetailResponse {
  id: string
  userId: string | null
  nameDeal: string
  dateRequest: Date
  nameObject: string
  inn?: string | null
  direction: DirectionRetail
  deliveryType: DeliveryRetail | null
  contact: string
  phone: string | null
  email?: string | null
  amountCP: string
  delta: string
  dealStatus: StatusRetail
  comments: string
  lastDateConnection: Date | null
  commentsLastConnection: string | null
  plannedDateConnection?: Date | null
  resource: string | null
  createdAt: Date
  updatedAt: Date
  type: DealType
  managers?: ManagerShortInfo[]
  highlights?: string | null
}

export type ProjectReq = {
  id?: string
  dateRequest: Date
  nameDeal: string | null
  nameObject: string
  inn: string | null
  direction: DirectionProject
  deliveryType: DeliveryProject | null
  contact: string
  phone: string
  email: string
  amountCP: string
  amountWork: string
  amountPurchase: string
  delta: string
  dealStatus: StatusProject
  comments: string
  lastDateConnection: Date | null
  commentsLastConnection: string | null
  plannedDateConnection?: Date | null
  resource: string | null
  contacts: Contact[]
  managersIds: { userId: string }[]
  userId?: string
}

export type RetailReq = {
  id?: string
  dateRequest: Date
  nameDeal: string | null
  nameObject: string
  inn: string | null
  direction: DirectionRetail
  deliveryType: DeliveryRetail | null
  contact: string
  phone: string
  email: string
  amountCP: string
  delta: string
  dealStatus: StatusRetail
  comments: string
  lastDateConnection: Date | null
  commentsLastConnection: string | null
  plannedDateConnection?: Date | null
  resource: string | null
  contacts: Contact[]
  managersIds: { userId: string }[]
  userId?: string
}

type RetailResponseWithContactsAndFiles = RetailResponse & {
  additionalContacts: Contact[] | []
  dealFiles: DealFile[] | []
}

export type Contact = {
  id: string
  name: string
  phone?: string | null
  email?: string | null
  position?: string | null
}

export type DealsUnionType = "retails" | "projects"
export type TableType = "projects" | "retails" | "contracts"

export type DateRange = "week" | "month" | "threeMonths" | "halfYear" | "year"

export type ProjectWithoutDateCreateAndUpdate = Omit<ProjectResponse, "createdAt" | "updatedAt">

export type ContactFieldError = {
  _common?: {
    message?: string
  }
}

export type DeletingDealsListItem = {
  id: string
  type: DealType
  title?: string
}

export type ReAssignDeal = {
  dealIds: { id: string; type: DealType }[]
  newManagerId: string
}

export type DealProject = ProjectResponseWithContactsAndFiles & {
  type: typeof DEAL_TYPE.PROJECT
}

export type DealRetail = RetailResponseWithContactsAndFiles & {
  type: typeof DEAL_TYPE.RETAIL
}

export type DealUnion = DealProject | DealRetail

export interface BaseDeal {
  id: string
  type: DealType
  nameDeal: string
  dateRequest: Date
  dealStatus: string
}

export type DealsListWithResource =
  | {
      deals: {
        dateRequest: Date
        resource: string
      }[]
      totalDealsCount: number
    }
  | { deals: []; totalDealsCount: number }

export type DealsList =
  | {
      deals: DealUnion[]
      totalDealsCount: number
    }
  | { deals: []; totalDealsCount: number }

type ProjectOrRetailType = typeof DEAL_TYPE.PROJECT | typeof DEAL_TYPE.RETAIL

export type DealHighlightType = {
  id: string
  type: ProjectOrRetailType
  color: string | null
  userId: string
  all?: boolean
}

export type DealHighlightdeletedType = {
  type: ProjectOrRetailType
  color: string | null
  userId: string
  all?: boolean
}

export type SerializedManagers = ManagerShortInfo[]
