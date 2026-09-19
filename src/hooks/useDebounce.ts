import { useEffect, useState } from 'react';

/**
 * useDebounce hook
 * Delays updating the debounced value until after delay milliseconds
 * have elapsed since the last time the value was modified.
 */
export function useDebounce<T>(value: T, delay = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
