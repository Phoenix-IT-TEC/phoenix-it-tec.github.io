import { RoleId } from '@wix/members-domain-ts';

import { Origin, Thunk } from '../../types';
import { Applications } from '../../services/public-api-store';
import { isMemberInCommunity } from '../selectors';
import { joinCommunity } from './role-action/community';
import { requestLogin } from '../../services/login-service';
import { maChatOpened } from '@wix/bi-logger-members-app-uou/v2';
import { getCommonBIEventProps } from '../../services/bi-event';

export const openChat: Thunk = () => async (dispatch, getState, extra) => {
  const state = getState();
  const { current, viewed } = state.users;
  const { wixCodeApi, getPublicAPI, biLogger, flowAPI, metaData } = extra;

  if (!current) {
    requestLogin(wixCodeApi);
    return;
  }

  if (!isMemberInCommunity(current)) {
    await joinCommunity(RoleId.JOIN_COMMUNITY)(dispatch, getState, extra);
    return;
  }

  const chatApi = await getPublicAPI(Applications.Chat);
  if (chatApi) {
    biLogger?.report(
      maChatOpened({
        ...getCommonBIEventProps(flowAPI, state, metaData),
        origin: Origin.Profile,
        messaged_member_id: viewed.uid,
      }),
    );
    chatApi.startPrivateChat(viewed.uid).catch(() => {});
  }
};
