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
      className={`absolute inset-0 z-1000 flex items-center justify-center bg-black/20 ${className}`}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      style={{
        pointerEvents: "auto", // <- важно: блокирует взаимодействие с подложкой
      }}
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
          style={{
            pointerEvents: "auto", // <- важно: блокирует взаимодействие с подложкой
          }}
          className={`fixed inset-0 z-1000 flex items-center justify-center bg-black/20 ${className}`}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        />,
        document.body
      )}
    </>
  );
};

export default Overlay;
