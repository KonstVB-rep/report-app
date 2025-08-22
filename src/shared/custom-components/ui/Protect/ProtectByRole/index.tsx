import { Role } from "@prisma/client";

import { useRouter } from "next/navigation";

import useStoreUser from "@/entities/user/store/useStoreUser";

const ProtectedByRole = ({
  children,
}: React.PropsWithChildren) => {
  const { authUser } = useStoreUser();

  const router = useRouter();

  const hasAccess = authUser?.role === Role.ADMIN;

  return hasAccess ? <>{children}</> : router.back();
};

export default ProtectedByRole;
