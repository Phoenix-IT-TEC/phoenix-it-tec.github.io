import {
  MediaPlatformImage,
  PrivacyStatus,
  RoleId,
} from '@wix/members-domain-ts';
import { assignRole, unassignRole } from '@wix/ambassador-members-v1-role/http';
import { updateMember } from '@wix/ambassador-members-v1-member/http';
import {
  followMember,
  unfollowMember,
} from '@wix/ambassador-members-v3-follow/http';

import {
  InjectedSite,
  PartialUpdatableFields,
  PublicMember,
  PublicMemberInfoUpdateOptions,
  RolesMap,
} from '../../types';
import { HttpClient } from '../../types/controller';

type InstalledAppsMap = InjectedSite['installedApps'];

type SocialChatResponse = { isSocialChat: boolean };

interface ApplyRoleActionOptions {
  uid: string;
  roles: RoleId[];
  roleId: RoleId;
}

interface MediaCredentialsResponse {
  uploadToken: string;
  uploadUrl: string;
}

export class MembersService {
  constructor(
    private readonly baseUrl: string,
    private readonly httpClient: HttpClient,
  ) {}

  readonly getMember = async (uid: string) => {
    const { data } = await this.httpClient.get<PublicMember>(
      `${this.baseUrl}/members/${uid}`,
    );

    return data;
  };

  readonly partialMemberUpdate = async (
    uid: string,
    updatedFields: PartialUpdatableFields,
  ) => {
    const { data } = await this.httpClient.patch<PublicMember>(
      `${this.baseUrl}/members/${uid}`,
      updatedFields,
    );

    return data;
  };

  readonly setCurrentMemberPrivacyStatus = async (
    privacyStatus: PrivacyStatus,
  ) => {
    const { data } = await this.httpClient.put<PrivacyStatus>(
      `${this.baseUrl}/members/me/privacy-status`,
      { privacyStatus },
    );

    return data;
  };

  readonly setMemberBadges = async (uid: string, badgeIds: string[]) => {
    const { data } = await this.httpClient.post(
      `${this.baseUrl}/members/${uid}/badges`,
      { badgeIds },
    );

    return data;
  };

  readonly deleteMember = async (uid: string) => {
    const { data } = await this.httpClient.delete(
      `${this.baseUrl}/members/${uid}`,
    );

    return data;
  };

  readonly applyRoleAction = async ({
    uid,
    roleId,
    roles,
  }: ApplyRoleActionOptions) => {
    if (roles.includes(roleId)) {
      await this.httpClient.request(
        unassignRole({ memberId: uid, roleKey: roleId.toUpperCase() }),
      );
    } else {
      await this.httpClient.request(
        assignRole({ memberId: uid, roleKey: roleId.toUpperCase() }),
      );
    }
  };

  readonly getRolesMap = async () => {
    const { data } = await this.httpClient.get<RolesMap>(
      `${this.baseUrl}/members/rolesmap`,
    );

    return data;
  };

  readonly getInstalledApps = async () => {
    const url = `${this.baseUrl}/site/installed-apps`;
    const { data } = await this.httpClient.get<InstalledAppsMap>(url);

    return data;
  };

  readonly getIsSocialChat = async () => {
    const url = `${this.baseUrl}/site/social-chat`;
    const { data } = await this.httpClient.get<SocialChatResponse>(url);

    return data.isSocialChat;
  };

  readonly toggleMemberFollowStatus = async (
    uid: string,
    isSubscribed: boolean,
  ) => {
    if (isSubscribed) {
      const { data } = await this.httpClient.request(
        unfollowMember({ memberId: uid }),
      );

      return data;
    }

    const { data } = await this.httpClient.request(
      followMember({ memberId: uid }),
    );

    return data;
  };

  readonly updateMemberPublicInfo = async (
    memberData: PublicMemberInfoUpdateOptions,
  ) => {
    const { data } = await this.httpClient.request(
      updateMember({
        member: memberData,
      }),
    );

    return data;
  };

  readonly getMediaPlatformCredentials = async () => {
    const url = `${this.baseUrl}/media/credentials/picture`;
    const { data } = await this.httpClient.get<MediaCredentialsResponse>(url);

    return data;
  };

  readonly setMediaPlatformPictureDetails = async (
    picture: MediaPlatformImage,
  ) => {
    const { data } = await this.httpClient.post(
      `${this.baseUrl}/media/index`,
      picture,
    );

    return data;
  };
}
