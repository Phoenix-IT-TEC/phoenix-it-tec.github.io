import React, { useMemo } from 'react';
import classNames from 'clsx';
import { formatClassNames } from '@wix/editor-elements-common-utils';
import semanticClassNames from '../LanguageSelector.semanticClassNames';
import { IItem, Items } from '../LanguageSelector.types';
import { testIds } from '../constants';
import ArrowIcon from './assets/arrowIcon.svg';
import style from './style/LanguageSelector.scss';

type LanguageSelectorDropDownHandleProps = {
  onClick?: () => void;
  item: IItem;
  className?: string;
  showArrow: boolean;
  showText: boolean;
  customClassNames: Array<string>;
  children?: React.ReactNode;
};

export const LanguageSelectorDropDownHandle: React.FC<
  LanguageSelectorDropDownHandleProps
> = ({
  onClick,
  item,
  children,
  className,
  showArrow,
  showText,
  customClassNames,
  ...props
}) => {
  return (
    <div
      data-testid={testIds.dropdownHandleContainer}
      className={classNames([style.dropdown, className])}
      {...props}
    >
      <Option
        item={item}
        data-testid={testIds.dropdownHandle}
        showArrow={showArrow}
        showText={showText}
        className={classNames(
          style.dropdownHandle,
          formatClassNames(semanticClassNames.root, ...customClassNames),
        )}
        onClick={onClick}
      />
      {children}
    </div>
  );
};

interface OptionProps {
  item: IItem;
  id?: string;
  showArrow: boolean;
  showText?: boolean;
  'aria-selected'?: boolean;
  'aria-label'?: string;
  'data-testid'?: string;
  role?: string;
  onClick?: React.MouseEventHandler;
  className?: string;
}

export const Option = React.forwardRef<HTMLDivElement, OptionProps>(
  (
    {
      id,
      item,
      showArrow,
      showText = true,
      'aria-selected': ariaSelected,
      'data-testid': dataTestId,
      'aria-label': ariaLabel,
      role,
      onClick,
      className,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        id={id}
        aria-label={ariaLabel}
        aria-selected={ariaSelected}
        role={role}
        onClick={onClick}
        className={className}
        data-testid={dataTestId}
      >
        {item.flag && (
          <FlagContainer
            flag={item.flag}
            alt={item.text === item.label ? '' : item.label}
            flagSrcSet={item.flagSrcSet}
          />
        )}
        {item.text && showText && <LabelContainer text={item.text} />}
        {showArrow && <ArrowContainer />}
      </div>
    );
  },
);

export const FlagContainer = ({
  flag,
  alt,
  flagSrcSet,
}: {
  flag: string;
  alt: string;
  flagSrcSet?: string;
}) => (
  <div className={style.flagContainer} aria-hidden="true">
    <img src={flag} srcSet={flagSrcSet} alt={alt} />
  </div>
);

export const LabelContainer = ({ text }: { text: string }) => (
  <div className={style.label} data-testid={testIds.dropdownOptionText}>
    {text}
  </div>
);

export const ArrowContainer = () => (
  <>
    <div className={style.spacer}></div>
    <div aria-hidden="true" className={style.arrow}>
      <ArrowIcon />
    </div>
  </>
);

export function useOrganizeItems(items: Items) {
  const [selected, ...options] = useMemo(
    () =>
      items.reduce<Array<IItem>>((acc, current) => {
        acc[current.selected ? 'unshift' : 'push'](current);
        return acc;
      }, []),
    [items],
  );

  return [selected, ...options];
}
