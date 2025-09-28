"use client";

import { PropsWithChildren } from "react";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { useGetDepartmentsWithUsers } from "@/entities/department/hooks";
import useStoreUser from "@/entities/user/store/useStoreUser";
import AppSidebar from "@/feature/Sidebar/ui/app-sidebar";
import { SidebarInset } from "@/shared/components/ui/sidebar";
import ExitAppScreen from "@/shared/custom-components/ui/ExitAppScreen";
import PageTransitionY from "@/shared/custom-components/ui/MotionComponents/PageTransitionY";

const RedirectToPath = dynamic(
  () => import("@/shared/custom-components/ui/Redirect/RedirectToPath"),
  {
    ssr: false,
    loading: () => <ExitAppScreen />,
  }
);

const TemplateDashboard = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const { authUser } = useStoreUser();
  useGetDepartmentsWithUsers();

  if (!authUser) {
    return (
      <>
        <ExitAppScreen />
        <RedirectToPath to="/login" />;
      </>
    );
  }

  return (
    <>
      <div className="flex min-h-[calc(100svh-var(--header-height)-2px)] max-h-[calc(100svh-var(--header-height)-2px)] flex-1">
        <AppSidebar />
        <SidebarInset className="h-auto min-h-min" key={pathname}>
          <div className="flex-1">{children}</div>
        </SidebarInset>
      </div>
    </>
  );
};

export default TemplateDashboard;
