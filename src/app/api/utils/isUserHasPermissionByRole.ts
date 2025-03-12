import prisma from "@/prisma/db/prisma-client";

/*получаем текущего/делающего запрос пользователя*/

export async function isUserHasPermissionByRole(
  userId: string,
  userRole: string,
  departmentId: number
): Promise<boolean> {
  // Получаем информацию о департаменте по ID
  const department = await prisma.department.findUnique({
    where: { id: departmentId },
    select: {
      directorId: true, // Получаем только directorId
    },
  });

  // Если департамент найден и пользователь является директором этого отдела
  if (
    (department && department.directorId === userId) ||
    userRole === "ADMIN"
  ) {
    return true;
  }

  return false;
}
