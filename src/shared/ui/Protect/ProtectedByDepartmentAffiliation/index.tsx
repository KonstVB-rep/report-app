import { Role } from "@prisma/client";

import { useParams } from "next/navigation";

import useStoreUser from "@/entities/user/store/useStoreUser";

const ProtectedByDepartmentAffiliation = ({
  children,
}: React.PropsWithChildren) => {
  const { authUser } = useStoreUser();
  const { departmentId } = useParams();

  const hasAccess =
    authUser?.departmentId === Number(departmentId) ||
    authUser?.role === Role.ADMIN;

  return hasAccess ? <>{children}</> : null;
};

export default ProtectedByDepartmentAffiliation;
