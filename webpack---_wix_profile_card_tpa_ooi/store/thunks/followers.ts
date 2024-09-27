import { RoleId } from '@wix/members-domain-ts';
import { followButtonClickedUou } from '@wix/bi-logger-members-app-uou/v2';

import type {
  FollowingFollowersTab,
  PublicMember,
  Thunk,
  ThunkExtra,
} from '../../types';

import { LIGHTBOX_TPA_PAGE_ID } from '../../constants/lightbox';
import { Origin } from '../../types';
import { requestLogin } from '../../services/login-service';
import { getCommonBIEventProps } from '../../services/bi-event';
import { Applications } from '../../services/public-api-store';
import { getFollowOrUnfollowAction } from '../actions';
import { isMemberInCommunity } from '../selectors';
import { scheduleViewedMemberSync, clearInitialDataCache } from './common';
import { joinCommunity } from './role-action/community';

export const followOrUnfollow: Thunk = () => {
  return async (dispatch, getState, extra) => {
    const { wixCodeApi, membersService, biLogger, flowAPI, metaData } = extra;
    const state = getState();
    const { current, viewed } = state.users;

    if (!current) {
      requestLogin(wixCodeApi);
      return;
    }

    if (!isMemberInCommunity(current)) {
      await joinCommunity(RoleId.JOIN_COMMUNITY)(dispatch, getState, extra);
      return;
    }

    scheduleViewedMemberSync(extra);
    dispatch(getFollowOrUnfollowAction());
    biLogger?.report(
      followButtonClickedUou({
        ...getCommonBIEventProps(flowAPI, state, metaData),
        origin: Origin.Profile,
        member_followed: viewed.uid,
        is_followed: !viewed.isSubscribed,
      }),
    );
    clearInitialDataCache(state, extra);
    membersService.toggleMemberFollowStatus(viewed.uid, viewed.isSubscribed);
  };
};

const showFollowingFollowers = async (
  viewedMember: PublicMember,
  extra: ThunkExtra,
  activeTab: FollowingFollowersTab,
) => {
  const publicAPI = await extra.getPublicAPI(Applications.MembersArea);

  return publicAPI?.openLightbox(LIGHTBOX_TPA_PAGE_ID.followingFollowers, {
    activeTab,
    title: viewedMember.name,
    memberId: viewedMember.uid,
  });
};

export const showFollowers: Thunk = () => {
  return async (_, getState, extra) => {
    const { viewed } = getState().users;
    showFollowingFollowers(viewed, extra, 'followers');
  };
};

export const showFollowing: Thunk = () => {
  return async (_, getState, extra) => {
    const { viewed } = getState().users;
    showFollowingFollowers(viewed, extra, 'following');
  };
};
