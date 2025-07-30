import { useEffect, useState } from "react";

function useAnimateOnDataChange<T>(data: T[]): boolean {
  const [shouldRender, setShouldRender] = useState<boolean>(false);

  useEffect(() => {
    setShouldRender(true);
  }, [data]);

  return shouldRender;
}

export default useAnimateOnDataChange;
