import { RoleId } from '@wix/members-domain-ts';
import { actionButtonClicked } from '@wix/bi-logger-members-app-uou/v2';

import { Origin, Thunk, ThunkWithArgs } from '../../../types';
import { openModalWithCallback } from '../../../services/modal';
import { maybeNavigateToHomePage } from '../../../services/navigation';
import { clearInitialDataCache } from '../common';
import { toggleIsEditingProfile } from '../profile-page';
import { manageBadges } from './badges';
import { joinCommunity, leaveCommunity } from './community';
import { modalRoleAction } from './modal-roles';
import { memberBlockMember } from './member-block-member';
import { requestLogin } from '../../../services/login-service';
import { getCommonBIEventProps } from '../../../services/bi-event';
import { reportMember } from './report-member';

type CustomRolesActionsMap = { [key in RoleId]?: ThunkWithArgs<RoleId> };

const anonymousReport: Thunk =
  () =>
  async (_, __, { wixCodeApi }) => {
    requestLogin(wixCodeApi);
  };

export const deleteMember: ThunkWithArgs<RoleId> =
  (roleId) => async (_, getState, extra) => {
    const state = getState();
    const { viewed } = getState().users;
    const { compId, platformAPIs, wixCodeApi, membersService, experiments } =
      extra;
    const payload = {};
    const onConfirm = async () => {
      await membersService.deleteMember(viewed.uid);
      clearInitialDataCache(state, extra);
      await maybeNavigateToHomePage(wixCodeApi);
    };

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

const customRolesActionsMap: CustomRolesActionsMap = {
  [RoleId.JOIN_COMMUNITY]: joinCommunity,
  [RoleId.LEAVE_COMMUNITY]: leaveCommunity,
  [RoleId.EDIT]: toggleIsEditingProfile,
  [RoleId.ANONYMOUS_REPORT]: anonymousReport,
  [RoleId.DELETE_MEMBER]: deleteMember,
  [RoleId.MANAGE_BADGES]: manageBadges,
  [RoleId.MEMBER_BLOCK_MEMBER]: memberBlockMember,
  [RoleId.REPORT_MEMBER]: reportMember,
};

export const executeRoleAction: ThunkWithArgs<RoleId> =
  (roleId) => async (dispatch, getState, extra) => {
    const state = getState();
    const { viewed } = state.users;
    const { biLogger, flowAPI, metaData } = extra;

    biLogger?.report(
      actionButtonClicked({
        ...getCommonBIEventProps(flowAPI, state, metaData),
        action_type: roleId,
        member_chosen: viewed.uid,
        formOrigin: Origin.Profile,
      }),
    );

    const customRoleAction = customRolesActionsMap[roleId];
    if (customRoleAction) {
      await customRoleAction(roleId)(dispatch, getState, extra);
      return;
    }

    await modalRoleAction(roleId)(dispatch, getState, extra);
  };
