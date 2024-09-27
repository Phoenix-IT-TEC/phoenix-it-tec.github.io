import { CreateControllerFn, IUser } from '@wix/yoshi-flow-editor';

import {
  setConfigGlobally,
  setCurrentUserGlobally,
  wrappedRenderLoginMenus,
} from '../../../current-ma';
import { toMonitored } from '../../../utils/monitoring';
import { setMobileMembersMenuValue } from '../../../current-ma/services/menu-renderer-editor';
import { AppData, ControllerConfig } from '../../../types';

export const controllerCurrentMA: CreateControllerFn = async ({
  controllerConfig,
  appData: controllerAppData,
  flowAPI,
}) => {
  const { wixCodeApi, $w } = controllerConfig;
  const isInEditor = wixCodeApi.window.viewMode === 'Editor';
  const config = controllerConfig as ControllerConfig;

  setConfigGlobally(config);

  return {
    async pageReady() {
      const appData = await controllerAppData?.initApplication();

      wixCodeApi.user.onLogin((loggedInUser: IUser) =>
        toMonitored('onLogin', () =>
          setCurrentUserGlobally(loggedInUser, flowAPI.httpClient).then(() =>
            wrappedRenderLoginMenus(config, appData as AppData),
          ),
        )(),
      );

      if (isInEditor) {
        if (flowAPI.environment.isMobile) {
          setMobileMembersMenuValue(
            $w,
            wixCodeApi,
            (appData as AppData).parsedRouters,
          );
        }
      } else {
        wrappedRenderLoginMenus(config, appData as AppData);
      }
    },
  };
};

export default controllerCurrentMA;
