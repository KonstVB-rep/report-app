"use client"
import { type PropsWithChildren, ViewTransition } from "react"
import { useGetDepartmentsWithUsers } from "@/entities/department/hooks"
import { SiteHeader } from "@/feature/Sidebar/ui/site-header"
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar"
import AdminSidebar from "@/widgets/AminSidebar"
import LinksPageBlock from "./LinksPageBlock"

const AdminClientLayout = ({ children }: PropsWithChildren) => {
  useGetDepartmentsWithUsers()

  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "auto",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "auto",
      }}
    >
      <div className="min-w-64 [--header-height:calc(--spacing(14))] min-h-screen">
        <SidebarProvider className="flex flex-col">
          <SidebarProvider className="h-full bottom-0">
            <AdminSidebar>
              <LinksPageBlock />
            </AdminSidebar>
            <main className="w-full px-2">
              <SiteHeader />
              <SidebarInset className="min-h-[calc(100svh-var(--header-height)-2px)] max-h-[calc(100svh-var(--header-height)-2px)] flex flex-col">
                <div className="flex-1 flex flex-col">{children}</div>
              </SidebarInset>
            </main>
          </SidebarProvider>
        </SidebarProvider>
      </div>
    </ViewTransition>
  )
}

export default AdminClientLayout
