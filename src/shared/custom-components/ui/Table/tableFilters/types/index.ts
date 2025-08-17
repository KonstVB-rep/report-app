import { UserFilter } from "@prisma/client";

export type SaveFilterType = {
  ownerId: string;
  data: SaveFilterDataType;
};

export type SaveFilterDataType = Omit<
  UserFilter,
  "createdAt" | "updatedAt" | "id" | "userId"
>;

export type UpdateFilterDataType = Omit<UserFilter, "createdAt" | "updatedAt">;

export type DeleteFilterReturnType = {
  data: null;
  message: string;
  error: boolean;
};
