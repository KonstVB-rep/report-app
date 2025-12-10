import { checkRole } from "@/shared/api/checkByServer"
import NotFound from "../not-found"
import AdminPanel from "./ui/AdminPanel"

export const dynamic = "force-dynamic"

const AdminPage = async () => {
  const isSuccess = await checkRole()

  if (!isSuccess) {
    return <NotFound />
  }

  return <AdminPanel />
}

export default AdminPage
