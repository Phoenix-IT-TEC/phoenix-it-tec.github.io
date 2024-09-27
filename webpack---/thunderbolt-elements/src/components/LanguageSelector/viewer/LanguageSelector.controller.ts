import { Language as LanguageInfo } from '@wix/thunderbolt-symbols';
import { withCompController } from '@wix/editor-elements-integrations';
import { utils } from '@wix/santa-multilingual/dist/languages';
import type {
  ILanguageSelectorMapperProps,
  ILanguageSelectorControllerProps,
  ILanguageSelectorWithPreviewProps,
  ILanguageSelectorStateValues,
  ItemFormat,
  DisplayMode,
  Language,
  IconType,
  IItem,
  Items,
} from '../LanguageSelector.types';

const filterSiteLanguages = (
  siteLanguages?: Array<LanguageInfo>,
  componentViewMode?: string,
) => {
  const validSiteLanguages = Object.values(siteLanguages || {}).filter(
    lang => lang.languageCode && lang.languageCode !== '',
  );

  if (
    !validSiteLanguages.length ||
    (componentViewMode !== 'editor' && validSiteLanguages.length <= 1)
  ) {
    return null;
  }

  if (componentViewMode === 'preview') {
    return validSiteLanguages.filter(
      language => language.status === 'Active' || language.isPrimaryLanguage,
    );
  }

  return validSiteLanguages;
};

const getDisableReason = (
  currentLanguage: LanguageInfo,
  filteredLanguages: Array<LanguageInfo>,
  componentViewMode?: string,
) => {
  if (componentViewMode !== 'preview') {
    return null;
  }
  if (currentLanguage.status === 'Inactive') {
    return 'current-language';
  }
  return filteredLanguages.length === 1 ? 'all-languages' : null;
};

const getFlagProps = (
  flagsUrl: string,
  countryCode: string,
  iconType?: IconType,
) => {
  if (iconType && iconType !== 'none') {
    return {
      flag: utils.getFlagIconPng(flagsUrl, iconType, countryCode),
      flagSrcSet: utils.getFlagIconSrcSet(flagsUrl, iconType, countryCode),
    };
  }

  return {};
};

const calculateItemText = (
  language: LanguageInfo,
  itemFormat: ItemFormat,
  displayMode: DisplayMode,
  isMobile: boolean,
) => {
  if (itemFormat === 'shortName') {
    return language.languageCode.toUpperCase();
  } else if (itemFormat === 'fullName') {
    return language.name;
  } else if (itemFormat === 'fullLocalizedName') {
    return language.localizedName;
  } else if (
    itemFormat === 'iconOnly' &&
    displayMode !== 'horizontal' &&
    isMobile
  ) {
    return language.name;
  }
  return undefined;
};

const sortByLanguagesOrder = (
  items: Items,
  languagesOrder: ILanguageSelectorMapperProps['languagesOrder'],
) => {
  items.sort(
    (item1, item2) =>
      languagesOrder.indexOf(item1.value) - languagesOrder.indexOf(item2.value),
  );
};

const moveMainLanguageToTop = (items: Items, originalLanguageCode: string) => {
  items.unshift(
    items.splice(
      items.findIndex(({ value }) => value === originalLanguageCode),
      1,
    )[0],
  );
};

export default withCompController<
  ILanguageSelectorMapperProps,
  ILanguageSelectorControllerProps,
  ILanguageSelectorWithPreviewProps,
  ILanguageSelectorStateValues
>(({ mapperProps, controllerUtils, stateValues }) => {
  const {
    iconType,
    itemFormat,
    displayModeProp,
    isMobile,
    languagesOrder,
    componentViewMode,
    ...restProps
  } = mapperProps;
  const {
    siteLanguages,
    flagsUrl,
    currentLanguage,
    originalLanguageCode,
    setCurrentLanguage,
  } = stateValues;

  const returnProps: ILanguageSelectorControllerProps = {
    ...restProps,
    onChange: setCurrentLanguage,
    setIsOpen: isOpen => {
      controllerUtils.updateProps({
        isOpen,
      });
    },
  };

  const filteredLanguages = filterSiteLanguages(
    siteLanguages,
    componentViewMode,
  );

  if (!filteredLanguages || !filteredLanguages.length) {
    return returnProps;
  }

  const getItem = (language: LanguageInfo): IItem => {
    const flagProps = getFlagProps(flagsUrl, language.countryCode, iconType);

    return {
      ...flagProps,
      text: calculateItemText(language, itemFormat, displayModeProp, isMobile),
      value: language.languageCode as Language,
      selected: language.languageCode === currentLanguage.languageCode,
      label: language.name,
    };
  };

  const items = filteredLanguages.map(getItem);

  if (languagesOrder.length) {
    sortByLanguagesOrder(items, languagesOrder);
  } else {
    moveMainLanguageToTop(items, originalLanguageCode);
  }

  return {
    ...returnProps,
    items,
    disabledReason: getDisableReason(
      currentLanguage,
      filteredLanguages,
      componentViewMode,
    ),
  };
});
