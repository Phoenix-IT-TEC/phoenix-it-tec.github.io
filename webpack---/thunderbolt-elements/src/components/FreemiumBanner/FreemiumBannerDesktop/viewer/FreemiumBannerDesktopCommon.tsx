import classNamesFn from 'clsx';
import * as React from 'react';
import { getDataAttributes } from '@wix/editor-elements-common-utils';
import Link from '../../../Link/viewer/Link';
import { TestIds } from '../../common/constants';
import type { FreemiumBannerDesktopCommonProps } from '../FreemiumBannerDesktop.types';
import style from './style/FreemiumBannerDesktopCommon.scss';

const defaultDirection = 'ltr';

const FreemiumBannerDesktopCommon: React.FC<
  FreemiumBannerDesktopCommonProps
> = props => {
  const {
    id = 'WIX_ADS',
    useOverlay = false,
    href = '',
    classNames = [defaultDirection],
    className,
    children,
    styles,
    buttonText,
    textBeforeLogo,
    textAfterLogo,
    direction,
  } = props;

  const anchorClassNames = classNamesFn(
    ...classNames.map(name => styles[name]),
    styles.desktopTop,
    'has-custom-focus',
  );

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      className={classNamesFn(className, style.desktop, style.freemiumBanner)}
    >
      {useOverlay ? (
        <div data-testid={TestIds.overlay} className={anchorClassNames} />
      ) : (
        <Link
          className={anchorClassNames}
          href={href}
          target="_blank"
          rel="nofollow"
        >
          <span className={styles.contents}>
            <span data-hook="freemium-text" className={styles.text}>
              {textBeforeLogo}
              {children}
              {textAfterLogo}
            </span>

            <span
              data-hook="freemium-button"
              className={`${styles.button} ${styles[direction]}`}
            >
              {buttonText}
            </span>
          </span>
        </Link>
      )}
    </div>
  );
};

export default FreemiumBannerDesktopCommon;
