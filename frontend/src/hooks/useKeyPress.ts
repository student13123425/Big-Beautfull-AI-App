import { useEffect } from 'react';

type ModifierKeys = {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
};

const useKeyPress = (
  targetKey: string,
  callback: () => void,
  modifiers: ModifierKeys = {}
) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.key === targetKey &&
        (modifiers.ctrl === undefined || event.ctrlKey === modifiers.ctrl) &&
        (modifiers.shift === undefined || event.shiftKey === modifiers.shift) &&
        (modifiers.alt === undefined || event.altKey === modifiers.alt) &&
        (modifiers.meta === undefined || event.metaKey === modifiers.meta)
      ) {
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [targetKey, callback, modifiers]);
};

export default useKeyPress