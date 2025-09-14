import React from "react";

import Image from "next/image";
import Link from "next/link";

import logo from "@/public/logo.png";

type LogoProps = {
  isTitle?: boolean;
  href?: string;
  title?: string;
};

const Logo = ({ isTitle = true, href, title }: LogoProps) => {
  return (
    <div className="flex-1 text-left text-sm leading-tight">
      <Link
        href={href || ""}
        className="flex gap-2 w-full truncate text-lg font-semibold italic cursor-pointer"
        title={title}
      >
        <div className="flex aspect-square size-6 items-center justify-center rounded bg-blue-600 text-sidebar-primary-foreground">
          <Image
            src={logo}
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
