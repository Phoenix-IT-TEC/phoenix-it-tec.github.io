import {
  IStyleParam,
  IStyleParams,
  StyleParamType,
  wixColorParam,
  wixFontParam,
} from '@wix/tpa-settings';
import { CustomCssVarsFn } from '@wix/yoshi-flow-editor';

import {
  BadgeLayout,
  BadgeSize,
  ProfileAlignment,
  ProfileImage,
  profileImageDimensionsMap,
  ProfileImageSize,
  ProfileLayout,
  ProfileWidgetHeight,
} from '../../types';

export type ComponentStylesParams = IStyleParams<{
  showCover: IStyleParam<StyleParamType.Boolean>;
  showMessageButton: IStyleParam<StyleParamType.Boolean>;
  showMessageButtonMobile: IStyleParam<StyleParamType.Boolean>;
  profileLayout: IStyleParam<StyleParamType.Number>;
  profileImageLayout: IStyleParam<StyleParamType.Number>;
  profileImageSize: IStyleParam<StyleParamType.Number>;
  profileAlignment: IStyleParam<StyleParamType.Number>;
  badgeLayout: IStyleParam<StyleParamType.Number>;
  badgeSize: IStyleParam<StyleParamType.Number>;
  badgeCornerRadius: IStyleParam<StyleParamType.Number>;
  badgeFont: IStyleParam<StyleParamType.Font>;
  showBadgeBackground: IStyleParam<StyleParamType.Boolean>;
  textPrimaryColor: IStyleParam<StyleParamType.Color>;
  textPrimaryFont: IStyleParam<StyleParamType.Font>;
  textSecondaryColor: IStyleParam<StyleParamType.Color>;
  textSecondaryFont: IStyleParam<StyleParamType.Font>;
  memberNameResponsiveColor: IStyleParam<StyleParamType.Color>;
  memberNameResponsiveFont: IStyleParam<StyleParamType.Font>;
  memberNameMobileColor: IStyleParam<StyleParamType.Color>;
  memberNameMobileFont: IStyleParam<StyleParamType.Font>;
  titleFont: IStyleParam<StyleParamType.Font>;
  titleColor: IStyleParam<StyleParamType.Color>;
  titleResponsiveFont: IStyleParam<StyleParamType.Font>;
  titleResponsiveColor: IStyleParam<StyleParamType.Color>;
  titleMobileFont: IStyleParam<StyleParamType.Font>;
  titleMobileColor: IStyleParam<StyleParamType.Color>;
  ffTextResponsiveColor: IStyleParam<StyleParamType.Color>;
  ffTextResponsiveFont: IStyleParam<StyleParamType.Font>;
  ffTextMobileColor: IStyleParam<StyleParamType.Color>;
  ffTextMobileFont: IStyleParam<StyleParamType.Font>;
  buttonColor: IStyleParam<StyleParamType.Color>;
  buttonResponsiveColor: IStyleParam<StyleParamType.Color>;
  buttonMobileColor: IStyleParam<StyleParamType.Color>;
  buttonFont: IStyleParam<StyleParamType.Font>;
  buttonResponsiveFont: IStyleParam<StyleParamType.Font>;
  buttonMobileFont: IStyleParam<StyleParamType.Font>;
  boxColor: IStyleParam<StyleParamType.Color>;
  boxBorderWidth: IStyleParam<StyleParamType.Number>;
  boxBorderColor: IStyleParam<StyleParamType.Color>;
  coverColor: IStyleParam<StyleParamType.Color>;
  coverMobileColor: IStyleParam<StyleParamType.Color>;
  coverPhotoOpacity: IStyleParam<StyleParamType.Number>;
  coverPhotoOpacityDesktop: IStyleParam<StyleParamType.Number>;
  profileWidgetHeight: IStyleParam<StyleParamType.Number>;
  buttonFontColor: IStyleParam<StyleParamType.Color>;
  buttonResponsiveFontColor: IStyleParam<StyleParamType.Color>;
  buttonBorderColor: IStyleParam<StyleParamType.Color>;
  buttonResponsiveBorderColor: IStyleParam<StyleParamType.Color>;
  buttonBorderWidth: IStyleParam<StyleParamType.Number>;
  buttonResponsiveBorderWidth: IStyleParam<StyleParamType.Number>;
  buttonTextFontSizeMobile: IStyleParam<StyleParamType.Number>;
  coverColorDesktop: IStyleParam<StyleParamType.Color>;
  buttonCornerRadius: IStyleParam<StyleParamType.Number>;
  buttonResponsiveCornerRadius: IStyleParam<StyleParamType.Number>;
  verticalWidgetCornerRadius: IStyleParam<StyleParamType.Number>;
}>;

export const defaultButtonColor = 'color-8';

export const defaultProfileLayout = ProfileLayout.Card;

export const defaultProfileImageLayout = ProfileImage.Round;

export const defaultProfileAlignment = ProfileAlignment.Left;

export const defaultProfileImageSize = ProfileImageSize.Medium;

export const defaultBadgeLayout = BadgeLayout.NameAndIcon;

export const defaultBadgeSize = BadgeSize.Small;

export const defaultProfileWidgetHeight = ProfileWidgetHeight.Small;

export const defaultBadgeFontTextPreset = 'Body-M';

const defaultBadgeCornerRadius = 10;

const stylesParams: ComponentStylesParams = {
  showCover: {
    type: StyleParamType.Boolean,
    key: 'showCover',
    getDefaultValue: () => false,
  },
  showMessageButton: {
    type: StyleParamType.Boolean,
    key: 'showMessageButton',
    dangerousKeyTransformationOverride: () => 'showMessageButton',
    getDefaultValue: () => true,
  },
  showMessageButtonMobile: {
    type: StyleParamType.Boolean,
    key: 'showMessageButtonMobile',
    dangerousKeyTransformationOverride: () => 'showMessageButtonMobile',
    getDefaultValue: () => true,
  },
  profileLayout: {
    type: StyleParamType.Number,
    key: 'profileLayout',
    getDefaultValue: () => defaultProfileLayout,
  },
  profileImageLayout: {
    type: StyleParamType.Number,
    key: 'pictureStyle',
    getDefaultValue: () => defaultProfileImageLayout,
  },
  profileAlignment: {
    type: StyleParamType.Number,
    key: 'profileAlignment',
    getDefaultValue: () => defaultProfileAlignment,
  },
  profileImageSize: {
    type: StyleParamType.Number,
    key: 'profileImageSize',
    getDefaultValue: () => defaultProfileImageSize,
  },
  badgeLayout: {
    type: StyleParamType.Number,
    key: 'badge-layout',
    getDefaultValue: () => defaultBadgeLayout,
  },
  badgeSize: {
    type: StyleParamType.Number,
    key: 'badge-size',
    getDefaultValue: () => defaultBadgeLayout,
  },
  badgeCornerRadius: {
    type: StyleParamType.Number,
    key: 'badge-corner-radius',
    getDefaultValue: () => defaultBadgeCornerRadius,
  },
  badgeFont: {
    type: StyleParamType.Font,
    key: 'badge-font',
    getDefaultValue: wixFontParam(defaultBadgeFontTextPreset),
  },
  showBadgeBackground: {
    type: StyleParamType.Boolean,
    key: 'show-badge-background',
    getDefaultValue: () => true,
  },
  textPrimaryColor: {
    type: StyleParamType.Color,
    key: 'text-color-primary',
    getDefaultValue: wixColorParam('color-5'),
  },
  textPrimaryFont: {
    type: StyleParamType.Font,
    key: 'text-primary-font',
    getDefaultValue: wixFontParam('Body-M', { size: 20 }),
  },
  textSecondaryColor: {
    type: StyleParamType.Color,
    key: 'text-color-secondary',
    getDefaultValue: wixColorParam('color-5'),
  },
  textSecondaryFont: {
    type: StyleParamType.Font,
    key: 'text-secondary-font',
    getDefaultValue: wixFontParam('Body-M', { size: 14 }),
  },
  memberNameResponsiveColor: {
    type: StyleParamType.Color,
    key: 'pw-responsive-name-color',
    getDefaultValue: wixColorParam('color-1'),
  },
  memberNameResponsiveFont: {
    type: StyleParamType.Font,
    key: 'pw-responsive-name-font',
    getDefaultValue: wixFontParam('Body-M', { size: 28 }),
  },
  memberNameMobileColor: {
    type: StyleParamType.Color,
    key: 'pw-name-color-mobile',
    dangerousKeyTransformationOverride: () => 'pw-name-color-mobile',
    getDefaultValue: wixColorParam('color-5'),
  },
  memberNameMobileFont: {
    type: StyleParamType.Font,
    key: 'pw-name-font-mobile',
    dangerousKeyTransformationOverride: () => 'pw-name-font-mobile',
    getDefaultValue: wixFontParam('Body-M', { size: 20 }),
  },
  titleFont: {
    type: StyleParamType.Font,
    key: 'title-font',
    getDefaultValue: wixFontParam('Body-M', { size: 14 }),
  },
  titleColor: {
    type: StyleParamType.Color,
    key: 'title-color',
    getDefaultValue: wixColorParam('color-5'),
  },
  titleResponsiveFont: {
    type: StyleParamType.Font,
    key: 'title-responsive-font',
    getDefaultValue: wixFontParam('Body-M', { size: 20 }),
  },
  titleResponsiveColor: {
    type: StyleParamType.Color,
    key: 'title-responsive-color',
    getDefaultValue: wixColorParam('color-1'),
  },
  titleMobileFont: {
    type: StyleParamType.Font,
    key: 'title-mobile-font',
    dangerousKeyTransformationOverride: () => 'title-mobile-font',
    getDefaultValue: wixFontParam('Body-M', { size: 16 }),
  },
  titleMobileColor: {
    type: StyleParamType.Color,
    key: 'title-mobile-color',
    dangerousKeyTransformationOverride: () => 'title-mobile-color',
    getDefaultValue: wixColorParam('color-5'),
  },
  ffTextResponsiveColor: {
    type: StyleParamType.Color,
    key: 'pw-responsive-ff-color',
    getDefaultValue: wixColorParam('color-1'),
  },
  ffTextResponsiveFont: {
    type: StyleParamType.Font,
    key: 'pw-responsive-ff-font',
    getDefaultValue: wixFontParam('Body-M', { size: 16 }),
  },
  ffTextMobileColor: {
    type: StyleParamType.Color,
    key: 'pw-ff-color-mobile',
    dangerousKeyTransformationOverride: () => 'pw-ff-color-mobile',
    getDefaultValue: wixColorParam('color-5'),
  },
  ffTextMobileFont: {
    type: StyleParamType.Font,
    key: 'pw-ff-font-mobile',
    dangerousKeyTransformationOverride: () => 'pw-ff-font-mobile',
    getDefaultValue: wixFontParam('Body-M', { size: 12 }),
  },
  buttonColor: {
    type: StyleParamType.Color,
    key: 'button-opacity-and-color',
    getDefaultValue: wixColorParam(defaultButtonColor),
  },
  buttonResponsiveColor: {
    type: StyleParamType.Color,
    key: 'pw-responsive-button-color',
    getDefaultValue: wixColorParam('color-1'),
  },
  buttonMobileColor: {
    type: StyleParamType.Color,
    key: 'pw-responsive-button-color-mobile',
    dangerousKeyTransformationOverride: () => {
      return 'pw-responsive-button-color-mobile';
    },
    getDefaultValue: wixColorParam('color-1'),
  },
  buttonFont: {
    type: StyleParamType.Font,
    key: 'button-font',
    getDefaultValue: wixFontParam('Body-M', { size: 16 }),
  },
  buttonResponsiveFont: {
    type: StyleParamType.Font,
    key: 'pw-responsive-button-font',
    getDefaultValue: wixFontParam('Body-M', { size: 16 }),
  },
  buttonMobileFont: {
    type: StyleParamType.Font,
    key: 'pw-button-font-mobile',
    dangerousKeyTransformationOverride: () => 'pw-button-font-mobile',
    getDefaultValue: wixFontParam('Body-M', { size: 16 }),
  },
  boxColor: {
    type: StyleParamType.Color,
    key: 'box-color',
    dangerousKeyTransformationOverride: () => 'box-color',
    getDefaultValue: wixColorParam('color-1'),
  },
  boxBorderWidth: {
    type: StyleParamType.Number,
    key: 'border-width-1',
    dangerousKeyTransformationOverride: () => 'border-width-1',
    getDefaultValue: () => 1,
  },
  boxBorderColor: {
    type: StyleParamType.Color,
    key: 'border-color',
    dangerousKeyTransformationOverride: () => 'border-color',
    getDefaultValue: wixColorParam('color-5', 0.2),
  },
  coverColor: {
    type: StyleParamType.Color,
    key: 'pw-cover-color',
    getDefaultValue: wixColorParam('color-8'),
  },
  coverColorDesktop: {
    type: StyleParamType.Color,
    key: 'pw-cover-color-desktop',
    dangerousKeyTransformationOverride: () => 'pw-cover-color-desktop',
    getDefaultValue: ({ getStyleParamValue }) => {
      return (
        getStyleParamValue(stylesParams.coverColor) ?? wixColorParam('color-8')
      );
    },
  },
  coverMobileColor: {
    type: StyleParamType.Color,
    key: 'pw-cover-color-mobile',
    dangerousKeyTransformationOverride: () => 'pw-cover-color-mobile',
    getDefaultValue: ({ getStyleParamValue }) => {
      return (
        getStyleParamValue(stylesParams.coverColorDesktop) ??
        wixColorParam('color-8')
      );
    },
  },
  coverPhotoOpacity: {
    type: StyleParamType.Number,
    key: 'pw-cover-photo-opacity',
    getDefaultValue: () => 60,
  },
  coverPhotoOpacityDesktop: {
    type: StyleParamType.Number,
    key: 'pw-cover-photo-opacity-desktop',
    getDefaultValue: ({ getStyleParamValue }) => {
      const coverPhotoOpacity = getStyleParamValue(
        stylesParams.coverPhotoOpacity,
      );
      return coverPhotoOpacity === undefined ? 60 : coverPhotoOpacity;
    },
    dangerousKeyTransformationOverride: () => 'pw-cover-photo-opacity-desktop',
  },
  profileWidgetHeight: {
    type: StyleParamType.Number,
    key: 'profileWidgetHeight',
    getDefaultValue: () => defaultProfileWidgetHeight,
  },
  buttonFontColor: {
    type: StyleParamType.Color,
    key: 'pw-button-font-color',
    getDefaultValue: wixColorParam('color-1'),
  },
  buttonResponsiveFontColor: {
    type: StyleParamType.Color,
    key: 'pw-button-responsive-font-color',
    getDefaultValue: wixColorParam('color-8'),
  },
  buttonBorderColor: {
    type: StyleParamType.Color,
    key: 'pw-button-border-color',
    getDefaultValue: ({ getStyleParamValue }) =>
      getStyleParamValue(stylesParams.buttonColor) ??
      wixColorParam(defaultButtonColor),
  },
  buttonResponsiveBorderColor: {
    type: StyleParamType.Color,
    key: 'pw-button-responsive-border-color',
    getDefaultValue: ({ getStyleParamValue }) =>
      getStyleParamValue(stylesParams.buttonResponsiveColor) ??
      wixColorParam(defaultButtonColor),
  },
  buttonBorderWidth: {
    type: StyleParamType.Number,
    key: 'pw-button-border-width',
    getDefaultValue: () => 1,
  },
  buttonResponsiveBorderWidth: {
    type: StyleParamType.Number,
    key: 'pw-button-responsive-border-width',
    getDefaultValue: () => 1,
  },
  buttonTextFontSizeMobile: {
    type: StyleParamType.Number,
    key: 'pw-button-text-font-size-mobile',
    dangerousKeyTransformationOverride: () => 'pw-button-text-font-size-mobile',
    getDefaultValue: ({ getStyleParamValue }) => {
      return (
        getStyleParamValue(stylesParams.buttonMobileFont as any)?.size || 16
      );
    },
  },
  buttonCornerRadius: {
    key: 'pw-button-corner-radius',
    type: StyleParamType.Number,
    getDefaultValue: () => 0,
  },
  buttonResponsiveCornerRadius: {
    key: 'pw-button-responsive-corner-radius',
    type: StyleParamType.Number,
    getDefaultValue: () => 0,
  },
  verticalWidgetCornerRadius: {
    key: 'vertical-pw-corner-radius',
    type: StyleParamType.Number,
    getDefaultValue: () => 0,
  },
};

export default stylesParams;

export const customCssVars: CustomCssVarsFn = ({ styleParams }) => {
  const { numbers } = styleParams;

  const profileLayout = numbers.profileLayout as ProfileLayout;
  const profileImageSize = numbers.profileImageSize as ProfileImageSize;
  const profileImageSizeInLayout =
    profileImageDimensionsMap[profileLayout][profileImageSize];

  return {
    profileWidgetHeight: `${numbers.profileWidgetHeight}px`,
    profileImageSize: `${profileImageSizeInLayout}px`,
  };
};
