import defaultTranslations from './constants';

export type FreemiumBannerDesktopTranslation = Record<
  'bannerText' | 'buttonText',
  string | undefined
>;

export const isWixLogoInText = (
  translations: FreemiumBannerDesktopTranslation,
): boolean => {
  return (
    translations.bannerText!.indexOf(defaultTranslations.wixLogoPlaceHolder) >=
    0
  );
};

export const getTextParts = (
  translations: FreemiumBannerDesktopTranslation,
) => {
  let textBeforeLogo = translations.bannerText;

  let textAfterLogo = '';

  if (isWixLogoInText(translations)) {
    const textParts = translations.bannerText!.split(
      defaultTranslations.wixLogoPlaceHolder,
    );
    textBeforeLogo = textParts[0];
    textAfterLogo = textParts[1];
  }

  return {
    textBeforeLogo,
    textAfterLogo,
  };
};
