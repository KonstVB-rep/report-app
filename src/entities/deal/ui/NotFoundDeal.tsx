import { FileQuestion } from "lucide-react"

const NotFoundDeal = () => {
  return (
    <section className="relative h-full w-full p-4">
      <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <h1 className="p-4 text-center text-2xl uppercase">Данные не найдены</h1>

        <FileQuestion className="h-[30%] w-[30%] opacity-30" strokeWidth={1} />
      </div>
    </section>
  )
}

export default NotFoundDeal
