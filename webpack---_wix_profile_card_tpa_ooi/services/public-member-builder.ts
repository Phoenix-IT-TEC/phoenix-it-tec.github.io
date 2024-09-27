import {
  PrivacyStatus,
  RoleAction,
  RoleId,
  MediaPlatformImage,
} from '@wix/members-domain-ts';

import { Builder, Nullable, PublicMember, WixUserStats } from '../types';

const defaultUserStats: WixUserStats = {
  comments: 0,
  topComments: 0,
  likesReceived: 0,
};

class PublicMemberBuilder implements Builder<PublicMember> {
  private _id: string = '';
  private uid: string = '';
  private slug: string = '';
  private name: string = '';
  private picture: Nullable<string | MediaPlatformImage> = null;
  private cover: Nullable<string | MediaPlatformImage> = null;
  private isOwner: boolean = false;
  private roles: RoleId[] = [];
  private badges: string[] = [];
  private stats: WixUserStats = { ...defaultUserStats };
  private rolesActions: RoleAction[] = [];
  private privacyStatus: PrivacyStatus = PrivacyStatus.Public;
  private followerCount: number = 0;
  private followingCount: number = 0;
  private isSubscribed: boolean = false;
  private createdDate: string = '';

  build = () => {
    const member: PublicMember = {
      _id: this._id,
      uid: this.uid,
      name: this.name,
      picture: this.picture,
      cover: this.cover,
      isOwner: this.isOwner,
      roles: this.roles,
      badges: this.badges,
      stats: this.stats,
      rolesActions: this.rolesActions,
      privacyStatus: this.privacyStatus,
      followerCount: this.followerCount,
      followingCount: this.followingCount,
      isSubscribed: this.isSubscribed,
      slug: this.slug,
      createdDate: this.createdDate,
    };

    return member;
  };

  withId = (_id: string) => {
    this._id = _id;
    return this;
  };

  withUid = (uid: string) => {
    this.uid = uid;
    return this;
  };

  withSlug = (slug: string) => {
    this.slug = slug;
    return this;
  };

  withName = (name: string) => {
    this.name = name;
    return this;
  };

  withPicture = (picture: Nullable<string | MediaPlatformImage>) => {
    this.picture = picture;
    return this;
  };

  withCover = (cover: Nullable<MediaPlatformImage | string>) => {
    this.cover = cover;
    return this;
  };

  withIsOwner = (isOwner: boolean) => {
    this.isOwner = isOwner;
    return this;
  };

  withRoles = (roles: RoleId[]) => {
    this.roles = roles;
    return this;
  };

  withBadges = (badges: string[]) => {
    this.badges = badges;
    return this;
  };

  withStats = (stats: WixUserStats) => {
    this.stats = stats;
    return this;
  };

  withRolesActions = (rolesActions: RoleAction[]) => {
    this.rolesActions = rolesActions;
    return this;
  };

  withPrivacyStatus = (privacyStatus: PrivacyStatus) => {
    this.privacyStatus = privacyStatus;
    return this;
  };

  withFollowerCount = (followerCount: number) => {
    this.followerCount = followerCount;
    return this;
  };

  withFollowingCount = (followingCount: number) => {
    this.followingCount = followingCount;
    return this;
  };

  withIsSubscribed = (isSubscribed: boolean) => {
    this.isSubscribed = isSubscribed;
    return this;
  };

  withCreatedDate = (createdDate: string) => {
    this.createdDate = createdDate;
    return this;
  };
}

export default PublicMemberBuilder;
