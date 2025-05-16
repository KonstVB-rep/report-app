import React from "react";
import { createPortal } from "react-dom";

export const OverlayLocal = ({
  className = "",
  isPending,
}: {
  className?: string;
  isPending: boolean;
}) => {
  if (!isPending) return null;
  return (
    <div
      className={`absolute inset-0 z-[1000] flex cursor-pointer items-center justify-center bg-black/50 ${className}`}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    />
  );
};

const Overlay = ({
  className = "",
  isPending,
}: {
  className?: string;
  isPending: boolean;
}) => {
  if (!isPending) return null;
  return (
    <>
      {createPortal(
        <div
          className={`fixed inset-0 z-[1000] flex cursor-pointer items-center justify-center bg-black/50 ${className}`}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        />,
        document.body
      )}
    </>
  );
};

export default Overlay;
