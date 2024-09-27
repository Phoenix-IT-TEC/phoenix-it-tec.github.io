import * as React from 'react';
import { WixLogo } from '../../common/assets/logos';
import type { FreemiumBannerDesktopProps } from '../FreemiumBannerDesktop.types';
import style from './style/FreemiumBannerDesktop.scss';
import { TestIds } from '../../common/constants';
import { getTextParts, isWixLogoInText } from './utils';
import FreemiumBannerDesktopCommon from './FreemiumBannerDesktopCommon';

const FreemiumBannerDesktop: React.FC<FreemiumBannerDesktopProps> = props => {
  const { translations, direction } = props;

  const { textBeforeLogo, textAfterLogo } = getTextParts(translations);

  return (
    <FreemiumBannerDesktopCommon
      {...props}
      styles={style}
      buttonText={translations.buttonText}
      textBeforeLogo={textBeforeLogo}
      textAfterLogo={textAfterLogo}
      direction={direction}
      className={style.root}
    >
      {isWixLogoInText(translations) && (
        <div data-testid={TestIds.logo} className={style.wixLogoWrapper}>
          <div>
            <WixLogo rootClass={style.wixLogo} dotClass={style.dot} />
          </div>
          <div className={style.com}>.com</div>
        </div>
      )}
    </FreemiumBannerDesktopCommon>
  );
};
export default FreemiumBannerDesktop;
