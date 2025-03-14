import { DeliveryProject, DirectionProject, StatusProject,DeliveryRetail,EquipmentTypeEnum, DirectionRetail, StatusRetail } from "@prisma/client";

export type DirectionType = DirectionProject;


export type DeliveryType = DeliveryProject


export type StatusType = StatusProject;

export interface ProjectResponse {
  id: string;
  userId: string;
  nameDeal: string;
  nameObject: string;
  equipmentType: string;
  dateRequest: Date;
  direction: DirectionProject;
  deliveryType: DeliveryProject;
  contact: string;
  additionalСontact: string;
  phone: string;
  email?: string;
  amountCP: string;
  amountWork: string;
  amountPurchase: string;
  delta: string;
  projectStatus: StatusProject;
  comments: string;
  plannedDateConnection?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RetailResponse {
  id: string;
  userId: string;
  name_deal: string;
  dateRequest: Date;
  nameObject: string;
  direction: DirectionRetail;
  deliveryType: DeliveryRetail;
  contact: string;
  phone: string;
  email?: string;
  amountCP: string;
  delta: string;
  projectStatus: StatusRetail;
  comments: string;
  plannedDateConnection?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const DirectionProjects = {
  PARKING: DirectionProject.PARKING,
  GLK: DirectionProject.GLK,
  SKD: DirectionProject.SKD,
  KATOK: DirectionProject.KATOK,
  MUSEUM: DirectionProject.MUSEUM,
  SPORT: DirectionProject.SPORT,
  FOK_BASIN: DirectionProject.FOK_BASIN,
  BPS: DirectionProject.BPS,
  PPS: DirectionProject.PPS,
  PARK_ATTRACTION: DirectionProject.PARK_ATTRACTION,
  STADIUM_ARENA: DirectionProject.STADIUM_ARENA,
} as const;

export const DirectionRetails = {
  PARKING_EQUIPMENT: DirectionRetail.PARKING_EQUIPMENT,
  SCUD: DirectionRetail.SCUD,
  IDS_CONSUMABLES: DirectionRetail.IDS_CONSUMABLES,
  OTHER: DirectionRetail.OTHER,
} as const;

export const DeliveryProjects = {
  COMPLEX: DeliveryProject.COMPLEX,
  WHOLESALE: DeliveryProject.WHOLESALE,
  EQUIPMENT_SUPPLY: DeliveryProject.EQUIPMENT_SUUPLY,
  WORK_SERVICES: DeliveryProject.WORK_SERVICES,
  RENT: DeliveryProject.RENT,
  SOFTWARE_DELIVERY: DeliveryProject.SOFTWARE_DELIVERY,
  OTHER: DeliveryProject.OTHER,
} as const;

export const DeliveryRetails = {
  COMPLEX: DeliveryRetail.COMPLEX,
  WHOLESALE: DeliveryRetail.WHOLESALE,
  SUPPLY: DeliveryRetail.SUPPLY,
  WORK: DeliveryRetail.WORK,
} as const;

export const StatusProjects = {
  INVOICE_ISSUED: StatusProject.INVOICE_ISSUED,
  ACTUAL: StatusProject.ACTUAL,
  REJECT: StatusProject.REJECT,
  PAID: StatusProject.PAID,
  APPROVAL: StatusProject.APPROVAL,
  FIRST_CP_APPROVAL: StatusProject.FIRST_CP_APPROVAL,
  CONTRACT_ADVANCE_PAYMENT: StatusProject.CONTRACT_ADVANCE_PAYMENT,
  PROGRESS: StatusProject.PROGRESS,
  DELIVERY_WORKS: StatusProject.DELIVERY_WORKS,
  SIGN_ACTS_PAYMENT: StatusProject.SIGN_ACTS_PAYMENT,
  CLOSED: StatusProject.CLOSED,
} as const;

export const StatusRetails = {
  FIRST_CP_APPROVAL: StatusRetail.FIRST_CP_APPROVAL,
  APPROVAL: StatusRetail.APPROVAL,
  ACTUAL: StatusRetail.ACTUAL,
  REJECT: StatusRetail.REJECT,
  INVOICE_ISSUED: StatusRetail.INVOICE_ISSUED,
  PROGRESS: StatusRetail.PROGRESS,
  PAID: StatusRetail.PAID,
  CLOSED: StatusRetail.CLOSED,
} as const;

export const EquipmentTypeEnums = {
  BARRIER: EquipmentTypeEnum.BARRIER,
  GUARD: EquipmentTypeEnum.GUARD,
  SAFETY_ISLAND: EquipmentTypeEnum.SAFETY_ISLAND,
  ARROW: EquipmentTypeEnum.ARROW,
} as const;
