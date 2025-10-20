"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { useGetDepartmentsWithUsers } from "@/entities/department/hooks"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { SidebarInset } from "@/shared/components/ui/sidebar"
import ButtonBack from "@/shared/custom-components/ui/Buttons/ButtonBack"
import ButtonLink from "@/shared/custom-components/ui/Buttons/ButtonLink"
import ExitAppScreen from "@/shared/custom-components/ui/ExitAppScreen"
import PageTransitionY from "@/shared/custom-components/ui/MotionComponents/PageTransitionY"
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
    <SidebarInset className="h-full">
      <PageTransitionY className="flex-1 flex flex-col">
        <div className="max-h-[94vh] overflow-auto pt-2 px-2 flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            {pathName?.includes("adminboard") && pathName !== "/adminboard" && (
              <div className="flex gap-4">
                <ButtonBack />
                <ButtonLink className="h-9" label="Админпанель" pathName="/adminboard" />
              </div>
            )}
            <LinksPageBlock />
          </div>
          {children}
        </div>
      </PageTransitionY>
    </SidebarInset>
  )
}

export default TemplateDashboard
