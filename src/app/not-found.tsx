import BackToHomeButton from "@/shared/custom-components/ui/Buttons/BackToHomeButton"

export default function NotFound() {
  return (
    <div className="not-found-page w-full relative h-full flex flex-col gap-2 sm:gap-4 items-center justify-center flex-1">
      <h1 className="text-xl">Страница не найдена</h1>
      <p className="text-xl">Не удалось найти запрошенный ресурс</p>
      <BackToHomeButton />
    </div>
  )
}
