import { useMemo, useCallback, useRef } from 'react';

export const usePickColor = (
  callback: (value: string) => void = () => { }
): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSetColor = useMemo(() => {
    return (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(value);
      }, 300);
    };
  }, [callback]);

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSetColor(e.target.value);
    },
    [debouncedSetColor]
  );

  return handleColorChange;
};
