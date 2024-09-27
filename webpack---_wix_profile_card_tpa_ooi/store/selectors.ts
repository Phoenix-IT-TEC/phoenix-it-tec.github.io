import { PrivacyStatus, RoleId } from '@wix/members-domain-ts';
import { Experiments } from '@wix/yoshi-flow-editor';

import {
  AdditionalAction,
  AdditionalActionId,
  AdditionalActionName,
  BadgeSettings,
  DataHook,
  InjectedComputedProps,
  Nullable,
  NumberStyleParam,
  ProfileLayout,
  PublicMember,
} from '../types';
import {
  aboutAppDefinitionId,
  myAccountAppDefinitionId,
} from '../constants/app-definition-id';
import { FlowAPI } from '../types/controller';
import { RootState } from './root-reducer';
import {
  defaultProfileAlignment,
  defaultProfileImageLayout,
  defaultProfileLayout,
  defaultProfileWidgetHeight,
} from '../components/ProfileCard/stylesParams';
import { BLOCKED_MEMBER_ID, MAVersion } from '../constants/common';
import settingsParams from '../components/ProfileCard/settingsParams';
import {
  getCoverImageStyle,
  getCoverPosition,
  getCoverUrl,
  getImageProperties,
} from '../services/cover-utils';
import {
  ABOUT_PAGE_WIDGET_ID,
  MY_ACCOUNT_PAGE_WIDGET_ID,
} from '../constants/widgets-ids';
import { Experiment } from '../constants/experiments';

interface GetProfilePhotoProps {
  state: RootState;
  flowAPI: FlowAPI;
  profileLayout?: ProfileLayout;
  isMobile?: boolean;
}

export const isInPage = ({
  state,
  flowAPI,
  widgetId,
  applicationId,
}: {
  state: RootState;
  flowAPI: FlowAPI;
  applicationId: string;
  widgetId: string;
}) => {
  const { isWidgetPlugin, visibleWidgetId } = state.site;

  if (isWidgetPlugin) {
    return visibleWidgetId === widgetId;
  }

  const { currentPage } = flowAPI.controllerConfig.wixCodeApi.site;
  return currentPage?.applicationId === applicationId;
};

const isInSocialCommunity = (state: RootState) => {
  return getInCommunity(state) && state.site.isSocial;
};

export const getIsOwnProfile = ({ users: { viewed, current } }: RootState) => {
  return viewed.uid === current?.uid;
};

const getStyleParams = ({ componentSettings: { styleParams } }: RootState) => {
  return styleParams;
};

const getProfileLayout = (state: RootState, flowAPI: FlowAPI) => {
  if (flowAPI.environment.isEditorX) {
    return ProfileLayout.FullWidth;
  }

  const { numbers } = getStyleParams(state);
  const profileLayout = numbers[NumberStyleParam.ProfileLayout];

  return profileLayout ?? defaultProfileLayout;
};

const getProfileAlignment = (state: RootState) => {
  const { numbers } = getStyleParams(state);
  const profileAlignment = numbers[NumberStyleParam.ProfileAlignment];

  return profileAlignment ?? defaultProfileAlignment;
};

const getProfileStyle = (state: RootState) => {
  const pictureStyle = getStyleParams(state).numbers.pictureStyle;
  return pictureStyle ?? defaultProfileImageLayout;
};

const showAllBadges = ({ site, users }: RootState) => {
  const badgesTabOpened = site.settingsTab === DataHook.BadgesTabButton;
  const hasBadgesAssigned = users.viewed.badges.length;

  return badgesTabOpened && !hasBadgesAssigned;
};

const getAssignedBadges = (state: RootState) => {
  const { users, badges } = state;
  const allBadges = badges.list;
  const viewedMemberBadges = users.viewed.badges;

  if (showAllBadges(state)) {
    return allBadges;
  }

  return allBadges.filter(({ id }) => {
    return viewedMemberBadges.includes(id);
  });
};

const getBadgeSettings = (state: RootState): Omit<BadgeSettings, 'i18n'> => {
  return {
    align: 'center',
    badges: getAssignedBadges(state),
    maxRows: 1,
    useTextRemainder: false,
  };
};

const getInCommunity = ({ users }: RootState) =>
  isMemberInCommunity(users.viewed);

const shouldHideEditRoleAction = (state: RootState, flowAPI: FlowAPI) => {
  return isInPage({
    state,
    flowAPI,
    applicationId: myAccountAppDefinitionId,
    widgetId: MY_ACCOUNT_PAGE_WIDGET_ID,
  });
};

const getRolesActions = (flowAPI: FlowAPI, state: RootState) => {
  const { users, roles } = state;
  const { rolesActions } = users.viewed;
  const memberRoleActions = rolesActions ?? [];
  const shouldHideEdit = shouldHideEditRoleAction(state, flowAPI);
  const filteredRoleActions = memberRoleActions.filter((action) => {
    switch (action.roleId) {
      case RoleId.EDIT:
        return !shouldHideEdit;
      case RoleId.JOIN_COMMUNITY:
      case RoleId.LEAVE_COMMUNITY:
        return false;
      default:
        return true;
    }
  });

  return roles.map
    ? filteredRoleActions.map((action) => ({
        ...action,
        ...roles.map?.[action.roleId],
      }))
    : filteredRoleActions;
};

const getAdditionalActionsToShow = (state: RootState, flowAPI: FlowAPI) => {
  const showJoinCommunity = showJoinCommunityInMoreActionsMenu(state, flowAPI);

  const showViewPublicProfile = showViewPublicProfileInMoreActionsMenu(
    state,
    flowAPI,
  );

  const _isInSocialCommunity = isInSocialCommunity(state);
  const _getIsOwnProfile = getIsOwnProfile(state);
  const showShareProfile = _isInSocialCommunity && _getIsOwnProfile;

  return {
    showJoinCommunity,
    showViewPublicProfile,
    showShareProfile,
  };
};

const getAdditionalActions = (state: RootState, flowAPI: FlowAPI) => {
  const additionalActions: AdditionalAction[] = [];
  const { showJoinCommunity, showViewPublicProfile, showShareProfile } =
    getAdditionalActionsToShow(state, flowAPI);

  if (showJoinCommunity) {
    additionalActions.push({
      id: AdditionalActionId.JoinCommunity,
      action: AdditionalActionName.JoinCommunity,
    });
  }

  if (showViewPublicProfile) {
    additionalActions.push({
      id: AdditionalActionId.ViewPublicProfile,
      action: AdditionalActionName.ViewPublicProfile,
    });
  }

  if (showShareProfile) {
    additionalActions.push({
      id: AdditionalActionId.ShareProfile,
      action: AdditionalActionName.ShareProfile,
    });
  }

  return additionalActions;
};

export const isMemberInCommunity = (member: Nullable<PublicMember>) => {
  if (!member) {
    return false;
  }

  const inCommunityStatuses = [PrivacyStatus.Public, PrivacyStatus.Unknown];

  return inCommunityStatuses.includes(member.privacyStatus);
};

const getIsDesignPreview = ({ site }: RootState) => {
  return site.settingsTab === DataHook.DesignTabButton;
};

const getIsDesignBackgroundsAndBordersPreview = ({ site }: RootState) => {
  return (
    site.settingsTab === DataHook.DesignTabButton &&
    site.settingsTabMenuItem === DataHook.BackgroundAndBordersListItem
  );
};

const getIsDisplayPreview = ({ site }: RootState) => {
  return site.settingsTab === DataHook.DisplayTabButton;
};

const getIsResponsiveEditor = (flowAPI: FlowAPI) => {
  return flowAPI.environment.isEditorX;
};

const getShowCover = (state: RootState) => {
  return getStyleParams(state).booleans.showCover ?? false;
};

const getShowTitle = (state: RootState, flowAPI: FlowAPI) => {
  if (!flowAPI.experiments.enabled(Experiment.TitleForAll)) {
    // default is true
    return true;
  }

  return state.globalSettings.showMemberTitle ?? true;
};

const getShowRoleLabel = (flowAPI: FlowAPI) =>
  flowAPI.settings.get(settingsParams.showRoleLabel);

const getShowFollowButton = (flowAPI: FlowAPI, state: RootState) => {
  const isDesignPreview = getIsDesignPreview(state);
  const isSocialSite = state.site.isSocial;
  if (isDesignPreview && isSocialSite) {
    return true;
  }

  const showFollowButtonSetting = flowAPI.settings.get(
    settingsParams.showFollowButton,
  );

  const member = state.users.viewed;
  const isPublicMember = member?.privacyStatus !== PrivacyStatus.Private;

  return (
    showFollowButtonSetting &&
    isSocialSite &&
    isPublicMember &&
    (flowAPI.experiments.enabled(Experiment.UseBlockedCheckFollowButton)
      ? !getShowAsBlocked(state)
      : true) &&
    !isBlockedByMember(state)
  );
};

const getShowEditProfileDetailsButton = (
  state: RootState,
  flowAPI: FlowAPI,
) => {
  if (!flowAPI.experiments.enabled(Experiment.EnableProfileDetailsEdit)) {
    return false;
  }

  return state.site.installedMAVersion === MAVersion.v3;
};

const getShowCoverPhoto = (flowAPI: FlowAPI) => {
  return flowAPI.settings.get(settingsParams.showCoverPhotoDesktop);
};

const getTexts = (flowAPI: FlowAPI) => {
  return {
    followButtonText: flowAPI.settings.get(settingsParams.followButtonText),
    followingButtonText: flowAPI.settings.get(
      settingsParams.followingButtonText,
    ),
    messageButtonText: flowAPI.settings.get(settingsParams.messageButtonText),
    followingCountersText: flowAPI.settings.get(
      settingsParams.followingCountersText,
    ),
    followersCountersText: flowAPI.settings.get(
      settingsParams.followersCountersText,
    ),
  };
};

const getShowAsBlocked = ({ users }: RootState) => {
  const { current, viewed } = users;

  return (
    !!viewed.uid &&
    current?.uid !== viewed.uid &&
    viewed.roles.includes(RoleId.BLOCK_MEMBER)
  );
};

const isBlockedByMember = ({ users }: RootState) => {
  const { viewed } = users;
  return viewed.uid === BLOCKED_MEMBER_ID;
};

const hasBlogWriterProfileRoles = (roles: RoleId[]) => {
  const blogWriterProfileRoles = [
    RoleId.ADMIN,
    RoleId.SET_BLOG_WRITER,
    RoleId.SET_BLOG_EDITOR,
  ];

  return blogWriterProfileRoles.some((role) => roles.includes(role));
};

export const isBlogWriterOrEditor = ({ site, users }: RootState) => {
  const { installedApps } = site;
  const isBlogInstalled = installedApps.wixBlog ?? false;

  return isBlogInstalled && hasBlogWriterProfileRoles(users.viewed.roles);
};

const isFollowersInstalled = ({ site }: RootState) => {
  const { installedApps } = site;
  return !!installedApps.membersFF;
};

const showViewPublicProfileCTA = (state: RootState, flowAPI: FlowAPI) => {
  return (
    isInPage({
      state,
      flowAPI,
      applicationId: aboutAppDefinitionId,
      widgetId: ABOUT_PAGE_WIDGET_ID,
    }) && isMemberInCommunity(state.users.viewed)
  );
};

const showJoinCommunityCTA = (state: RootState, flowAPI: FlowAPI) => {
  const isSocial = state.site.isSocial;
  const inCommunity = getInCommunity(state);
  const isInProfilePage = getIsInProfilePage(state, flowAPI);
  const isPublicMemberCandidateNoOne = getIsPublicMemberCandidateNoOne(state);

  return (
    isSocial && !inCommunity && isInProfilePage && !isPublicMemberCandidateNoOne
  );
};

const shouldMoveJoinCommunityCTA = (experiments: Experiments) => {
  return experiments.enabled(Experiment.MoveJoinCommunityCTA);
};

const showJoinCommunityInCover = (state: RootState, flowAPI: FlowAPI) => {
  return (
    !shouldMoveJoinCommunityCTA(flowAPI.experiments) &&
    showJoinCommunityCTA(state, flowAPI)
  );
};

const showViewPublicProfileInMoreActionsMenu = (
  state: RootState,
  flowAPI: FlowAPI,
) => {
  const canEdit = getCanEdit(state);
  const { isProfilePreview } = state.profilePage;
  const isDesignPreview = getIsDesignPreview(state);
  const inSocialCommunity = isInSocialCommunity(state);

  const baseDisplayCondition =
    canEdit && !isProfilePreview && !isDesignPreview && inSocialCommunity;

  return baseDisplayCondition && showViewPublicProfileCTA(state, flowAPI);
};

const showJoinCommunityInMoreActionsMenu = (
  state: RootState,
  flowAPI: FlowAPI,
) => {
  const canEdit = getCanEdit(state);
  const { isProfilePreview } = state.profilePage;
  const isDesignPreview = getIsDesignPreview(state);

  const baseDisplayCondition = canEdit && !isProfilePreview && !isDesignPreview;

  return (
    baseDisplayCondition &&
    shouldMoveJoinCommunityCTA(flowAPI.experiments) &&
    showJoinCommunityCTA(state, flowAPI)
  );
};

const showEditProfileCTA = (state: RootState, flowAPI: FlowAPI) => {
  return (
    isInPage({
      state,
      flowAPI,
      applicationId: aboutAppDefinitionId,
      widgetId: ABOUT_PAGE_WIDGET_ID,
    }) && !isMemberInCommunity(state.users.viewed)
  );
};

export const getCanEdit = ({ users }: RootState) =>
  users.viewed.rolesActions?.some(({ roleId }) => roleId === RoleId.EDIT) ??
  false;

const getAllowChat = (flowAPI: FlowAPI, state: RootState) => {
  const { booleans } = getStyleParams(state);
  const showMessageButtonParam = flowAPI.environment.isMobile
    ? booleans.showMessageButtonMobile
    : booleans.showMessageButton;
  const showMessageButton = showMessageButtonParam ?? true;

  return showMessageButton && state.site.isSocialChat;
};

const getIsInProfilePage = (state: RootState, flowAPI: FlowAPI) => {
  return isInPage({
    state,
    flowAPI,
    applicationId: aboutAppDefinitionId,
    widgetId: ABOUT_PAGE_WIDGET_ID,
  });
};

const getProfileWidgetHeight = (state: RootState) => {
  return (
    getStyleParams(state).numbers.profileWidgetHeight ??
    defaultProfileWidgetHeight
  );
};

const getProfileCoverPhoto = ({
  flowAPI,
  profileLayout,
  state,
  isMobile = false,
}: GetProfilePhotoProps) => {
  const showCoverPhoto = getShowCoverPhoto(flowAPI);

  if (!showCoverPhoto) {
    return null;
  }

  const member = state.users.viewed;
  const { editCover, isCoverRepositionMode } = state.profilePage;

  const imageProps = getImageProperties({
    profileLayout,
    isMobile,
    isFullWidth: getIsResponsiveEditor(flowAPI),
    reducedQuality: false,
  });

  const coverUrl = getCoverUrl({
    member,
    editCover,
    defaultCoverUrl: state.globalSettings.defaultProfileCoverUrl,
    imageProps,
    isCoverRepositionMode,
  });

  const coverPosition = getCoverPosition({ member, editCover });

  return {
    src: coverUrl ? coverUrl : undefined,
    position: coverPosition,
    imageProps,
  };
};

const getProfileCoverPhotoStyle = ({
  state,
  flowAPI,
  profileLayout,
  isMobile = false,
}: GetProfilePhotoProps) => {
  const showCoverPhoto = getShowCoverPhoto(flowAPI);

  if (!showCoverPhoto) {
    return null;
  }

  const member = state.users.viewed;
  const { editCover, isCoverRepositionMode } = state.profilePage;

  const imageProps = getImageProperties({
    profileLayout,
    isMobile,
    isFullWidth: getIsResponsiveEditor(flowAPI),
    reducedQuality: false,
  });

  const coverUrl = getCoverUrl({
    member,
    editCover,
    defaultCoverUrl: state.globalSettings.defaultProfileCoverUrl,
    imageProps,
    isCoverRepositionMode,
  });

  return getCoverImageStyle({
    coverUrl,
    member,
    editCover,
  });
};

const getIsPublicMemberCandidateNoOne = (state: RootState) => {
  return state.membersPrivacy.isPublicMemberCandidateNoOne;
};

const getIsWidgetPlugin = (state: RootState) => {
  return state.site.isWidgetPlugin;
};

const getDefaultCoverUrl = (state: RootState) => {
  return state.globalSettings.defaultProfileCoverUrl;
};

export const getComputedProps = (
  flowAPI: FlowAPI,
  state: RootState,
): InjectedComputedProps => ({
  profileLayout: getProfileLayout(state, flowAPI),
  profileAlignment: getProfileAlignment(state),
  pictureStyle: getProfileStyle(state),
  badgesSettings: getBadgeSettings(state),
  rolesActions: getRolesActions(flowAPI, state),
  additionalActions: getAdditionalActions(state, flowAPI),
  inCommunity: getInCommunity(state),
  isDesignPreview: getIsDesignPreview(state),
  isDisplayPreview: getIsDisplayPreview(state),
  isDesignBackgroundsAndBordersPreview:
    getIsDesignBackgroundsAndBordersPreview(state),
  isResponsiveEditor: getIsResponsiveEditor(flowAPI),
  isInProfilePage: getIsInProfilePage(state, flowAPI),
  showAsBlocked: getShowAsBlocked(state),
  showCover: getShowCover(state),
  showTitle: getShowTitle(state, flowAPI),
  showRoleLabel: getShowRoleLabel(flowAPI),
  showCoverPhoto: getShowCoverPhoto(flowAPI),
  showAsBlockedByMember: isBlockedByMember(state),
  showJoinCommunityCTA: showJoinCommunityInCover(state, flowAPI),
  showEditProfileCTA: showEditProfileCTA(state, flowAPI),
  showFollowButton: getShowFollowButton(flowAPI, state),
  showEditProfileDetailsButton: getShowEditProfileDetailsButton(state, flowAPI),
  canEdit: getCanEdit(state),
  allowChat: getAllowChat(flowAPI, state),
  followersInstalled: isFollowersInstalled(state),
  profileWidgetHeight: getProfileWidgetHeight(state),
  mobileProfileCoverPhoto: getProfileCoverPhoto({
    state,
    flowAPI,
    isMobile: true,
  }),
  mobileProfileCoverPhotoStyle: getProfileCoverPhotoStyle({
    state,
    flowAPI,
    isMobile: true,
  }),
  horizontalProfileCoverPhoto: getProfileCoverPhoto({
    flowAPI,
    state,
    profileLayout: ProfileLayout.FullWidth,
  }),
  cardProfileCoverPhoto: getProfileCoverPhoto({
    flowAPI,
    state,
    profileLayout: ProfileLayout.Card,
  }),
  horizontalProfileCoverPhotoStyle: getProfileCoverPhotoStyle({
    flowAPI,
    state,
    profileLayout: ProfileLayout.FullWidth,
  }),
  cardProfileCoverPhotoStyle: getProfileCoverPhotoStyle({
    flowAPI,
    state,
    profileLayout: ProfileLayout.Card,
  }),
  profileWidgetTexts: getTexts(flowAPI),
  isPublicMemberCandidateNoOne: getIsPublicMemberCandidateNoOne(state),
  isWidgetPlugin: getIsWidgetPlugin(state),
  defaultCoverUrl: getDefaultCoverUrl(state),
});
