import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronRight } from "lucide-react";

import useStoreUser from "@/entities/user/store/useStoreUser";

const LinkPage = ({ path, title }: { path: string; title: string }) => {
  const pathname = usePathname();
  return (
    <>
      {pathname !== path ? (
        <Link
          href={path}
          prefetch={false}
          className="flex items-center justify-between p-1 px-3 border w-fit rounded-md border-blue-600 bg-muted self-end"
        >
          {title} <ChevronRight />
        </Link>
      ) : null}
    </>
  );
};

const LinksPageBlock = () => {
  const { authUser } = useStoreUser();

  return (
    <div className="flex flex-wrap gap-3 self-end px-2 pb-2">
      <LinkPage path="/adminboard/bots" title="Боты" />

      <LinkPage path={`/adminboard/deals/${authUser?.id}`} title="Сделки" />

      <LinkPage path="/adminboard/events" title="Календарь" />
    </div>
  );
};

export default LinksPageBlock;
