import { DealFile } from "@prisma/client";

export type FileInfo = Omit<DealFile, "createdAt" | "updatedAt" > 
