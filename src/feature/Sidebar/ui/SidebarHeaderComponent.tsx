import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import logo from "@/public/logo.png"
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar"

const SidebarHeaderComponent = ({
  mainPagePath,
  mainPageTitle,
}: {
  mainPagePath: string
  mainPageTitle: string
}) => {
  const pathname = usePathname()
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          {pathname !== "/adminboard" ? (
            <SidebarMenuButton asChild size="lg" variant="outline">
              <div className="flex-1 text-left text-sm leading-tight">
                <Link
                  className="flex gap-2 w-full truncate text-lg font-semibold italic cursor-pointer"
                  href={mainPagePath}
                  prefetch={false}
                  title={mainPageTitle}
                >
                  <div className="flex aspect-square size-6 items-center justify-center rounded bg-blue-600 text-sidebar-primary-foreground">
                    <Image
                      alt="logo"
                      className="drop-shadow-[0_0px_8px_rgba(255,255,255,1)] dark:drop-shadow-[0_0px_8px_rgba(0,0,0,1)]"
                      height={16}
                      src={logo}
                      style={{ width: "16px", height: "16px" }}
                      width={16}
                    />
                  </div>
                  <span>Ertel</span>
                </Link>
              </div>
            </SidebarMenuButton>
          ) : (
            <div className="flex items-center rounded-md gap-2 w-full truncate text-lg font-semibold italic p-2 py-[9px] h-12 border bg-background">
              <div className="flex aspect-square size-6 items-center justify-center rounded bg-blue-600 text-sidebar-primary-foreground">
                <Image
                  alt="logo"
                  className="drop-shadow-[0_0px_8px_rgba(255,255,255,1)] dark:drop-shadow-[0_0px_8px_rgba(0,0,0,1)]"
                  height={16}
                  src={logo}
                  style={{ width: "16px", height: "16px" }}
                  width={16}
                />
              </div>
              <span>Ertel</span>
            </div>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}

export default SidebarHeaderComponent
