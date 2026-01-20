import { useEffect, useRef } from 'react';

type UseWindowResizeOptions = {
  debounceMs?: number;   // 0 = no debounce (default)
  immediate?: boolean;   // run callback once on mount (default false)
};

/**
 * Calls `callback` on window resize until component unmounts.
 * - debounceMs: delay in ms to debounce calls (0 = none)
 * - immediate: call callback once on mount
 * - deps: additional dependencies that should rebind the listener (e.g. values used inside callback)
 */
export function useWindowResize(
  callback: () => void,
  options: UseWindowResizeOptions = {},
  deps: React.DependencyList = []
) {
  const { debounceMs = 0, immediate = false } = options;
  const cbRef = useRef(callback);

  // keep latest callback reference without reattaching listener
  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR guard

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
    // include options that affect behavior + user deps
  }, [debounceMs, immediate, ...deps]);
}
