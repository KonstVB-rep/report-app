"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { deleteUser, getUser } from "../api";
import { TOAST } from "./Toast";
import { getQueryClient } from "@/app/provider/query-provider";

export function DeleteUser() {
  const params = useParams();
  const userId = String(params.userId);
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => {
      try {
        return getUser(userId);
      } catch (error) {
        TOAST.ERROR((error as Error).message);
      }
    },
    enabled: !!userId,
  });
  const queryClient = getQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteUser(userId),
    onSuccess: () => {
      router.push("/dashboard");
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: ["user", userId],
          exact: true,
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["depsWithEmp"],
        exact: true,
      });
    },
    onError: (error) => {
      TOAST.ERROR((error as Error).message);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-2 items-center justify-start border-none h-10 w-full px-2"
        >
          <Trash /> Удалиить профиль
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" showX={false}>
        <DialogHeader>
          <DialogTitle className="sr-only">Удалить пользователя</DialogTitle>
          <DialogDescription className="sr-only">
            Пользователь будет удален навсегда
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-8 py-4">
          <p className="text-center">Вы уверены что хотите удалить аккаунт?</p>
          <p>
            Пользователь:{" "}
            <span className="font-bold capitalize">
              {data?.username.split(" ").join(" ")}
            </span>{" "}
            будет удален безвозвратно
          </p>
          <div className="flex justify-between gap-4">
            <Button onClick={() => mutate()} className="flex-1">
              {isPending ? "Удаление..." : "Удалить"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" className="flex-1">
                Отмена
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
