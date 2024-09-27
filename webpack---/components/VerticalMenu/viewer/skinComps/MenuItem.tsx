import React, { useRef } from 'react';
import classnames from 'clsx';
import { formatClassNames } from '@wix/editor-elements-common-utils';
import Link, {
  isValidLink,
} from '@wix/thunderbolt-elements/src/components/Link/viewer/Link';
import type {
  VerticalMenuItem,
  VerticalMenuProperties,
} from '../../VerticalMenu.types';
import type { DeprecatedVerticalMenuDataItem } from '@wix/editor-elements-definitions';
import type { IMenuItemSDKAction } from '@wix/editor-elements-corvid-utils';
import { TestIds } from '../constants';
import useMenuOpenDirection from '../hooks/useMenuOpenDirection';
import { shouldHighlightItem } from '../utils/itemsUtils';
import semanticClassNames from '../../VerticalMenu.semanticClassNames';

const safeBlur = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};
interface MenuItemsProps {
  navRef: React.RefObject<HTMLElement>;
  item: DeprecatedVerticalMenuDataItem;
  uniqueId: string;
  isSubItem: boolean;
  menuItemHeight: number;
  style: Record<string, string>;
  separatedButton: boolean;
  subMenuOpenSide: VerticalMenuProperties['subMenuOpenSide'];
  reportBiOnClick: (item: VerticalMenuItem) => void;
  onItemClick?: IMenuItemSDKAction;
  onItemMouseIn?: IMenuItemSDKAction;
  onItemMouseOut?: IMenuItemSDKAction;
  onItemDblClick?: IMenuItemSDKAction;
  highlightedLinkId: string | null;
  setHighlightedLinkId: (id: string | null) => void;
  parentMenuItemRef?: React.RefObject<HTMLAnchorElement>;
}

const MenuItem: React.FunctionComponent<MenuItemsProps> = ({
  navRef,
  item,
  uniqueId,
  isSubItem,
  menuItemHeight,
  style,
  separatedButton,
  subMenuOpenSide,
  parentMenuItemRef,
  reportBiOnClick,
  onItemClick,
  onItemMouseIn,
  onItemMouseOut,
  onItemDblClick,
  highlightedLinkId,
  setHighlightedLinkId,
}) => {
  const subMenuOpenDirection = useMenuOpenDirection(navRef, menuItemHeight);
  const itemRef = useRef<HTMLAnchorElement | null>(null);

  const isEventDestinationTargetElementInsideMenu = (
    e:
      | React.MouseEvent<HTMLAnchorElement | HTMLSpanElement, MouseEvent>
      | React.FocusEvent<HTMLAnchorElement | HTMLSpanElement>,
  ) => {
    if (!navRef.current) {
      return false;
    }
    const destinationElement = e.relatedTarget as HTMLElement;
    return navRef.current.contains(destinationElement);
  };

  const onLinkBlur = (
    e: React.FocusEvent<HTMLAnchorElement | HTMLDivElement>,
  ) => {
    // We want to nullify the highlighted element if
    // the destination element of the blur event is not an element inside the menu
    if (!isEventDestinationTargetElementInsideMenu(e)) {
      setHighlightedLinkId(null);
    }
  };

  const handleOnItemMouseIn = (event: React.MouseEvent) => {
    onItemMouseIn?.(event, item);
  };

  const handleOnItemMouseOut = (event: React.MouseEvent) => {
    onItemMouseOut?.(event, item);
  };

  const handleOnItemClick = (event: React.MouseEvent) => {
    onItemClick?.(event, item);
  };

  const handleOnItemDblClick = (event: React.MouseEvent) => {
    onItemDblClick?.(event, item);
  };

  const subItemsExist = item.items && item.items.length > 0;

  const closeSubMenuOnEscape = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      parentMenuItemRef?.current?.focus();
      setHighlightedLinkId(null);
    }
  };

  const renderSubItems = (
    subMenuId: string,
    subItems: Array<VerticalMenuItem>,
  ) => {
    return (
      <ul
        className={classnames(
          style.subMenu,
          subMenuOpenDirection === 'top'
            ? style.menuDirectionTop
            : style.menuDirectionBottom,
          subMenuOpenSide === 'right'
            ? style.menuSideRight
            : style.menuSideLeft,
        )}
        data-testid={TestIds.subMenu(subMenuId)}
        id={TestIds.subMenu(subMenuId)}
      >
        {subItems.map((subItem, idx) => (
          <MenuItem
            key={idx}
            item={subItem}
            uniqueId={`${subMenuId}-${idx}`}
            isSubItem={true}
            navRef={navRef}
            menuItemHeight={menuItemHeight}
            style={style}
            separatedButton={separatedButton}
            subMenuOpenSide={subMenuOpenSide}
            reportBiOnClick={reportBiOnClick}
            onItemClick={onItemClick}
            onItemMouseIn={onItemMouseIn}
            onItemMouseOut={onItemMouseOut}
            onItemDblClick={onItemDblClick}
            highlightedLinkId={highlightedLinkId}
            setHighlightedLinkId={setHighlightedLinkId}
            parentMenuItemRef={itemRef}
          />
        ))}
      </ul>
    );
  };

  return (
    <li
      className={classnames(
        style.item,
        isSubItem
          ? formatClassNames(semanticClassNames.subMenu)
          : formatClassNames(semanticClassNames.menuItem),
      )}
      key={uniqueId}
    >
      <div
        data-testid={TestIds.itemContentWrapper(uniqueId)}
        className={classnames(
          style.itemContentWrapper,
          item.selected && style.selected,
          !isValidLink(item.link) && style.noLink,
          shouldHighlightItem(highlightedLinkId, uniqueId) &&
            style.itemHighlight,
        )}
      >
        <span
          className={style.linkWrapper}
          onMouseEnter={() => setHighlightedLinkId(uniqueId)}
          onFocus={() => setHighlightedLinkId(uniqueId)}
          onMouseUp={safeBlur}
          onKeyUp={e => e.key === 'Enter' && safeBlur()}
          onMouseOut={e =>
            !isEventDestinationTargetElementInsideMenu(e) &&
            setHighlightedLinkId(null)
          }
          onBlur={onLinkBlur}
          onKeyDown={closeSubMenuOnEscape}
        >
          <Link
            dataTestId={TestIds.link(uniqueId)}
            className={classnames(
              style.label,
              formatClassNames(semanticClassNames.menuItemLabel),
            )}
            {...item.link}
            aria-haspopup={subItemsExist ? 'true' : undefined}
            aria-current={item.selected ? 'page' : undefined}
            tabIndex={0}
            onClick={handleOnItemClick}
            onMouseEnter={handleOnItemMouseIn}
            onMouseLeave={handleOnItemMouseOut}
            onDoubleClick={handleOnItemDblClick}
            ref={itemRef}
          >
            {item.label}
            {item.displayCount && (
              <span className={style.displayCount}>({item.displayCount})</span>
            )}
          </Link>
        </span>
        {subItemsExist && renderSubItems(uniqueId, item.items!)}
      </div>
      {separatedButton && <div className={style.separator} />}
    </li>
  );
};

export default MenuItem;
