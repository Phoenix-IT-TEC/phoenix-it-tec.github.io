import React, { KeyboardEvent, HTMLProps } from 'react';
import { keyCodes } from '@wix/editor-elements-common-utils';

type KeyboardHandlerProps = {
  onReturnOrSpace?: () => void;
  onArrowKeyDown?: () => void;
  onArrowKeyUp?: () => void;
  onArrowKeyRight?: () => void;
  onArrowKeyLeft?: () => void;
  onEscape?: () => void;
} & Omit<HTMLProps<HTMLDivElement>, 'onKeyDown'>;

const fireEventIfExists = (
  event: KeyboardEvent<HTMLDivElement>,
  func?: () => void,
) => {
  if (func) {
    func();
    event.preventDefault();
  }
};

export const KeyboardHandler = React.forwardRef<
  HTMLDivElement,
  KeyboardHandlerProps
>(
  (
    {
      children,
      onReturnOrSpace,
      onArrowKeyDown: onDown,
      onArrowKeyUp: onUp,
      onEscape,
      ...props
    },
    ref,
  ) => {
    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
      switch (event.keyCode) {
        case keyCodes.enter:
        case keyCodes.space:
          fireEventIfExists(event, onReturnOrSpace);
          break;
        case keyCodes.arrowDown:
          fireEventIfExists(event, onDown);
          break;
        case keyCodes.arrowUp:
          fireEventIfExists(event, onUp);
          break;
        case keyCodes.escape:
          fireEventIfExists(event, onEscape);
          break;
        default:
          break;
      }
    };

    return (
      <div ref={ref} onKeyDown={onKeyDown} {...props}>
        {children}
      </div>
    );
  },
);
