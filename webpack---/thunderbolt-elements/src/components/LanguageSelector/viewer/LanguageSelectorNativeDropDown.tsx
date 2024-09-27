import React from 'react';
import { formatClassNames } from '@wix/editor-elements-common-utils';
import {
  ILanguageSelectorLayoutProps,
  Language,
} from '../LanguageSelector.types';
import semanticClassNames from '../LanguageSelector.semanticClassNames';
import {
  LanguageSelectorDropDownHandle,
  useOrganizeItems,
} from './LanguageSelectorDropDownCommon';
import styleNative from './style/DropdownNative.scss';
import { getAriaLabel } from './common/AriaLabelGetter';

export const LanguageSelectorNativeDropdown = ({
  items,
  onChange,
  translations: { defaultAriaLabel },
  extraOptions = {},
  customClassNames,
}: ILanguageSelectorLayoutProps) => {
  const options = useOrganizeItems(items);
  const ariaLabel = getAriaLabel(defaultAriaLabel!, options[0].label);
  const { showArrow = true, showHandleText = true } = extraOptions;

  return (
    <LanguageSelectorDropDownHandle
      item={options[0]}
      className={styleNative.native}
      showArrow={showArrow}
      showText={showHandleText}
      aria-label={ariaLabel}
      customClassNames={customClassNames}
    >
      <select onChange={e => onChange(e.target.value as Language)}>
        {options.map(option => (
          <option
            key={option.value}
            value={option.value}
            className={formatClassNames(semanticClassNames.option)}
          >
            {option.text}
          </option>
        ))}
      </select>
    </LanguageSelectorDropDownHandle>
  );
};
