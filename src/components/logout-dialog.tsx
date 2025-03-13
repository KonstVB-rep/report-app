
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
import useStoreUser from "@/entities/user/store/useStoreUser";
import { logout } from "@/feature/auth/logout";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutDialog() {
    
  const { resetStore } = useStoreUser();
  const [loading, setLoading] = useState(false)

  const router = useRouter(); 
  const handleLogout = async () => {
    setLoading(true)

    try {
      await logout();
      router.push("/login");
      resetStore()
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }finally{
      setLoading(false)
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="btn_hover justify-center"
        >
          <LogOut /> Выход
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" showX={false}>
        <DialogHeader>
            <DialogTitle className="sr-only">Выход из приложения</DialogTitle>
          <DialogDescription className="sr-only">Прекращение действующей сессии</DialogDescription>
        </DialogHeader>
        <div className="grid gap-8 py-4">
          <p className="text-center">Вы уверены что хотите выйти?</p>
          <div className="flex justify-between gap-4">
            <Button onClick={handleLogout} className="flex-1">{ loading ? "Выход..." : "Да, выйти"}</Button>
            <DialogClose asChild>
                <Button variant="outline" className="flex-1">Отмена</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
