'use client'

import { Redo2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";


const links = {
    retails: {
      title: "Проекты",
      url: "/dashboard/table/projects",
    },
    projects: {
      title: "Розничные сделки",
      url: "/dashboard/table/retails",
    },
  };

const LinkToUserTable = () => {
  const { dealType, userId } = useParams();
  return (
    <Link
      className="btn_hover max-w-max text-sm border-muted px-4"
      href={`${links[dealType as keyof typeof links].url}/${userId}`}
      title={`Перейти на страницу - ${
        links[dealType as keyof typeof links].title
      }`}
    >
      {links[dealType as keyof typeof links].title} <Redo2 size={14} />
    </Link>
  );
};

export default LinkToUserTable;
