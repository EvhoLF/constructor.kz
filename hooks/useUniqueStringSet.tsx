import { useMemo } from 'react';

export function useUniqueStringSet<T>(data: T[],selector: (item: T) => string) {
  const uniqueSet = useMemo(() => {
    return new Set(data.map(selector));
  }, [data, selector]);

  const has = (value: string) => uniqueSet.has(value);

  return { set: uniqueSet, has };
}
