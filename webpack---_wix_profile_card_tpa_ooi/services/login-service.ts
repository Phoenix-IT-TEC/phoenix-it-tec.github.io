import { WixCodeApi } from '../types/controller';

export const requestLogin = (wixCodeApi: WixCodeApi) => {
  wixCodeApi.user.promptLogin({ modal: true }).catch(() => {});
};
