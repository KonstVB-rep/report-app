import type { PropsWithChildren } from "react"
import { connection } from "next/server"
import { checkRole } from "@/shared/api/checkByServer"
import NotFound from "../not-found"
import AdminClientLayout from "./ui/AdminClientLayout"

const AdminboardLayout = async ({ children }: PropsWithChildren) => {
  await connection()

  const isSuccess = await checkRole()

  if (!isSuccess) {
    return <NotFound />
  }

  return <AdminClientLayout>{children}</AdminClientLayout>
}

export default AdminboardLayout
