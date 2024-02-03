import { useEffect, useState } from "react";

export function useDebounce<T = string>(value: T, delay: number) {
  const [debouncedVal, setDebouncedVal] = useState<T>(value);

  useEffect(() => {
    let handler = setTimeout(() => {
      setDebouncedVal(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedVal;
}
