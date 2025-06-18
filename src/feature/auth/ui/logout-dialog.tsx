import { useState } from "react";

import { useRouter } from "next/navigation";

import { LogOut } from "lucide-react";

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
import { logout } from "@/feature/auth/logout";
import { resetAllStores } from "@/shared/lib/helpers/сreate";
import Overlay from "@/shared/ui/Overlay";

const LogoutDialog = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleLogout = async () => {
    setLoading(true);

    try {
      router.replace("/login");
      await logout();
      resetAllStores();
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Overlay isPending={loading} />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="btn_hover w-full justify-center text-sm"
          >
            <LogOut /> Выход
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" showX={false}>
          <DialogHeader>
            <DialogTitle className="sr-only">Выход из приложения</DialogTitle>
            <DialogDescription className="sr-only">
              Прекращение действующей сессии
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-8 py-4">
            <p className="text-center">Вы уверены что хотите выйти?</p>
            <div className="flex justify-between gap-4">
              <Button onClick={handleLogout} className="flex-1">
                {loading ? "Выход..." : "Да, выйти"}
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
    </>
  );
};

export default LogoutDialog;
