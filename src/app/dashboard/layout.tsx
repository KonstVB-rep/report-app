"use client";

import { Fragment, PropsWithChildren, ReactNode } from "react";
import React from "react";

import { SiteHeader } from "@/feature/Sidebar/ui/site-header";
import { SidebarProvider } from "@/shared/components/ui/sidebar";

const DashboardLayout = ({
  children,
  modal,
}: {
  children: ReactNode;
  modal?: ReactNode;
}) => {
  return (
    <>
      <div className="min-w-64 [--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          {children}

          {React.Children.map(modal, (child, i) =>
            React.isValidElement(child)
              ? React.cloneElement(child, { key: i })
              : child
          )}
        </SidebarProvider>
      </div>
    </>
  );
};

export default DashboardLayout;
