export enum AdditionalActionId {
  ShareProfile = 'share_profile',
  ViewPublicProfile = 'view_public_profile',
  JoinCommunity = 'join_community',
}

export enum AdditionalActionName {
  ShareProfile = 'MemberRoles.action_set.share_profile',
  ViewPublicProfile = 'MemberRoles.action_set.view_public_profile',
  JoinCommunity = 'MemberRoles.action_set.community',
}

export interface AdditionalAction {
  id: AdditionalActionId;
  action: AdditionalActionName;
}
