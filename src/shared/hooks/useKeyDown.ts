import { useEffect, useRef } from "react";

const useKeyDown = (
  isActive: boolean,
  callback: () => void,
  key: string,
  options: { preventDefault?: boolean } = {}
) => {
  const callbackRef = useRef(callback);
  const optionsRef = useRef(options);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isActive) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === key) {
        if (optionsRef.current.preventDefault) {
          event.preventDefault();
        }
        callbackRef.current();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [key, isActive]);
};

export default useKeyDown;
