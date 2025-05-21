import React from "react";
import { useFormStatus } from "react-dom";

import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = {} & React.ComponentProps<"button">;

const SubmitFormActionBtn = ({ title, ...props }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="flex w-full items-center"
      aria-label="Отправить форму"
      {...props}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader className="h-5 w-5 animate-spin" /> Выполнение...
        </span>
      ) : (
        title
      )}
    </Button>
  );
};

export default SubmitFormActionBtn;
