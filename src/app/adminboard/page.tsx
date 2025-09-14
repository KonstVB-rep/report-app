import { checkRole } from "@/shared/api/checkRole";

import NotFound from "../not-found";
import AdminPanel from "./ui/AdminPanel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const AdminPage = async () => {
  const isSuccess = await checkRole();

  if (!isSuccess) {
    return <NotFound />;
  }

  return <AdminPanel />;
};

export default AdminPage;
