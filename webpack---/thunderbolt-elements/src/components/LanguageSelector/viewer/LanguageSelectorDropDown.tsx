import React, { useEffect, useRef, useState } from 'react';
import classNames from 'clsx';
import { formatClassNames } from '@wix/editor-elements-common-utils';
import { ILanguageSelectorLayoutProps, IItem } from '../LanguageSelector.types';
import { testIds } from '../constants';
import semanticClassNames from '../LanguageSelector.semanticClassNames';
import {
  LanguageSelectorDropDownHandle,
  useOrganizeItems,
  Option,
} from './LanguageSelectorDropDownCommon';
import style from './style/LanguageSelector.scss';
import { KeyboardHandler } from './KeyboardHandler';
import { getAriaLabel } from './common/AriaLabelGetter';
import { useDropdownHasSpace } from './hooks/useDropdownHasSpace';

export const LanguageSelectorDropdown = ({
  id,
  translations: { defaultAriaLabel },
  items,
  onChange,
  extraOptions,
  isOpen = false,
  setIsOpen,
  disabled,
  customClassNames,
}: ILanguageSelectorLayoutProps) => {
  const [itemIndex, setItemIndex] = useState(0);
  const [shouldOpenUp, listRef] = useDropdownHasSpace(isOpen);
  const handlerRef = useRef<HTMLDivElement>(null);
  const currentItemRef = useRef<HTMLDivElement>(null);
  const options = useOrganizeItems(items);

  const ariaLabel = getAriaLabel(defaultAriaLabel!, options[0].label);

  const navigateUp = () => {
    setItemIndex(Math.max(0, itemIndex - 1));
  };

  const navigateDown = () => {
    setItemIndex(Math.min(options.length - 1, itemIndex + 1));
  };

  const onClickArrowDownKey = () => {
    if (shouldOpenUp) {
      navigateUp();
    } else {
      navigateDown();
    }
  };

  const onClickArrowUp = () => {
    if (shouldOpenUp) {
      navigateDown();
    } else {
      navigateUp();
    }
  };

  const onReturnOrSpace = () => {
    if (itemIndex) {
      onChange(options[itemIndex]?.value);
      closeDropdown();
    } else {
      setIsOpen(!isOpen);
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setItemIndex(0);
  };

  const onClick = () => {
    if (isOpen) {
      setItemIndex(shouldOpenUp ? options.length - 1 : 0);
    } else {
      updateHeight();
    }
    setIsOpen(!isOpen);
  };

  const getOptionClickHandler = (index: number, item: IItem) => () => {
    return index > 0 ? onChange(item.value) : onClick();
  };

  const updateHeight = (): void => {
    if (!handlerRef.current) {
      return;
    }
    handlerRef.current.style.setProperty(
      '--height',
      `${handlerRef.current.offsetHeight}px`,
    );
  };

  const scrollViewAfterKeyboardNavigation = () => {
    if (itemIndex > 0) {
      currentItemRef.current?.scrollIntoView?.({ block: 'nearest' });
    }
  };

  useEffect(updateHeight, []);
  useEffect(scrollViewAfterKeyboardNavigation, [itemIndex]);

  return (
    <KeyboardHandler
      tabIndex={0}
      aria-haspopup="true"
      aria-activedescendant={`${id}-dropdown-option-${itemIndex}`}
      aria-expanded={isOpen}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      data-testid={testIds.container}
      onBlur={closeDropdown}
      onArrowKeyDown={onClickArrowDownKey}
      onArrowKeyUp={onClickArrowUp}
      onEscape={closeDropdown}
      onReturnOrSpace={onReturnOrSpace}
      className={style.container}
      ref={handlerRef}
      role="combobox"
    >
      <LanguageSelectorDropDownHandle
        onClick={onClick}
        item={options[0]}
        className={classNames({
          [style.open]: isOpen,
        })}
        showArrow={!!extraOptions.showArrow}
        showText={true}
        customClassNames={customClassNames}
      >
        <div
          role="listbox"
          className={classNames([style.list], { [style.up]: shouldOpenUp })}
          ref={listRef}
        >
          {options.map((item, index) => {
            return (
              <Option
                ref={index === itemIndex ? currentItemRef : undefined}
                id={`${id}-dropdown-option-${index}`}
                key={item.value}
                item={item}
                aria-label={item.label}
                aria-selected={index === itemIndex}
                showArrow={index === 0}
                role="option"
                onClick={getOptionClickHandler(index, item)}
                className={classNames([
                  style.item,
                  formatClassNames(semanticClassNames.option),
                  {
                    [style.focus]: index === itemIndex,
                    [style.selected]: index === 0,
                  },
                ])}
              />
            );
          })}
        </div>
      </LanguageSelectorDropDownHandle>
    </KeyboardHandler>
  );
};
