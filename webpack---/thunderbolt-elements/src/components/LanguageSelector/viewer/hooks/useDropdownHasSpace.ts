import { useState, useRef, RefObject } from 'react';
import { useIsomorphicLayoutEffect } from '../../../../providers/useIsomorphicLayoutEffect';

export function useDropdownHasSpace(
  isOpen: boolean,
): [boolean, RefObject<HTMLDivElement>] {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpenUp, setIsOpenUp] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (dropdownRef.current) {
      const { top, height } = dropdownRef.current.getBoundingClientRect();
      const dropdownExceedBottom =
        top + height > document.documentElement.clientHeight;
      const dropdownExceedTop = top - height < 0;

      setIsOpenUp(dropdownExceedBottom && !dropdownExceedTop);
    }
  }, [isOpen]);

  return [isOpenUp, dropdownRef];
}
