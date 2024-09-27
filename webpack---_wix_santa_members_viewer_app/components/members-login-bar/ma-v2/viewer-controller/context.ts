import { type ControllerParams } from '@wix/yoshi-flow-editor';

import type {
  ContextProps,
  ContextServicesWithMAPrefix,
} from '../../../../types';

import { MenuService } from '../services/menu';
import { StateService } from '../services/state';
import { PageService } from '../services/page';
import { getCommonServices } from '../../../../services/common-services';

type GetContextReturnType = {
  contextProps: ContextProps;
  contextServices: ContextServicesWithMAPrefix;
};

export const getContext = (params: ControllerParams): GetContextReturnType => {
  const { flowAPI, controllerConfig } = params;
  const { wixCodeApi, appParams, $w } = controllerConfig;

  const contextProps = { $w, flowAPI, wixCodeApi, appParams };

  const { currentUserService, rolesService, cacheService, warmupDataService } =
    getCommonServices({ flowAPI, controllerConfig });

  const pageService = new PageService(wixCodeApi.site);

  const stateService = new StateService(contextProps, {
    currentUserService,
    cacheService,
    rolesService,
    warmupDataService,
    pageService,
  });

  const menuService = new MenuService($w, stateService, flowAPI.experiments);

  const contextServices = {
    currentUserService,
    cacheService,
    rolesService,
    menuService,
    stateService,
  };

  return {
    contextProps,
    contextServices,
  };
};
