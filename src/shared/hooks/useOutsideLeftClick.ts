import { RefObject, useEffect, useRef } from "react";

export const useOutsideLeftClick = (
  ref: RefObject<HTMLElement | null>,
  callback: (event: MouseEvent) => void,
  isAciveState: boolean
) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isAciveState) return;

    const handler = (event: MouseEvent) => {
      const { current: target } = ref;

      if (
        event.button === 0 &&
        target &&
        !target.contains(event.target as HTMLElement)
      ) {
        callbackRef.current(event);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isAciveState, ref]);
};
