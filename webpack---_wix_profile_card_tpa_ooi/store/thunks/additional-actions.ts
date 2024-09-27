import { RoleId } from '@wix/members-domain-ts';

import { shareUrlModal } from '../../constants/modal-type';
import {
  AdditionalActionId,
  ProfileActionType,
  Thunk,
  ThunkWithArgs,
} from '../../types';
import { openModalWithCallback } from '../../services/modal';
import { Applications } from '../../services/public-api-store';
import { aboutAppDefinitionId } from '../../constants/app-definition-id';
import { aboutPageId } from '../../constants/section-id';
import { actionButtonClicked } from '@wix/bi-logger-members-app-uou/v2';
import { getCommonBIEventProps } from '../../services/bi-event';
import { ABOUT_PAGE_WIDGET_ID } from '../../constants/widgets-ids';
import { togglePublicProfilePreview } from './public-profile-preview';
import { executeRoleAction } from './role-action';

type AdditionalActionsMap = {
  [key in AdditionalActionId]: Thunk;
};

const shareProfile: Thunk = () => async (_, getState, extra) => {
  const {
    compId,
    platformAPIs,
    wixCodeApi,
    getPublicAPI,
    experiments,
    biLogger,
    flowAPI,
    metaData,
  } = extra;
  const state = getState();
  const membersAreaAPI = await getPublicAPI(Applications.MembersArea);
  const profileUrl = await membersAreaAPI
    ?.getSectionUrl({
      appDefinitionId: aboutAppDefinitionId,
      sectionId: aboutPageId,
      memberId: state.users.viewed.uid,
      memberSlug: state.users.viewed.slug,
      widgetId: ABOUT_PAGE_WIDGET_ID,
    })
    .catch(() => null);
  const payload = { url: profileUrl ?? null };
  const onConfirm = () => {};

  openModalWithCallback({
    compId,
    modalType: shareUrlModal,
    payload,
    platformAPIs,
    wixCodeApi,
    experiments,
    onConfirm,
  });
  biLogger?.report(
    actionButtonClicked({
      ...getCommonBIEventProps(flowAPI, state, metaData),
      action_type: ProfileActionType.SHARE_PROFILE,
    }),
  );
};

const joinCommunity = () => executeRoleAction(RoleId.JOIN_COMMUNITY);

const actionsMap: AdditionalActionsMap = {
  [AdditionalActionId.ShareProfile]: shareProfile,
  [AdditionalActionId.ViewPublicProfile]: togglePublicProfilePreview,
  [AdditionalActionId.JoinCommunity]: joinCommunity,
};

export const executeAdditionalAction: ThunkWithArgs<AdditionalActionId> =
  (actionId) => async (dispatch, getState, extra) => {
    const actionHandler = actionsMap[actionId];
    if (!actionHandler) {
      return;
    }
    await actionHandler()(dispatch, getState, extra);
  };
