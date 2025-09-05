import { ReactNode } from "react";

import { EllipsisVertical } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

type PopoverMenuItem = {
  label: string;
  item: ReactNode;
};
type PopoverMenuProps = { items: PopoverMenuItem[] };
export function PopoverMenuComponent({ items }: PopoverMenuProps) {
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <EllipsisVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit flex flex-col gap-2 " align="start">
        {items.map((item) => (
          <div key={item.label}>{item.item}</div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
