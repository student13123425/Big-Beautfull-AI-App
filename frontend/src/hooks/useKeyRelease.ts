import { useEffect } from 'react';

type ModifierKeys = {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
};

// Updated useKeyRelease hook
const useKeyRelease = (
  targetKey: string,
  callback: () => void,
  modifiers: ModifierKeys = {}
) => {
  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      // Handle both 'Control' and specific control keys
      const isControl = targetKey.startsWith('Control') && 
                        (event.key === 'Control' || 
                         event.key === 'ControlLeft' || 
                         event.key === 'ControlRight');
      
      if (
        (event.key === targetKey || isControl) &&
        (modifiers.ctrl === undefined || event.ctrlKey === modifiers.ctrl) &&
        (modifiers.shift === undefined || event.shiftKey === modifiers.shift) &&
        (modifiers.alt === undefined || event.altKey === modifiers.alt) &&
        (modifiers.meta === undefined || event.metaKey === modifiers.meta)
      ) {
        callback();
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [targetKey, callback, modifiers]);
};
export default useKeyRelease;