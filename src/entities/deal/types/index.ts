import type {
  DealFile,
  DealType,
  DeliveryProject,
  DeliveryRetail,
  DirectionProject,
  DirectionRetail,
  StatusProject,
  StatusRetail,
} from "@prisma/client"

export type DirectionType = DirectionProject

export type DeliveryType = DeliveryProject

export type StatusType = StatusProject

export type ManagerShortInfo = {
  id: string
  managerName: string
  position: string
}

export interface ProjectResponse {
  [key: string]: unknown
  id: string
  userId: string
  nameDeal: string
  nameObject: string
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
  plannedDateConnection: Date | null
  resource: string | null
  createdAt: Date
  updatedAt: Date
  type: DealType
  managers?: ManagerShortInfo[]
}

export type ProjectResponseWithContactsAndFiles = ProjectResponse & {
  additionalContacts: Contact[] | []
  dealFiles: DealFile[] | []
}

export interface RetailResponse {
  [key: string]: unknown
  id: string
  userId: string
  nameDeal: string
  dateRequest: Date
  nameObject: string
  direction: DirectionRetail
  deliveryType: DeliveryRetail | null
  contact: string
  phone: string | null
  email?: string | null
  amountCP: string
  delta: string
  dealStatus: StatusRetail
  comments: string
  plannedDateConnection?: Date | null
  resource: string | null
  createdAt: Date
  updatedAt: Date
  type: DealType
  managers?: ManagerShortInfo[]
}

export type RetailResponseWithContactsAndFiles = RetailResponse & {
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

export type DealUnionType = "retail" | "project"
export type DealsUnionType = "retails" | "projects"
export type TableType = "projects" | "retails" | "contracts"

export type DateRange = "week" | "month" | "threeMonths" | "halfYear" | "year"

export interface ContractResponse {
  [key: string]: unknown
  id: string
  userId: string
  nameDeal: string
  nameObject: string
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
  createdAt: Date
  updatedAt: Date
  type: DealType
}

export type ProjectWithoutDateCreateAndUpdate = Omit<ProjectResponse, "createdAt" | "updatedAt">

export type ProjectWithManagersIds = Omit<
  ProjectResponse,
  "createdAt" | "updatedAt" | "managers"
> & { managersIds: { userId: string }[] }

export type RetailWithoutDateCreateAndUpdate = Omit<RetailResponse, "createdAt" | "updatedAt">

export type RetailWithManagersIds = Omit<RetailResponse, "createdAt" | "updatedAt" | "managers"> & {
  managersIds: { userId: string }[]
}

export type ProjectWithoutId = Omit<ProjectWithoutDateCreateAndUpdate, "id">

export type RetailWithoutId = Omit<RetailWithoutDateCreateAndUpdate, "id">

export type ContactFieldError = {
  _common?: {
    message?: string
  }
}

export type DealBase = {
  id: string
  dateRequest: Date
  nameDeal: string
  nameObject: string
  comments: string
  userId: string
  type?: Omit<DealType, "ORDER">
  dealStatus: StatusProject | StatusRetail
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
