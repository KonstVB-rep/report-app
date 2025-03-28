import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import React from "react";

type SubmitButtonProps = {
  isPending: boolean;
} & React.ComponentProps<"button">;

const SubmitFormButton = ({
  title,
  isPending,
  ...props
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full"
      aria-label="Отправить форму"
      {...props}
    >
      {isPending ? <Loader className="h-5 w-5 animate-spin" /> : title}
    </Button>
  );
};

export default SubmitFormButton;
