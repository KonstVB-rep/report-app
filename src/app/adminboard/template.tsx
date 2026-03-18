"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { useGetDepartmentsWithUsers } from "@/entities/department/hooks";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { SidebarInset } from "@/shared/components/ui/sidebar";
import ButtonBack from "@/shared/custom-components/ui/Buttons/ButtonBack";
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

const TemplateDashboard = ({ children }: { children: React.ReactNode }) => {
  const { authUser } = useStoreUser();
  const pathName = usePathname();

  useGetDepartmentsWithUsers();

  if (!authUser) {
    return <RedirectToPath to="/login" />;
  }

  return (
    <>
      <SidebarInset className="h-auto">
        <PageTransitionY>
          <div className="max-h-[94vh] overflow-auto p-2">
            {pathName?.includes("adminboard") && pathName !== "/adminboard" && (
              <ButtonBack />
            )}
            {children}
          </div>
        </PageTransitionY>
      </SidebarInset>
    </>
  );
};

export default TemplateDashboard;
