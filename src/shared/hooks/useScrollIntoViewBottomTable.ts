import { useEffect, useRef } from "react"

const useScrollIntoViewBottom = <E extends HTMLElement = HTMLDivElement>() => {
  const ref = useRef<E>(null)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      ref.current?.scrollTo?.({
        top: ref.current.scrollHeight,
        behavior: "smooth",
      })
    }, 100)

    return () => clearTimeout(timeoutId)
  }, []) // Пустой массив зависимостей - только при монтировании

  return ref
}

export default useScrollIntoViewBottom
