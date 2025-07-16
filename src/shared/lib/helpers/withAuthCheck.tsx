import { checkTokens } from "./checkTokens";

type AsyncFn<T extends unknown[]> = (...args: T) => Promise<void | T>;

export function withAuthCheck<T extends unknown[]>(fn: AsyncFn<T>): AsyncFn<T> {
  return async function (...args: T): Promise<void | T> {

    const event = args[0] as React.FormEvent;
    
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    try {
      await checkTokens();
    } catch (err) {
      console.log(err, "withAuthCheck error");
      return;
    }

    return fn(...args);
  };
}
