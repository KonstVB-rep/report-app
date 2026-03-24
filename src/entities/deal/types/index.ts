import type {
  DealFile,
  DeliveryProject,
  DeliveryRetail,
  DirectionProject,
  DirectionRetail,
  StatusProject,
  StatusRetail,
} from "@prisma/client"
import type { SharedTableRowProps } from "@/shared/custom-components/ui/Table/model/types"

export const DEAL_TYPE = {
  PROJECT: "PROJECT",
  RETAIL: "RETAIL",
  ORDER: "ORDER",
} as const

export type DealType = (typeof DEAL_TYPE)[keyof typeof DEAL_TYPE]

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

export type ProjectResponseWithId = ProjectResponse & {
  id: string
}
export interface ProjectResponseOmitHighlights extends Omit<ProjectResponse, "highlights"> {}
export type ProjectResponseWithContactsAndFiles = ProjectResponse & {
  additionalContacts: Contact[] | []
  dealFiles: DealFile[] | []
}

export interface RetailResponse {
  [key: string]: unknown
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
export type UnionDealTypeParams =
  | "projects"
  | "retails"
  | "contracts"
  | "project"
  | "retail"
  | "contract"

export type DateRange = "week" | "month" | "threeMonths" | "halfYear" | "year"

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

export type DeletingDealsListItem = {
  id: string
  type: DealType
  title?: string
}

export type ReAssignDeal = {
  dealIds: { id: string; type: DealType }[]
  newManagerId: string
}

export type ProjectWithManagersIdsContacts = ProjectWithManagersIds & {
  additionalContacts: Contact[]
}
export type RetailWithManagersIdsContacts = RetailWithManagersIds & {
  additionalContacts: Contact[]
}

export type DealProject = ProjectResponseWithContactsAndFiles & {
  type: typeof DEAL_TYPE.PROJECT
}

export type DealRetail = RetailResponseWithContactsAndFiles & {
  type: typeof DEAL_TYPE.RETAIL
}

export type DealUnion = DealProject | DealRetail

export type DealTableRowProps<T extends DealUnion> = SharedTableRowProps<T>

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

export type ProjectOrRetailType = typeof DEAL_TYPE.PROJECT | typeof DEAL_TYPE.RETAIL

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
