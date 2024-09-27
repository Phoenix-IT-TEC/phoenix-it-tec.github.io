import { RoleId } from '@wix/members-domain-ts';

import { Nullable } from './util';
import { Orientation } from './positioning';

export enum Origin {
  Profile = 'profile',
  EditorSettingsBadges = 'editor_settings_badges',
}

type BIBoolean = 0 | 1;

export enum ProfileImageLayoutBi {
  None = 'none',
  Round = 'oval',
  Square = 'square',
}

export enum ProfileImageSizeBi {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum ProfileAlignmentBi {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

export enum BadgeLayoutBi {
  NameAndIcon = 'Name & Icon',
  IconOnly = 'Icon Only',
  NameOnly = 'Name Only',
}

export enum BadgeSizeBi {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum DisplayTogglesNameBi {
  ShowMessage = 'Show message button',
  ShowFollowCTA = 'Show follow button',
  ShowFF = 'Show following counters',
  ShowCover = 'Show cover',
  ShowRoleLabel = 'Show role label',
  ShowTitle = 'Show title',
}

export type CommonBIEvent = {
  app_id: string;
  biToken: string;
  instance_id: string;
  is_social: BIBoolean;
  role: string;
  _: number;
};

export type AuthorEditedBIEvent = CommonBIEvent & {
  author_id: string;
  author_role: string;
  cover_changed: BIBoolean;
  has_cover: BIBoolean;
  has_picture: BIBoolean;
  new_author_name: string;
  new_author_title: Nullable<string>;
  origin: 'members area profile';
  was_name_changed: BIBoolean;
  was_picture_changed: BIBoolean;
};

export enum ProfileActionType {
  EDIT_PROFILE = 'edit_profile_3_dots',
  SHARE_PROFILE = 'share_profile_3_dots',
  VIEW_PUBLIC_PROFILE = 'view_public_profile',
  EXIT_VIEW_PUBLIC_PROFILE = 'exit_preview_public_profile',
}

export type BlockActions = 'block' | 'block_confirm';

export type RoleActionClickedBIEvent = CommonBIEvent & {
  member_chosen?: string;
  action_type: RoleId | ProfileActionType | BlockActions;
  site_member_id?: string;
  formOrigin?: string;
};

export type FollowOrUnFollowBIEvent = CommonBIEvent & {
  is_followed: BIBoolean;
  member_followed: string;
  origin: Origin;
};

export type AppLoadedBIEvent = CommonBIEvent & {
  origin: Origin;
  page_name: Origin;
  widget_name: Origin;
  widget_id: string;
  member_id?: string;
  currentPageId?: string;
};

export type ProfileChangedBIEvent = CommonBIEvent & {
  photo_changed: BIBoolean;
  name_changed: BIBoolean;
  cover_photo_change: BIBoolean;
  titleChanged: BIBoolean;
};

export type MembersChatOpenedBIEvent = CommonBIEvent & {
  origin: Origin;
  messaged_member_id: string;
};

export type ProfileLayoutChangedBIEvent = CommonBIEvent & {
  layoutType: Orientation;
};

export type ProfileDesignEditedBIEvent = CommonBIEvent & {
  colorChanged?: BIBoolean;
  coverChanged?: BIBoolean;
};

export type ShowFFToggleBIEvent = CommonBIEvent & {
  origin: Origin;
};

export type AppSettingsLoadedBIEvent = CommonBIEvent & {
  origin: Origin;
  settings_changed: 0;
};

export type ProfileImageLayoutChangedBIEvent = CommonBIEvent & {
  layoutType: ProfileImageLayoutBi;
};

export type ProfileImageSizeChangedBIEvent = CommonBIEvent & {
  size: ProfileImageSizeBi;
};

export type ProfileCoverSizeChangedBIEvent = CommonBIEvent & {
  size: ProfileImageSizeBi;
};

export type ProfileCardAlignmentChangedBIEvent = CommonBIEvent & {
  alignment: ProfileAlignmentBi;
};

export type ProfileCardDisplayTogglesBIEvent = CommonBIEvent & {
  layoutType: Orientation;
  toggleName: DisplayTogglesNameBi;
  toggleState: boolean;
};

export type ManageBadgesClickBIEvent = CommonBIEvent & {
  origin: Origin;
  formOrigin: Origin;
};

export type BadgesLayoutChangeBIEvent = CommonBIEvent & {
  size: BadgeSizeBi;
  layout: BadgeLayoutBi;
};
