import { CreateControllerFn, IUser } from '@wix/yoshi-flow-editor';

import {
  setConfigGlobally,
  setCurrentUserGlobally,
  wrappedRenderMemberMenus,
} from '../../current-ma';
import { toMonitored } from '../../utils/monitoring';
import { setMobileMembersMenuValue } from '../../current-ma/services/menu-renderer-editor';
import { AppData, ControllerConfig } from '../../types';

const createController: CreateControllerFn = async ({
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
            wrappedRenderMemberMenus(config, appData as AppData, flowAPI),
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
        wrappedRenderMemberMenus(config, appData as AppData, flowAPI);
      }
    },
  };
};

export default createController;
