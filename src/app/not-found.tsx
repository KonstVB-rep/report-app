import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
      <h1 className="text-xl">Страница не найдена</h1>
      <p className="text-xl">Не удалось найти запрошенный ресурс</p>
      <Button asChild>
        <Link href="/">Вернуться на главную страницу</Link>
      </Button>
    </div>
  );
}
