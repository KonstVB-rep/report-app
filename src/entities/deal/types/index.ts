import {
  DealType,
  DeliveryProject,
  DeliveryRetail,
  DirectionProject,
  DirectionRetail,
  StatusProject,
  StatusRetail,
} from "@prisma/client";

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
  phone: string | null;
  email: string | null;
  amountCP: string;
  amountWork: string;
  amountPurchase: string;
  delta: string;
  dealStatus: StatusProject;
  comments: string;
  plannedDateConnection: Date | null;
  resource: string | null;
  createdAt: Date;
  updatedAt: Date;
  type: DealType;
}

export type ProjectResponseWithAdditionalContacts = ProjectResponse & {
  additionalContacts: Contact[] | [];
};

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
  phone: string | null;
  email?: string | null;
  amountCP: string;
  delta: string;
  dealStatus: StatusRetail;
  comments: string;
  plannedDateConnection?: Date | null;
  resource: string | null;
  createdAt: Date;
  updatedAt: Date;
  type: DealType;
}

export type RetailResponseWithAdditionalContacts = RetailResponse & {
  additionalContacts: Contact[] | [];
};

export type Contact = {
  id: string;
  email: string | null;
  name: string;
  phone: string | null;
  position: string | null;
};

export type DealUnionType = "retail" | "project";
export type DealsUnionType = "retails" | "projects";
