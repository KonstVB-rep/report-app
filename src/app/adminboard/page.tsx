import { checkRole } from "@/shared/api/checkRole";

import NotFound from "../not-found";
import AdminPanel from "./ui/AdminPanel";

const AdminPage = async () => {
  const isSuccess = await checkRole();

  if (!isSuccess) {
    return <NotFound />;
  }

  return <AdminPanel />;
};

export default AdminPage;
