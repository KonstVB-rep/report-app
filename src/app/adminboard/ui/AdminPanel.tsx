"use client";

import Link from "next/link";

import { ChevronRight } from "lucide-react";

import UserTable from "@/feature/user/ui/admindashboard/UserTable";

const AdminPanel = () => {
  return (
    <div className="gap-5 w-full">
      <div className="flex flex-col flex-wrap gap-3 justify-start w-full">
        <div className="flex flex-wrap gap-3 self-end">
          <Link
            href={"/adminboard/bots"}
            className="flex items-center justify-between py-2 px-3 border w-fit rounded-md border-blue-600 bg-muted self-end"
          >
            Боты <ChevronRight />
          </Link>
          <Link
            href={"/adminboard/events"}
            className="flex items-center justify-between py-2 px-3 border w-fit rounded-md border-blue-600 bg-muted self-end"
          >
            Календарь <ChevronRight />
          </Link>
        </div>
        <UserTable />
      </div>
    </div>
  );
};

export default AdminPanel;
