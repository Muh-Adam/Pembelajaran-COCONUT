import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    // Set timeout for debouncing
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    // Cleanup function — cancel the timeout if value/delay changes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounced;
}
