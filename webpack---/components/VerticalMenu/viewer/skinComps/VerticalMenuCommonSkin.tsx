import React, { useRef, useState } from 'react';
import classnames from 'clsx';
import {
  formatClassNames,
  getDataAttributes,
} from '@wix/editor-elements-common-utils';
import type { VerticalMenuProps, LogicProps } from '../../VerticalMenu.types';
import semanticClassNames from '../../VerticalMenu.semanticClassNames';
import MenuItem from './MenuItem';

type IVerticalMenuCommonSkinProps = Omit<VerticalMenuProps, 'translations'> &
  LogicProps & {
    ariaLabel: string;
  };

const VerticalMenuCommonSkin: React.FunctionComponent<
  IVerticalMenuCommonSkinProps
> = props => {
  const {
    items,
    skin,
    id,
    className,
    customClassNames = [],
    ariaLabel,
    menuItemHeight,
    style,
    separatedButton,
    subMenuOpenSide,
    reportBiOnClick,
    onMouseEnter,
    onMouseLeave,
    onItemClick,
    onItemDblClick,
    onItemMouseIn,
    onItemMouseOut,
  } = props;
  const navRef = useRef<HTMLElement>(null);
  const [highlightedLinkId, setHighlightedLinkId] = useState<string | null>(
    null,
  );

  return (
    <nav
      id={id}
      {...getDataAttributes(props)}
      ref={navRef}
      aria-label={ariaLabel}
      className={classnames(
        style[skin],
        style.autoHeight,
        className,
        formatClassNames(semanticClassNames.root, ...customClassNames),
      )}
      tabIndex={-1}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ul className={style.menuContainer}>
        {items &&
          items.map((item, idx) => (
            <MenuItem
              key={idx}
              item={item}
              uniqueId={idx.toString()}
              isSubItem={false}
              navRef={navRef}
              menuItemHeight={menuItemHeight}
              style={style}
              separatedButton={separatedButton}
              subMenuOpenSide={subMenuOpenSide}
              reportBiOnClick={reportBiOnClick}
              onItemClick={onItemClick}
              onItemDblClick={onItemDblClick}
              onItemMouseIn={onItemMouseIn}
              onItemMouseOut={onItemMouseOut}
              highlightedLinkId={highlightedLinkId}
              setHighlightedLinkId={setHighlightedLinkId}
            />
          ))}
      </ul>
    </nav>
  );
};

export default VerticalMenuCommonSkin;
