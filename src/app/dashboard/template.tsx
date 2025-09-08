"use client";

import { PropsWithChildren } from "react";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { useGetDepartmentsWithUsers } from "@/entities/department/hooks";
import useStoreUser from "@/entities/user/store/useStoreUser";
import AppSidebar from "@/feature/Sidebar/ui/app-sidebar";
import { SiteHeader } from "@/feature/Sidebar/ui/site-header";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import PageTransitionY from "@/shared/custom-components/ui/MotionComponents/PageTransitionY";

const RedirectToPath = dynamic(
  () => import("@/shared/custom-components/ui/Redirect/RedirectToPath"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full min-h-screen grid place-items-center bg-transparent">
        <p className="text-2xl sm:text-4xl opacity-30">
          Идет завершение сессии...
        </p>
      </div>
    ),
  }
);

const TemplateDashboard = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const { authUser } = useStoreUser();
  useGetDepartmentsWithUsers();

  if (!authUser) {
    return <RedirectToPath to="/login" />;
  }

  return (
    <>
      <div className="min-w-64 [--header-height:calc(theme(spacing.14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex min-h-[calc(100svh-var(--header-height)-2px)] max-h-[calc(100svh-var(--header-height)-2px)] flex-1">
            <AppSidebar />
            <SidebarInset className="h-auto min-h-min" key={pathname}>
              <PageTransitionY>{children}</PageTransitionY>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
};

export default TemplateDashboard;
