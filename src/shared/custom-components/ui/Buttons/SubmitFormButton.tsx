import React from "react";

import { Loader } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

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
      className="w-full active:scale-95 transition-transform duration-150"
      aria-label="Отправить форму"
      disabled={isPending}
      {...props}
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <Loader className="h-5 w-5 animate-spin" /> Выполнение...
        </span>
      ) : (
        title
      )}
    </Button>
  );
};

export default SubmitFormButton;
