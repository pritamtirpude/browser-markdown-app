import React, { useEffect } from 'react';

function useClickOutside(
  ref: React.RefObject<HTMLDialogElement | null>,
  close: VoidFunction,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && checkClickOutside(event, ref.current)) {
        close();
      }
    };

    // Use mousedown for more reliable outside click detection
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, close, enabled]);
}

function checkClickOutside(event: MouseEvent, element: HTMLDialogElement) {
  const { top, left, width, height } = element.getBoundingClientRect();

  if (
    event.clientX < left ||
    event.clientX > left + width ||
    event.clientY < top ||
    event.clientY > top + height
  ) {
    return true;
  }
}

export default useClickOutside;
