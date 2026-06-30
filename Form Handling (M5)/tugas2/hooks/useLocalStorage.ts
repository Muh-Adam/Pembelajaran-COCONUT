import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(key, JSON.stringify(nextValue));
          } catch {
            // ignore
          }
        }
        return nextValue;
      });
    },
    [key]
  );

  // Sync from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item) as T);
    } catch {
      // ignore
    }
    // cleanup: nothing to clean
    return () => {};
  }, [key]);

  return [storedValue, setValue] as const;
}
