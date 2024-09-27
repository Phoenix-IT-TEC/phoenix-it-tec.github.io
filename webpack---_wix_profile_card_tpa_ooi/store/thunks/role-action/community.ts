import { PrivacyStatus, RoleId } from '@wix/members-domain-ts';
import {
  memberJoinedCommunityAttempt,
  memberJoinedCommunityJoinedAfterPopUpUou,
  memberLeftCommunityAttempt,
  memberLeftCommunityLeftAfterPopup,
} from '@wix/bi-logger-members-app-uou/v2';

import { Origin, ThunkExtra, ThunkWithArgs } from '../../../types';
import { RootState } from '../../root-reducer';
import {
  Notification,
  openNotification,
  openModalWithCallback,
} from '../../../services/modal';
import { getSetUsersAction } from '../../actions';
import { scheduleViewedMemberSync, clearInitialDataCache } from '../common';
import { getCommonBIEventProps } from '../../../services/bi-event';

interface OpenCommunityModalOptions {
  state: RootState;
  extra: ThunkExtra;
  roleId: RoleId;
  privacyStatus: PrivacyStatus;
  onConfirm: () => Promise<void>;
}

interface GetMembersOptions {
  extra: ThunkExtra;
  viewedUid: string;
  currentUid: string;
}

const getNotification = (privacyStatus: PrivacyStatus) =>
  privacyStatus === PrivacyStatus.Public
    ? Notification.JoinedCommunity
    : Notification.LeftCommunity;

const openCommunityModal = ({
  state,
  extra,
  roleId,
  privacyStatus,
  onConfirm,
}: OpenCommunityModalOptions) => {
  const {
    compId,
    platformAPIs,
    wixCodeApi,
    experiments,
    biLogger,
    flowAPI,
    metaData,
  } = extra;
  const payload = { originalAppComponent: Origin.Profile };

  if (privacyStatus === PrivacyStatus.Public) {
    biLogger?.report(
      memberJoinedCommunityAttempt(
        getCommonBIEventProps(flowAPI, state, metaData),
      ),
    );
  } else {
    biLogger?.report(
      memberLeftCommunityAttempt(
        getCommonBIEventProps(flowAPI, state, metaData),
      ),
    );
  }

  openModalWithCallback({
    compId,
    modalType: roleId,
    payload,
    platformAPIs,
    wixCodeApi,
    experiments,
    onConfirm,
  });
};

const openCommunityNotification = (
  privacyStatus: PrivacyStatus,
  { compId, flowAPI, wixCodeApi, experiments }: ThunkExtra,
) => {
  openNotification({
    compId,
    wixCodeApi,
    experiments,
    notification: getNotification(privacyStatus),
    isMobile: flowAPI.environment.isMobile,
  });
};

const getMembers = async ({
  extra,
  viewedUid,
  currentUid,
}: GetMembersOptions) => {
  const { membersService } = extra;

  if (viewedUid === currentUid) {
    const updatedMember = await membersService.getMember(viewedUid);
    return {
      viewed: updatedMember,
      current: updatedMember,
    };
  }

  const getViewedMember = membersService.getMember(viewedUid);
  const getCurrentMember = membersService.getMember(currentUid);
  const [viewed, current] = await Promise.all([
    getViewedMember,
    getCurrentMember,
  ]);

  return { viewed, current };
};

const communityRoleActionFactory = (
  privacyStatus: PrivacyStatus,
): ThunkWithArgs<RoleId> => {
  return (roleId) => (dispatch, getState, extra) => {
    const state = getState();
    const { viewed, current } = state.users;
    const { membersService, biLogger, flowAPI, metaData } = extra;

    const onConfirm = async () => {
      await membersService.setCurrentMemberPrivacyStatus(privacyStatus);

      const currentUid = current ? current.uid : '';
      const members = await getMembers({
        extra,
        viewedUid: viewed.uid,
        currentUid,
      });

      scheduleViewedMemberSync(extra);
      dispatch(getSetUsersAction(members));

      if (privacyStatus === PrivacyStatus.Public) {
        biLogger?.report(
          memberJoinedCommunityJoinedAfterPopUpUou(
            getCommonBIEventProps(flowAPI, state, metaData),
          ),
        );
      } else {
        biLogger?.report(
          memberLeftCommunityLeftAfterPopup(
            getCommonBIEventProps(flowAPI, state, metaData),
          ),
        );
      }

      clearInitialDataCache(state, extra);
      openCommunityNotification(privacyStatus, extra);
    };

    openCommunityModal({ state, extra, roleId, privacyStatus, onConfirm });
  };
};

export const joinCommunity = communityRoleActionFactory(PrivacyStatus.Public);

export const leaveCommunity = communityRoleActionFactory(PrivacyStatus.Private);
