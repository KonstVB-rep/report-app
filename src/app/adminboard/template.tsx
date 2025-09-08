"use client";

import { PropsWithChildren } from "react";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { ArrowBigLeft } from "lucide-react";

import { useGetDepartmentsWithUsers } from "@/entities/department/hooks";
import useStoreUser from "@/entities/user/store/useStoreUser";
import LogoutDialog from "@/feature/auth/ui/logout-dialog";
import { SiteHeader } from "@/feature/Sidebar/ui/site-header";
import { Button } from "@/shared/components/ui/button";
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
  const { authUser } = useStoreUser();
  const router = useRouter();

  useGetDepartmentsWithUsers();

  if (!authUser) {
    return <RedirectToPath to="/login" />;
  }

  return (
    <>
      <div className="min-w-64 [--header-height:calc(theme(spacing.14))]">
        <SidebarProvider className="flex flex-col">
          <div className="flex bg-background">
            <SiteHeader isHasSitebar={false} />
            <div className="min-h-full border-b border-l px-2 items-center hidden md:flex">
              <LogoutDialog withTitle={false} />
            </div>
          </div>

          <SidebarInset className="h-auto">
            <PageTransitionY>
              <div className="max-h-[94vh] overflow-auto">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="mb-4 ml-4 mt-4"
                >
                  <ArrowBigLeft />
                  Назад
                </Button>
                {children}
              </div>
            </PageTransitionY>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
};

export default TemplateDashboard;
