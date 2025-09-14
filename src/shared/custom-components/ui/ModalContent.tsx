import { ReactNode } from "react";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface ModalContentProps {
  className: string;
  children: ReactNode;
  title?: string;
  showX?: boolean;
}

const ModalContent = ({
  children,
  className,
  title,
  showX = true,
}: ModalContentProps) => {
  return (
    <DialogContent className={className} showX={showX}>
      <DialogHeader>
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      {children}
    </DialogContent>
  );
};

export default ModalContent;
