import { DealFile } from "@prisma/client";

export type FileInfo = Omit<DealFile, "createdAt" | "updatedAt">;

export type FileResourceYndx = {
  path: string;
  type: "file";
  name: string;
  created: string;
  modified: string;
  size: number;
  mime_type: string;
  md5: string;
  sha256: string;
  preview: string;
  media_type: string;
  sizes: Array<{
    url: string;
    name: string;
  }>;
  resource_id: string;
  revision: number;
  comment_ids: {
    public_resource: string;
    private_resource: string;
  };
  exif: Record<string, unknown>;
  antivirus_status: "clean";
  file: string;
};
