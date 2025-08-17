import { ReactNode } from "react";

import Link from "next/link";

import { Button } from "@/shared/components/ui/button";

type EventsListLinkProps = {
  pathName: string;
  className?: string;
  label?: string;
  icon?: ReactNode;
};

const ButtonLink = ({
  pathName,
  className = "w-fit h-12",
  label,
  icon,
}: EventsListLinkProps) => (
  <Button asChild variant="outline" className={className}>
    <Link href={pathName} className="p-1">
      {icon}
      {label}
    </Link>
  </Button>
);

export default ButtonLink;
