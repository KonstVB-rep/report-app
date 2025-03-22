import {
  DealType,
  DeliveryProject,
  DeliveryRetail,
  DirectionProject,
  DirectionRetail,
  StatusProject,
  StatusRetail,
} from "@prisma/client";
// import { DealTypeLabels, EquipmentTypeEnum } from "../lib/constants";

export type DirectionType = DirectionProject;

export type DeliveryType = DeliveryProject;

export type StatusType = StatusProject;

export interface ProjectResponse {
  [key: string]: unknown;
  id: string;
  userId: string;
  nameDeal: string;
  nameObject: string;
  dateRequest: Date;
  direction: DirectionProject;
  deliveryType: DeliveryProject | null;
  contact: string;
  additionalContact: string;
  phone: string;
  email: string | null;
  amountCP: string;
  amountWork: string;
  amountPurchase: string;
  delta: string;
  projectStatus: StatusProject;
  comments: string;
  plannedDateConnection: Date | null;
  createdAt: Date;
  updatedAt: Date;
  type: DealType;
}

export interface RetailResponse {
  [key: string]: unknown;
  id: string;
  userId: string;
  nameDeal: string;
  dateRequest: Date;
  nameObject: string;
  direction: DirectionRetail;
  deliveryType: DeliveryRetail | null;
  contact: string;
  phone: string;
  email?: string | null;
  additionalContact: string;
  amountCP: string;
  delta: string;
  projectStatus: StatusRetail;
  comments: string;
  plannedDateConnection?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  type: DealType;
}

export type DealUnionType = "retail" | "project";
export type DealsUnionType = "retails" | "projects";
