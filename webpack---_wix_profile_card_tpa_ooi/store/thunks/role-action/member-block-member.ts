import { RoleId } from '@wix/members-domain-ts';
import { actionButtonClicked } from '@wix/bi-logger-members-app-uou/v2';

import { Origin, ThunkWithArgs } from '../../../types';
import {
  openMemberBlockNotification,
  openModalWithCallback,
} from '../../../services/modal';
import { Applications } from '../../../services/public-api-store';
import { getCommonBIEventProps } from '../../../services/bi-event';
import { maybeNavigateToHomePage } from '../../../services/navigation';

export const memberBlockMember: ThunkWithArgs<RoleId> =
  (roleId) => async (_dispatch, getState, extra) => {
    const {
      compId,
      wixCodeApi,
      platformAPIs,
      experiments,
      getPublicAPI,
      biLogger,
      flowAPI,
      metaData,
    } = extra;

    const state = getState();
    const { viewed } = state.users;
    const { uid } = viewed;
    const membersAreaAPI = await getPublicAPI(Applications.MembersArea);

    const onConfirm = async () => {
      const { blockMemberService } = extra;
      await blockMemberService.blockMember(uid);
      biLogger?.report(
        actionButtonClicked({
          ...getCommonBIEventProps(flowAPI, state, metaData),
          action_type: 'block_confirm',
          member_chosen: uid,
          formOrigin: Origin.Profile,
          site_member_id: state.users.current?.uid,
        }),
      );

      if (state.site.isWidgetPlugin) {
        return membersAreaAPI?.openBlockedMemberEmptyState();
      }

      maybeNavigateToHomePage(wixCodeApi);

      return openMemberBlockNotification({
        compId,
        wixCodeApi,
        isMobile: flowAPI.environment.isMobile,
        experiments,
        queryParams: { memberName: viewed.name },
      });
    };

    openModalWithCallback({
      compId,
      modalType: roleId,
      payload: { memberName: viewed.name },
      platformAPIs,
      wixCodeApi,
      experiments,
      onConfirm,
    });
  };
