'use server';

import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole";
import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import prisma from "@/prisma/prisma-client";
import { handleError } from "@/shared/api/handleError";
import { DealType, PermissionEnum } from "@prisma/client";
import { FileInfo } from "../types";

const checkingAccessRight = async (fileUserId: string) => {
  try {

    if (!fileUserId) {
      handleError("Недостаточно данных");
    }

    const { user } = await handleAuthorization();
    

    const userOwnerProject = await prisma.user.findUnique({
      where: { id: fileUserId },
      select: { role: true, departmentId: true },
    });

    if (!userOwnerProject) {
      return handleError("Пользователь не найден");
    }

    const isOwner = fileUserId === user?.id;
    if (!isOwner && user) {
      await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT]);
    }
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getFileFromDB = async (fileInfo: Omit<FileInfo, 'id'| 'storageType'>) => {
    try {
        return await prisma.dealFile.findFirst({
            where: {
              name: fileInfo.name,
              localPath: fileInfo.localPath,
              dealId: fileInfo.dealId,
              dealType: fileInfo.dealType,
              userId: fileInfo.userId,
            },
          });
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const writeHrefDownloadFileInDB = async (data: {
  name: string;
  localPath: string;
  dealId: string;
  dealType: DealType;
  userId: string;
  }) => {
  try {

    const { name: fileName,localPath, dealId, dealType, userId } = data;

    if (!fileName || !localPath || !dealId || !dealType || !userId) {
      throw new Error("Некоторые поля отсутствуют в formData");
    }

    await checkingAccessRight(userId as string);

    const fileInfo: Omit<FileInfo, 'id' | 'storageType'> = {
      name: fileName as string,
      localPath: localPath as string,
      dealId: dealId as string,
      dealType: dealType as DealType,
      userId: userId as string,
    };
    

    const isExistFile = await getFileFromDB(fileInfo);
    
    if (isExistFile) {
      return handleError("Файл с таким именем уже существует");
    }

    const file = await prisma.dealFile.create({
      data: {
        name: fileInfo.name,
        localPath: fileInfo.localPath,
        dealId: fileInfo.dealId,
        dealType: fileInfo.dealType,
        userId: fileInfo.userId,
      },
    });

    return file;
  } catch (error) {
    console.error(error);
    return handleError("Ошибка при записи файла в базу данных");
  }
};

// export const getHrefDownloadFileFromDB = async (fileInfo: FileInfo) => {
//   try {
//     await checkingAccessRight(fileInfo.userId);

//     const file = await getFileFromDB(fileInfo);

//     if (!file) {
//       return handleError("Файл не найден");
//     }

//     return file.href;
//   } catch (error) {
//     console.error(error);
//     return handleError("Ошибка при получении файла из базы данных");
//   }
// };


export const deleteFileFromDB = async (fileInfo:Pick<FileInfo, 'id' | 'dealType' | 'userId'>) => {

    try {
          await checkingAccessRight(fileInfo.userId);

          const isExistFile = await prisma.dealFile.findUnique({
            where: {
              id: fileInfo.id,
              dealType: fileInfo.dealType,
            },
          });
  
          if (!isExistFile) {
            return handleError("Файл не найден");
          }
      
          const deletedFile = await prisma.dealFile.delete({
            where: {
                id: isExistFile.id,
                dealType: isExistFile.dealType,
            },
          });
      
          return deletedFile
    } catch (error) {
        console.error(error);
        return handleError("Ошибка при удалении данных из базы");
    }
}


// export const updateFileInDB = async (fileInfo: FileInfo) => {
//     try {
//         await checkingAccessRight(fileInfo.userId);


//           const isExistFile = await getFileFromDB(fileInfo)

//           if (!isExistFile) {
//             return handleError("Файл не найден");
//           }
      
//           await prisma.dealFile.update({
//             where: {
//               id: isExistFile.id,
//               dealId: fileInfo.dealId,
//               dealType: fileInfo.dealType,
//               userId: fileInfo.userId,
//             },
//           });

//           return { message: "Файл успешно удален", success: true };
        
//     } catch (error) {
//         console.error(error);
//         return handleError("Ошибка при удалении данных из базы");
//     }
// }

export const getAllFilesDealFromDb = async( userId: string, dealId: string, dealType: DealType) => {
    try {
        await checkingAccessRight(userId);

        const files = await prisma.dealFile.findMany({
            where: {
                dealId,
                dealType,
                userId,
            },
        });

        return files;
    } catch (error) {
        console.error(error);
        return handleError((error as Error).message);
    }
}
