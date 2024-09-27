import { IWixStyleColor, IWixStyleFont } from '@wix/tpa-settings';

import { DataHook } from './data-hook';
import { InjectedGlobalSettings } from './props';
import {
  BadgeLayout as BadgeLayoutEnum,
  BadgeSize as BadgeSizeEnum,
  ProfileAlignment as ProfileAlignmentEnum,
  ProfileImage,
  ProfileImageSize as ProfileImageSizeEnum,
  ProfileLayout as ProfileLayoutEnum,
  ProfileWidgetHeight as ProfileWidgetHeightEnum,
} from './widget';

export enum NumberStyleParam {
  BadgeLayout = 'badge-layout',
  BadgeSize = 'badge-size',
  BadgeCornerRadius = 'badge-corner-radius',
  ProfileLayout = 'profileLayout',
  PictureStyle = 'pictureStyle',
  ProfileImageSize = 'profileImageSize',
  ProfileAlignment = 'profileAlignment',
  ProfileHeight = 'profileWidgetHeight',
}

export enum ColorStyleParam {
  ResponsiveMemberNameColor = 'pw-responsive-name-color',
}

export enum FontStyleParam {
  BadgeFont = 'badge-font',
}

export enum BooleanStyleParam {
  ShowBadgeBackground = 'show-badge-background',
  ShowCover = 'showCover',
  ShowRoleLabel = 'showRoleLabel',
  ShowMessageButton = 'showMessageButton',
  ShowMessageButtonMobile = 'showMessageButtonMobile',
  ShowFollowButton = 'showFollowButton',
  ShowFollowButtonMobile = 'showFollowButtonMobile',
}

export interface NumberStyleParamMap {
  [NumberStyleParam.BadgeLayout]?: BadgeLayoutEnum;
  [NumberStyleParam.BadgeSize]?: BadgeSizeEnum;
  [NumberStyleParam.BadgeCornerRadius]?: number;
  [NumberStyleParam.ProfileLayout]?: ProfileLayoutEnum;
  [NumberStyleParam.PictureStyle]?: ProfileImage;
  [NumberStyleParam.ProfileAlignment]?: ProfileAlignmentEnum;
  [NumberStyleParam.ProfileImageSize]?: ProfileImageSizeEnum;
  [NumberStyleParam.ProfileHeight]?: ProfileWidgetHeightEnum;
}

export type ColorStyleParamMap = { [key in ColorStyleParam]?: IWixStyleColor };

export type BooleanStyleParamMap = { [key in BooleanStyleParam]?: boolean };

export type FontStyleParamMap = { [key in FontStyleParam]?: IWixStyleFont };

export interface SettingsEvent {
  tabChange: DataHook;
  tabMenuItemChange: DataHook;
  globalSettings: Partial<InjectedGlobalSettings>;
}
