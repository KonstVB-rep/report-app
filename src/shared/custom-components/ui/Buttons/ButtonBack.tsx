import { useRouter } from "next/navigation";

import { ArrowBigLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

const ButtonBack = ({ className }: { className?: string }) => {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      className={cn("w-fit", className)}
    >
      <ArrowBigLeft />
      Назад
    </Button>
  );
};

export default ButtonBack;
