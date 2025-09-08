import React from "react";

import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  isTitle?: boolean;
  href?: string;
};

const Logo = ({ isTitle = true, href }: LogoProps) => {
  return (
    <div className="flex-1 text-left text-sm leading-tight">
      <Link
        href={href || ""}
        className="flex gap-2 w-full truncate text-lg font-semibold italic cursor-pointer"
        title="На главную"
      >
        <div className="flex aspect-square size-[1.5rem] items-center justify-center rounded-sm bg-blue-600 text-sidebar-primary-foreground">
          <Image
            src="/logo.png"
            alt="logo"
            width={16}
            height={16}
            style={{ width: "16px", height: "16px" }}
            className="drop-shadow-[0_0px_8px_rgba(255,255,255,1)] dark:drop-shadow-[0_0px_8px_rgba(0,0,0,1)]"
          />
        </div>
        {isTitle && <span>Ertel</span>}
      </Link>
    </div>
  );
};

export default Logo;
