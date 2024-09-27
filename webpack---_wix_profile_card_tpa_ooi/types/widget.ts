import { BaseComponentProps } from './props';
import { VoidHandler } from './util';

export enum ProfileLayout {
  Card,
  FullWidth,
}

export enum ProfileImage {
  Round,
  Square,
  None,
}

export enum ProfileAlignment {
  Left,
  Center,
  Right,
}

export enum ProfileImageSize {
  Small,
  Medium,
  Large,
}

export enum ProfileImageDimensions {
  Small = 70,
  Medium = 110,
  Large = 150,
}

export enum ProfileImageDimensionsInCard {
  Small = 50,
  Medium = 90,
  Large = 150,
}

export enum BadgeLayout {
  NameAndIcon,
  IconOnly,
  NameOnly,
}

export enum BadgeSize {
  Small,
  Medium,
  Large,
}

export enum ProfileWidgetHeight {
  Small = 250,
  Medium = 340,
  Large = 430,
}

export enum IFrameEvent {
  SetViewedMember = 'members/SET_MEMBERS',
  SetGlobalSettings = 'MERGE_GLOBAL_SETTING_IN_STORE',
  FollowInState = 'members/FOLLOW_IN_STATE',
  UnfollowInState = 'members/UNFOLLOW_IN_STATE',
  EnterPublicProfilePreview = 'aboutPage/ENTER_PUBLIC_PROFILE_PREVIEW',
  LeavePublicProfilePreview = 'aboutPage/LEAVE_PUBLIC_PROFILE_PREVIEW',
  SetMemberAsBlocked = 'aboutPage/SET_MEMBER_AS_BLOCKED',
}

enum BadgesAlignment {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

type ProfileImageSizeMap<T> = { [key in ProfileImageSize]: T };

type ProfileImageDimensionsMap<T, K> = {
  [ProfileLayout.Card]: ProfileImageSizeMap<T>;
  [ProfileLayout.FullWidth]: ProfileImageSizeMap<K>;
};

export const badgesAlignmentMap: Record<ProfileAlignment, BadgesAlignment> = {
  [ProfileAlignment.Left]: BadgesAlignment.Left,
  [ProfileAlignment.Center]: BadgesAlignment.Center,
  [ProfileAlignment.Right]: BadgesAlignment.Right,
};

export const profileImageDimensionsMap: ProfileImageDimensionsMap<
  ProfileImageDimensionsInCard,
  ProfileImageDimensions
> = {
  [ProfileLayout.Card]: {
    [ProfileImageSize.Small]: ProfileImageDimensionsInCard.Small,
    [ProfileImageSize.Medium]: ProfileImageDimensionsInCard.Medium,
    [ProfileImageSize.Large]: ProfileImageDimensionsInCard.Large,
  },
  [ProfileLayout.FullWidth]: {
    [ProfileImageSize.Small]: ProfileImageDimensions.Small,
    [ProfileImageSize.Medium]: ProfileImageDimensions.Medium,
    [ProfileImageSize.Large]: ProfileImageDimensions.Large,
  },
};

export interface SignUpProps
  extends Pick<BaseComponentProps, 'isMobile' | 't'> {
  onClick: VoidHandler;
}
