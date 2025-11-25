"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { useGetDepartmentsWithUsers } from "@/entities/department/hooks"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { SidebarInset } from "@/shared/components/ui/sidebar"
import ExitAppScreen from "@/shared/custom-components/ui/ExitAppScreen"
import PageTransitionY from "@/shared/custom-components/ui/MotionComponents/PageTransitionY"
import AdminSidebar from "@/widgets/AminSidebar"
import LinksPageBlock from "./ui/LinksPageBlock"

const RedirectToPath = dynamic(
  () => import("@/shared/custom-components/ui/Redirect/RedirectToPath"),
  {
    ssr: false,
    loading: () => <ExitAppScreen />,
  },
)

const TemplateDashboard = ({ children }: { children: React.ReactNode }) => {
  const { authUser } = useStoreUser()
  const pathName = usePathname()

  useGetDepartmentsWithUsers()

  if (!authUser) {
    return <RedirectToPath to="/login" />
  }

  return (
    <div className="flex min-h-[calc(100svh-var(--header-height)-2px)] max-h-[calc(100svh-var(--header-height)-2px)] flex-1">
      <AdminSidebar>
        <LinksPageBlock />
      </AdminSidebar>
      <SidebarInset className="h-auto min-h-min" key={pathName}>
        <PageTransitionY className="flex-1 flex flex-col">
          <div className="max-h-[94vh] overflow-auto pt-2 px-2 flex-1 flex flex-col">
            {children}
          </div>
        </PageTransitionY>
      </SidebarInset>
    </div>
  )
}

export default TemplateDashboard
