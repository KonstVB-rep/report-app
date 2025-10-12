import { useEffect, useRef, useState } from "react"

function useAnimateOnDataChange<T>(data: T[]): boolean {
  const [shouldRender, setShouldRender] = useState(false)
  const prevDataRef = useRef<T[]>([])

  useEffect(() => {
    const prevData = prevDataRef.current

    const isChanged =
      prevData.length !== data.length || prevData.some((item, index) => item !== data[index])

    if (isChanged) {
      setShouldRender(true)
    }

    prevDataRef.current = data
  }, [data])

  return shouldRender
}

export default useAnimateOnDataChange
