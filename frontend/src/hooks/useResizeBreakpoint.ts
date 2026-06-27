import { useEffect, useRef } from 'react';

type Options = {
  debounceMs?: number;
  immediate?: boolean;
  callOnEveryResize?: boolean;
};

export function useResizeBreakpoint(
  threshold: number,
  onUnder?: () => void,
  onOver?: () => void,
  options: Options = {}
) {
  const { debounceMs = 0, immediate = false, callOnEveryResize = false } = options;

  const onUnderRef = useRef(onUnder);
  const onOverRef = useRef(onOver);
  const thresholdRef = useRef(threshold);
  const debounceRef = useRef(debounceMs);
  const everyRef = useRef(callOnEveryResize);

  const prevIsUnderRef = useRef<boolean | null>(null);

  useEffect(() => { onUnderRef.current = onUnder; }, [onUnder]);
  useEffect(() => { onOverRef.current = onOver; }, [onOver]);
  useEffect(() => { thresholdRef.current = threshold; }, [threshold]);
  useEffect(() => { debounceRef.current = debounceMs; }, [debounceMs]);
  useEffect(() => { everyRef.current = callOnEveryResize; }, [callOnEveryResize]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const invoke = (fn?: () => void) => {
      if (!fn) return;
      if (debounceRef.current > 0) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          fn();
          timer = null;
        }, debounceRef.current);
      } else {
        fn();
      }
    };

    const handler = () => {
      const w = window.innerWidth;
      const isUnder = w < thresholdRef.current;

      if (prevIsUnderRef.current === null) {
        prevIsUnderRef.current = isUnder;
        if (everyRef.current) {
          const fn = isUnder ? onUnderRef.current : onOverRef.current;
          invoke(fn);
        }
        return;
      }

      if (callOnEveryResize || everyRef.current) {
        const fn = isUnder ? onUnderRef.current : onOverRef.current;
        invoke(fn);
        prevIsUnderRef.current = isUnder;
        return;
      }

      if (isUnder !== prevIsUnderRef.current) {
        prevIsUnderRef.current = isUnder;
        const fn = isUnder ? onUnderRef.current : onOverRef.current;
        invoke(fn);
      }
    };

    if (immediate) {
      const w = window.innerWidth;
      const isUnder = w < thresholdRef.current;
      prevIsUnderRef.current = isUnder;
      const fn = isUnder ? onUnderRef.current : onOverRef.current;
      if (debounceRef.current > 0) invoke(fn);
      else fn && fn();
    } else {
      prevIsUnderRef.current = null;
    }

    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
      if (timer) clearTimeout(timer);
    };
  }, []);
}

export function useOnResizeUnder(
  threshold: number,
  callback: () => void,
  options?: Options
) {
  useResizeBreakpoint(threshold, callback, undefined, options);
}

export function useOnResizeOver(
  threshold: number,
  callback: () => void,
  options?: Options
) {
  useResizeBreakpoint(threshold, undefined, callback, options);
}
