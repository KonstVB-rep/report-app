import type { PropsWithChildren } from "react"
import { connection } from "next/server"
import AdminClientLayout from "./ui/AdminClientLayout"

const AdminboardLayout = async ({ children }: PropsWithChildren) => {
  await connection()

  return <AdminClientLayout>{children}</AdminClientLayout>
}

export default AdminboardLayout
