import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { Dispatch, SetStateAction } from "react";
import SubmitFormButton from "../../../../shared/ui/Buttons/SubmitFormButton";
import { useDelProject, useGetProjectById } from "@/entities/project/hooks";

const DelProject = ({
  close,
  id,
}: {
  close: Dispatch<SetStateAction<null>>;
  id: string;
}) => {
  const { data: project } = useGetProjectById(id);
  const { mutate: delProject, isPending } = useDelProject(close);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Удалить проект</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <p>Вы точно уверены что хотите удалить проект</p>
        <p className="font-bold text-xl text-center py-2 px-4 bg-muted rounded-xl">
          &quot;{project?.nameObject}&quot;?
        </p>
        <p>Его нельзя будет восстановить!</p>
      </div>
      <DialogFooter className="grid grid-cols-2 gap-4">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Передумал
          </Button>
        </DialogClose>
        <SubmitFormButton
          type="submit"
          isPending={isPending}
          onClick={() => delProject(id)}
          title="Удалить"
        />
      </DialogFooter>
    </DialogContent>
  );
};

export default DelProject;
