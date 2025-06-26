import { DealType, StatusOrder } from "@prisma/client";

import { STATUS_ORDER } from "./lib/constants";

export type StatusKey = keyof typeof STATUS_ORDER;

export interface OrderResponse {
  [key: string]: unknown;
  id: string;
  nameDeal: string;
  dateRequest: Date;
  contact: string;
  phone?: string | null;
  email?: string | null;
  manager: string;
  comments: string | null;
  resource: string | null;
  departmentId: number;
  orderStatus: StatusOrder;
  createdAt: Date;
  updatedAt: Date;
  type: DealType;
}

export type OrderCreateData = {
  nameDeal: string;
  dateRequest: Date;
  contact: string;
  phone?: string | null;
  email?: string | null;
  manager: string;
  comments: string | null;
  resource: string | null;
};
