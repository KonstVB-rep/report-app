"use client";

import Link from "next/link";

import { ChevronRight } from "lucide-react";

import UserTable from "@/feature/user/ui/admindashboard/UserTable";

const AdminPanel = () => {
  return (
    <div className="gap-5 w-full">
      <div className="flex flex-col flex-wrap gap-3 justify-start w-full">
        <UserTable />
      </div>
    </div>
  );
};

export default AdminPanel;
