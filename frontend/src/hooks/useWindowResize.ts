import { useEffect, useRef } from 'react';

type UseWindowResizeOptions = {
  debounceMs?: number;
  immediate?: boolean;
};

export function useWindowResize(
  callback: () => void,
  options: UseWindowResizeOptions = {},
  deps: React.DependencyList = []
) {
  const { debounceMs = 0, immediate = false } = options;
  const cbRef = useRef(callback);

  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeout: ReturnType<typeof setTimeout> | null = null;

    const handler = () => {
      if (debounceMs > 0) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          cbRef.current();
          timeout = null;
        }, debounceMs);
      } else {
        cbRef.current();
      }
    };

    window.addEventListener('resize', handler);

    if (immediate) handler();

    return () => {
      window.removeEventListener('resize', handler);
      if (timeout) clearTimeout(timeout);
    };
  }, [debounceMs, immediate, ...deps]);
}
