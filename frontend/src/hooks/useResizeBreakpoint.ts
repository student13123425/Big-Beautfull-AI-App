import { useEffect, useRef } from 'react';

type Options = {
  debounceMs?: number;           // debounce delay in ms (default 0 = no debounce)
  immediate?: boolean;           // call matching callback once on mount (default false)
  callOnEveryResize?: boolean;   // call callback on every resize while on that side (default false)
};

/**
 * Calls onUnder/onOver according to window.innerWidth vs threshold.
 * - onUnder: called when width < threshold (or continuously if callOnEveryResize)
 * - onOver : called when width >= threshold (or continuously if callOnEveryResize)
 */
export function useResizeBreakpoint(
  threshold: number,
  onUnder?: () => void,
  onOver?: () => void,
  options: Options = {}
) {
  const { debounceMs = 0, immediate = false, callOnEveryResize = false } = options;

  // keep refs so we don't reattach listener when callers change identity
  const onUnderRef = useRef(onUnder);
  const onOverRef = useRef(onOver);
  const thresholdRef = useRef(threshold);
  const debounceRef = useRef(debounceMs);
  const everyRef = useRef(callOnEveryResize);

  // prev state to detect crossing (true = currently under)
  const prevIsUnderRef = useRef<boolean | null>(null);

  // keep refs updated
  useEffect(() => { onUnderRef.current = onUnder; }, [onUnder]);
  useEffect(() => { onOverRef.current = onOver; }, [onOver]);
  useEffect(() => { thresholdRef.current = threshold; }, [threshold]);
  useEffect(() => { debounceRef.current = debounceMs; }, [debounceMs]);
  useEffect(() => { everyRef.current = callOnEveryResize; }, [callOnEveryResize]);

  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR guard

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

      // if prev unknown, set it and possibly invoke (if immediate was false, we don't call here)
      if (prevIsUnderRef.current === null) {
        prevIsUnderRef.current = isUnder;
        if (everyRef.current) {
          // call matching callback on first measurement (but only if immediate or callOnEveryResize usage later)
          const fn = isUnder ? onUnderRef.current : onOverRef.current;
          invoke(fn);
        }
        return;
      }

      if (callOnEveryResize || everyRef.current) {
        // call on every resize but only the callback corresponding to current side
        const fn = isUnder ? onUnderRef.current : onOverRef.current;
        invoke(fn);
        prevIsUnderRef.current = isUnder;
        return;
      }

      // otherwise only act on crossing threshold
      if (isUnder !== prevIsUnderRef.current) {
        prevIsUnderRef.current = isUnder;
        const fn = isUnder ? onUnderRef.current : onOverRef.current;
        invoke(fn);
      }
    };

    // initial run if immediate requested
    if (immediate) {
      const w = window.innerWidth;
      const isUnder = w < thresholdRef.current;
      prevIsUnderRef.current = isUnder;
      const fn = isUnder ? onUnderRef.current : onOverRef.current;
      // immediate should bypass debounce for a snappy startup; if you want debounce here too, remove the direct call
      if (debounceRef.current > 0) invoke(fn);
      else fn && fn();
    } else {
      // mark prev state so handler can compare on first resize
      prevIsUnderRef.current = null;
    }

    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
      if (timer) clearTimeout(timer);
    };
    // note: we intentionally attach listener once and use refs to avoid frequent rebinds
  }, []);
}

/* Convenience wrappers */

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
