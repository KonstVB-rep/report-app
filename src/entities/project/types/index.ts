import { Delivery, Direction, Status } from "@prisma/client";


export type DirectionType = Direction;


export type DeliveryType = Delivery;


export type StatusType = Status;

export type ProjectResponse = {
  id: string;
  userId: string;
  dateRequest: Date;
  equipment_type: string;
  nameObject: string;
  direction: Direction; 
  deliveryType: Delivery; 
  contact: string;
  phone: string;
  email: string | null;
  amountCo: string;
  delta: string;
  project_status: Status;
  comments: string;
  lastDateConnection: Date;
  plannedDateConnection: Date;
};

export type Project = {
  id: string;
  userId: string;
  dateRequest: Date;
  equipment_type: string;
  nameObject: string;
  direction: Direction; 
  deliveryType: Delivery; 
  contact: string;
  phone: string;
  email: string | undefined;
  amountCo: number;
  delta: number;
  project_status: Status;
  comments: string;
  lastDateConnection: Date;
  plannedDateConnection: Date;
};

//  Для фронта, но не для Prisma
export const Directions = {
  PARKING: Direction.PARKING, 
  SKD: Direction.SKD,
  GLK: Direction.GLK,
  OTHER: Direction.OTHER,
  KATOK: Direction.KATOK,
  MUSEUM: Direction.MUSEUM,
  SPORT: Direction.SPORT,
  FOK: Direction.FOK,
} as const;

export const Statuses = {
  INVOICE_ISSUED: Status.INVOICE_ISSUED,
  DEAL_SUCCESSFUL: Status.DEAL_SUCCESSFUL,
  ACTUAL: Status.ACTUAL,
  REJECT: Status.REJECT,
  PAID: Status.PAID,
  APPROVAL: Status.APPROVAL,
} as const;

export const Deliveries = {
  COMPLEX: Delivery.COMPLEX, 
  WHOLESALE: Delivery.WHOLESALE,
  SUPPLY: Delivery.SUPPLY,
  WORK: Delivery.WORK,
} as const;