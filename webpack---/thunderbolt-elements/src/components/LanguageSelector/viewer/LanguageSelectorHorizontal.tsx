import React from 'react';
import classNames from 'clsx';
import { formatClassNames } from '@wix/editor-elements-common-utils';
import { IItem, ILanguageSelectorLayoutProps } from '../LanguageSelector.types';
import { testIds } from '../constants';
import semanticClassNames from '../LanguageSelector.semanticClassNames';
import style from './style/LanguageSelector.scss';
import { getAriaLabel } from './common/AriaLabelGetter';

type LanguageButtonProps = {
  item: IItem;
  onClick: ILanguageSelectorLayoutProps['onChange'];
};

const LanguageButton = ({
  item: { text, label, flag, flagSrcSet, value, selected },
  onClick,
}: LanguageButtonProps) => {
  return (
    <button
      aria-label={label}
      aria-current={selected}
      tabIndex={selected ? -1 : undefined}
      className={classNames(formatClassNames(semanticClassNames.option), {
        [style.selected]: selected,
      })}
      onClick={() => onClick(value)}
    >
      {flag && (
        <div className={style.flag}>
          <img
            src={flag}
            srcSet={flagSrcSet}
            alt={text === label ? '' : label}
          />
        </div>
      )}
      {text && <div className={style.text}>{text}</div>}
    </button>
  );
};

export const LanguageSelectorHorizontal = ({
  translations: { defaultAriaLabel },
  items,
  onChange,
  alignItems,
  customClassNames,
}: ILanguageSelectorLayoutProps) => {
  const selected = items.find(item => item.selected);
  const ariaLabel = getAriaLabel(defaultAriaLabel!, selected?.label || '');

  return (
    <div className={style.horizontalWrapper}>
      <div
        className={classNames(
          style.horizontal,
          style[alignItems],
          formatClassNames(semanticClassNames.root, ...customClassNames),
        )}
        data-testid={testIds.container}
        aria-label={ariaLabel}
      >
        {items.map(item => (
          <LanguageButton key={item.value} item={item} onClick={onChange} />
        ))}
      </div>
    </div>
  );
};
