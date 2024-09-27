import * as React from 'react';
import classnames from 'clsx';
import {
  formatClassNames,
  getDataAttributes,
} from '@wix/editor-elements-common-utils';
import Link from '@wix/thunderbolt-elements/src/components/Link/viewer/Link';
import type {
  IVerticalAnchorsMenuItem,
  IVerticalAnchorsMenuProps,
  IVerticalAnchorsMenuStyleProps,
} from '../../VerticalAnchorsMenu.types';
import { ARIA_LABELLED_BY_PREFIX } from '../constants';
import semanticClassNames from '../../VerticalAnchorsMenu.semanticClassNames';

const VerticalAnchorsMenuCommonSkin: React.FC<
  IVerticalAnchorsMenuProps & IVerticalAnchorsMenuStyleProps
> = props => {
  const {
    className,
    customClassNames = [],
    skin,
    style,
    anchors,
    id,
    translations,
    linkContent: LinkContent,
    activeAnchor,
    currentPageHref = './',
    reportBiOnClick,
    onMouseEnter,
    onMouseLeave,
  } = props;

  const _renderAnchor = (anchorItem: IVerticalAnchorsMenuItem, idx: number) => {
    const { name, compId: anchorCompId, dataId: anchorDataId } = anchorItem;
    const ariaLabelledBy = `${ARIA_LABELLED_BY_PREFIX}${anchorCompId}`;
    const isActiveAnchor = activeAnchor?.compId === anchorCompId;
    const ariaCurrentProp = isActiveAnchor ? { 'aria-current': true } : {};
    const onClick = () => reportBiOnClick?.(anchorItem);

    return (
      <li
        key={idx}
        onClick={onClick}
        className={classnames(
          style.listItem,
          formatClassNames(semanticClassNames.menuItem),
        )}
        {...ariaCurrentProp}
      >
        <Link
          className={classnames(style.link, {
            [style.activeAnchor]: isActiveAnchor,
          })}
          href={currentPageHref}
          target="_self"
          anchorCompId={anchorCompId}
          anchorDataId={anchorDataId}
          aria-labelledby={ariaLabelledBy}
          activateByKey={null}
        >
          <LinkContent
            label={name}
            activeAnchor={isActiveAnchor}
            id={ariaLabelledBy}
          />
        </Link>
      </li>
    );
  };

  return (
    <nav
      id={id}
      {...getDataAttributes(props)}
      aria-label={translations.ariaLabel}
      className={classnames(
        style[skin],
        className,
        formatClassNames(semanticClassNames.root, ...customClassNames),
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ul className={style.menuContainer}>
        {anchors &&
          anchors.map((anchorItem, idx) => {
            return _renderAnchor(anchorItem, idx);
          })}
      </ul>
    </nav>
  );
};

export default VerticalAnchorsMenuCommonSkin;
