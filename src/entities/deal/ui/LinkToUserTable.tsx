"use client";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { Redo2 } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const linksPersonTable = {
  retails: {
    title: "Проекты",
    url: "/table/projects",
  },
  projects: {
    title: "Розничные сделки",
    url: "/table/retails",
  },
};

const linksSummaryTable = {
  retails: {
    title: "Проекты",
    url: "/summary-table/projects",
  },
  projects: {
    title: "Розничные сделки",
    url: "/summary-table/retails",
  },
};

const LinkToUserTable = () => {
  const { dealType, userId } = useParams();
  const { authUser } = useStoreUser();
  const pathname = usePathname();

  if (!authUser) {
    return null;
  }

  const hasTable =
    pathname.includes(`/table/${dealType}/${userId}`) ?
    linksPersonTable[dealType as keyof typeof linksPersonTable] : false;
  const hasSummaryTable =
    pathname.includes(`/summary-table/${dealType}/${authUser?.id}`) ?
    linksSummaryTable[dealType as keyof typeof linksSummaryTable] : false;


  if (!hasTable && !hasSummaryTable) return null;

  if (hasTable) {
    return (
      <Link
        className="btn_hover max-w-max text-sm border-muted px-4"
        href={`${
          linksPersonTable[dealType as keyof typeof linksPersonTable].url
        }/${userId}`}
        title={`Перейти на страницу - ${
          linksPersonTable[dealType as keyof typeof linksPersonTable].title
        }`}
      >
        {linksPersonTable[dealType as keyof typeof linksPersonTable].title}{" "}
        <Redo2 size={14} />
      </Link>
    );
  }

  if(hasSummaryTable) {
    return (
      <Link
        className="btn_hover max-w-max text-sm border-muted px-4"
        href={`${
          linksSummaryTable[dealType as keyof typeof linksSummaryTable].url
        }/${authUser.id}`}
        title={`Перейти на страницу - ${
          linksSummaryTable[dealType as keyof typeof linksSummaryTable].title
        }`}
      >
        {linksSummaryTable[dealType as keyof typeof linksSummaryTable].title}{" "}
        <Redo2 size={14} />
      </Link>
    );
  }
};

export default LinkToUserTable;
