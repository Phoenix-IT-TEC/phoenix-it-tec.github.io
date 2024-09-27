import * as React from 'react';
import classNames from 'clsx';
import { getDataAttributes } from '@wix/editor-elements-common-utils';
import {
  DisplayMode,
  ILanguageSelectorLayoutProps,
  ILanguageSelectorWithPreviewProps,
} from '../LanguageSelector.types';
import { testIds } from '../constants';
import { LanguageSelectorNativeDropdown } from './LanguageSelectorNativeDropDown';
import style from './style/LanguageSelector.scss';
import { LanguageSelectorHorizontal } from './LanguageSelectorHorizontal';
import { LanguageSelectorDropdown } from './LanguageSelectorDropDown';

const selectors: {
  [key in DisplayMode]: React.FC<ILanguageSelectorLayoutProps>;
} = {
  dropdown: LanguageSelectorDropdown,
  nativeDropdown: LanguageSelectorNativeDropdown,
  horizontal: LanguageSelectorHorizontal,
} as const;

const LanguageSelector: React.FC<ILanguageSelectorWithPreviewProps> = props => {
  const {
    id,
    className,
    customClassNames = [],
    items,
    displayMode,
    onChange,
    alignItems,
    extraOptions,
    translations,
    onMouseEnter,
    disabled,
    isOpen = false,
    setIsOpen,
  } = props;
  if (!items) {
    return <div id={id}></div>;
  }
  const Selector = selectors[displayMode];

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      className={classNames(style.container, style[alignItems], className, {
        [style.disabled]: disabled,
      })}
      data-testid={testIds.languageSelectorContainer}
      onMouseEnter={onMouseEnter}
    >
      <Selector
        customClassNames={customClassNames}
        id={id}
        translations={translations}
        items={items}
        onChange={onChange}
        alignItems={alignItems}
        extraOptions={extraOptions}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        disabled={disabled}
      />
    </div>
  );
};

export default LanguageSelector;
