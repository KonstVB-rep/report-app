
import { useRouter } from "next/navigation";

import { ArrowBigLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

const ButtonBack = ({className}: {className?: string  }) => {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      className={className}
    >
      <ArrowBigLeft />
      Назад
    </Button>
  );
};

export default ButtonBack;
