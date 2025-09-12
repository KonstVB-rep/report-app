"use client";

import React, { ReactNode, useRef } from "react";
import { createPortal } from "react-dom";

import { X } from "lucide-react";

import useKeyDown from "@/shared/hooks/useKeyDown";
import { useOutsideLeftClick } from "@/shared/hooks/useOutsideLeftClick";
import { Button } from "@/shared/components/ui/button";

type Props = {
  text: ReactNode;
  isActive: boolean;
  closeFn: () => void;
  isTargetCell?: boolean;
  children?: ReactNode;
};

const RowInfoDialog = ({
  text,
  isActive,
  closeFn,
  isTargetCell,
  children,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useKeyDown(isActive, closeFn, "Escape");
  useOutsideLeftClick(ref, closeFn, isActive);

  return (
    <>
      {isActive &&
        createPortal(
          <>
            <div className="absolute inset-0 w-full h-full bg-black/40 z-50">
              <div
                ref={ref}
                className="absolute left-1/2 w-full max-h-[80vh] w-[max(96vw, 280px)] sm:max-w-[400px] top-1/2 -translate-x-1/2 -translate-y-1/2 h-auto p-5 bg-primary-foreground border-2 shadow-lg rounded-md z-10 text-primary"
              >
                <span className="block text-base text-center md:text-lg p-1 ">{text}</span>
                {isTargetCell && children}
                <Button
                  type="button"
                  size="icon"
                  onClick={closeFn}
                  className="absolute -top-4 -right-4 text-sm text-gray-500 rounded-md bg-primary border-1 border-primary p-[2px]"
                >
                  <X />
                </Button>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
};

export default RowInfoDialog;
