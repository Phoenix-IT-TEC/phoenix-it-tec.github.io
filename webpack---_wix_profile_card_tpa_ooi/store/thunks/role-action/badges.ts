import { BadgeType } from '@wix/members-badge-lib';

import {
  Thunk,
  ThunkDispatch,
  ThunkExtra,
  StoreState,
  Nullable,
  ProfileChangeEvent,
} from '../../../types';
import { badgesModal } from '../../../constants/modal-type';
import { openModalWithCallback } from '../../../services/modal';
import {
  getSetBadgeListPayload,
  getSetViewedMemberAction,
} from '../../actions';
import {
  scheduleViewedMemberSync,
  notifyProfileChangeObservers,
  clearInitialDataCache,
} from '../common';

interface BadgesModalConfirmEvent {
  data: string[];
}

interface SetBadgesAndMemberOptions {
  dispatch: ThunkDispatch;
  state: StoreState;
  extra: ThunkExtra;
  badges: Nullable<BadgeType[]>;
  assignedBadgeIds: string[];
}

const openManageBadgesModal = (
  { users: { viewed } }: StoreState,
  { compId, platformAPIs, wixCodeApi, experiments }: ThunkExtra,
  onConfirm: (event: BadgesModalConfirmEvent) => Promise<void>,
) => {
  const modalType = badgesModal;
  const payload = { memberName: viewed.name, memberBadgesIds: viewed.badges };

  openModalWithCallback({
    compId,
    modalType,
    payload,
    platformAPIs,
    wixCodeApi,
    experiments,
    onConfirm,
  });
};

const updateMemberBadges = async (
  { users }: StoreState,
  badgeIds: string[],
  { membersService, badgesService }: ThunkExtra,
) => {
  const { uid } = users.viewed;
  const setBadgesPromise = membersService.setMemberBadges(uid, badgeIds);
  const getBadgesPromise = badgesService.getBadgeList().catch(() => null);

  const [, badges] = await Promise.all([setBadgesPromise, getBadgesPromise]);
  return badges;
};

const setBadgesAndMember = async ({
  dispatch,
  state: { users },
  extra,
  badges,
  assignedBadgeIds,
}: SetBadgesAndMemberOptions) => {
  const { viewed } = users;

  if (badges !== null) {
    dispatch(getSetBadgeListPayload(badges));
  }

  scheduleViewedMemberSync(extra);
  dispatch(getSetViewedMemberAction({ ...viewed, badges: assignedBadgeIds }));
};

export const manageBadges: Thunk = () => async (dispatch, getState, extra) => {
  const state = getState();

  const onConfirm = async (event: BadgesModalConfirmEvent) => {
    const assignedBadgeIds = event.data;
    const badges = await updateMemberBadges(state, assignedBadgeIds, extra);

    setBadgesAndMember({ dispatch, state, extra, badges, assignedBadgeIds });
    clearInitialDataCache(state, extra);
    notifyProfileChangeObservers(extra, {
      event: ProfileChangeEvent.BadgeAssigned,
      assignedBadgeIds,
    });
  };

  openManageBadgesModal(state, extra, onConfirm);
};
