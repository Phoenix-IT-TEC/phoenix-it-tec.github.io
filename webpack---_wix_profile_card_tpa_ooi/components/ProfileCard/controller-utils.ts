import { loadMembersCustomPages } from '@wix/bi-logger-members-app-users/v2';
import { membersTpaLoadedUou } from '@wix/bi-logger-members-app-uou/v2';
import { ControllerParams } from '@wix/yoshi-flow-editor';

import {
  getInstanceFactory,
  getMetaData,
  getMetaSiteId,
  initProps,
  initServices,
  maybeOpenPrivateProfilePreviewNotification,
  Services,
  setComponentSettings,
} from '../../services/controller-utils';
import { Interaction, MetaData, Origin } from '../../types';
import {
  createSettingsListener,
  registerCurrentUserListener,
  registerDataSyncListener,
  registerSettingsListeners,
  registerStoreChangeListener,
  registerWidgetPluginHostListeners,
} from '../../services/controller-listeners';
import { getCommonBIEventProps } from '../../services/bi-event';
import {
  createPublicAPIStore,
  GetPublicAPI,
} from '../../services/public-api-store';
import {
  initMonitoringService,
  MonitoringService,
} from '../../services/monitoring';
import DataSyncService, {
  createDataSyncService,
} from '../../services/data-sync-service';
import InitialDataFetchService, {
  createInitialDataFetchService,
} from '../../services/initial-data-fetch-service';
import { ProfileSubject } from '../../services/profile-subject';
import createStore, { Store } from '../../store';
import { ControllerConfig, FlowAPI } from '../../types/controller';

type ControllerContext = {
  flowAPI: FlowAPI;
  controllerConfig: ControllerConfig;
  store: Store;
  settingsListener: ReturnType<typeof createSettingsListener>;
  dataSyncService: DataSyncService;
  profileSubject: ProfileSubject | undefined;
  services: Services;
  metaData: MetaData | null;
  initialDataFetchService: InitialDataFetchService;
  monitoringService: MonitoringService;
  getPublicAPI: GetPublicAPI;
};

export const getControllerContext = ({
  flowAPI,
  controllerConfig,
  appData,
}: ControllerParams): ControllerContext => {
  const { compId, wixCodeApi, platformAPIs } = controllerConfig;
  const { config } = controllerConfig;
  const { experiments, bi: biLogger } = flowAPI;
  const getInstance = getInstanceFactory(controllerConfig);
  const getPublicAPI = createPublicAPIStore(wixCodeApi.site.getPublicAPI);
  const metaData = getMetaData(getInstance);
  const services = initServices(compId, flowAPI, wixCodeApi);
  const monitoringService = initMonitoringService(flowAPI);
  const settingsListener = createSettingsListener(config.publicData);
  const dataSyncService = createDataSyncService(compId, platformAPIs.pubSub);
  const initialDataFetchService = createInitialDataFetchService({
    flowAPI,
    getInstance,
    services,
  });
  const profileSubject = appData?.profileSubject as ProfileSubject | undefined;

  const store = createStore({
    ...services,
    metaData,
    compId,
    flowAPI,
    wixCodeApi,
    platformAPIs,
    experiments,
    dataSyncService,
    monitoringService,
    initialDataFetchService,
    profileSubject,
    getPublicAPI,
    biLogger,
  });

  return {
    flowAPI,
    store,
    settingsListener,
    dataSyncService,
    services,
    metaData,
    initialDataFetchService,
    controllerConfig,
    monitoringService,
    getPublicAPI,
    profileSubject,
  };
};

const noop = () => {};

export const initialiseProfileCard = async ({
  flowAPI,
  controllerConfig,
  store,
  metaData,
  initialDataFetchService,
  services,
  monitoringService,
  dataSyncService,
  settingsListener,
  getPublicAPI,
}: ControllerContext) => {
  const metaSiteId = getMetaSiteId(controllerConfig, metaData);

  const currentUserListenerOptions = {
    store,
    flowAPI,
    initialDataFetchService,
    widgetPluginService: services.widgetPluginService,
  };

  const initPropsOptions = {
    store,
    initialDataFetchService,
    wixCodeApi: controllerConfig.wixCodeApi,
  };

  await monitoringService
    .toMonitored(Interaction.InitialDataLoad, initProps(initPropsOptions))
    .catch(noop);

  const renderWidget = async () => {
    setComponentSettings(store, controllerConfig.config.style.styleParams);
    const isWidgetPlugin = services.widgetPluginService.getIsWidgetPlugin();

    if (!isWidgetPlugin) {
      registerCurrentUserListener(currentUserListenerOptions);
    }

    registerWidgetPluginHostListeners({
      store,
      widgetPluginService: services.widgetPluginService,
      initialDataFetchService,
      wixCodeApi: controllerConfig.wixCodeApi,
    });

    registerSettingsListeners({
      eventHandler: settingsListener,
      dataSyncService,
      store,
    });
    const storeHandlers = registerStoreChangeListener({
      metaSiteId,
      store,
      controllerConfig,
      flowAPI,
      dataSyncService,
    });
    registerDataSyncListener({
      dataSyncService,
      store,
      getPublicAPI,
      initialDataFetchService,
      flowAPI,
    });

    const commonBiData = getCommonBIEventProps(
      flowAPI,
      store.getState(),
      metaData,
    );

    if (flowAPI.environment.isEditor) {
      flowAPI.bi?.report(
        loadMembersCustomPages({
          instance_id: commonBiData.instance_id,
          biToken: commonBiData.biToken,
          pageId:
            flowAPI?.controllerConfig?.wixCodeApi?.site?.currentPage
              ?.applicationId,
          pageName: Origin.Profile,
        }),
      );
    } else {
      flowAPI.bi?.report(
        membersTpaLoadedUou({
          ...commonBiData,
          origin: Origin.Profile,
          page_name: Origin.Profile,
          widget_name: Origin.Profile,
          widget_id: controllerConfig.appParams.appDefinitionId,
          member_id: store.getState()?.users?.viewed?.uid,
          currentPageId:
            flowAPI?.controllerConfig?.wixCodeApi?.site?.currentPage
              ?.applicationId,
        }),
      );
    }

    maybeOpenPrivateProfilePreviewNotification({
      store,
      flowAPI,
      handlers: storeHandlers,
    });
  };

  await monitoringService
    .toMonitored(Interaction.InitialWidgetRender, renderWidget())
    .catch(noop);
};
