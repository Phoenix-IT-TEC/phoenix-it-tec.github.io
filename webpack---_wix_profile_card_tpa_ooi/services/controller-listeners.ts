import { createEventHandler } from '@wix/tpa-settings';
import { IMembersAreaWidgetPluginService } from '@wix/members-area-widget-plugin-lib/viewer';

import {
  ControllerProps,
  DataHook,
  IFrameEvent,
  InjectedGlobalSettings,
  Nullable,
  ProfileInfo,
  SettingsEvent,
  VoidHandler,
} from '../types';
import {
  FlowAPI,
  RequiredControllerParams,
  WixCodeApi,
} from '../types/controller';
import { RootState } from '../store/root-reducer';
import { bindThunksToStore, Store } from '../store';
import {
  getPatchGlobalSettingsAction,
  getSetSettingsTabAction,
  getSettingsTabMenuItemAction,
  getSetViewedMemberDetails,
} from '../store/actions';
import { getComputedProps } from '../store/selectors';
import InitialDataFetchService from './initial-data-fetch-service';
import DataSyncService from './data-sync-service';
import { initProps } from './controller-utils';
import { Applications, GetPublicAPI } from './public-api-store';
import { requestLogin } from './login-service';

type PartialGlobalSettings = Partial<InjectedGlobalSettings>;

type MapControllerPropsOptions = RequiredControllerParams & {
  metaSiteId: Nullable<string>;
  state: RootState;
  dataSyncService: DataSyncService;
  handlers?: ReturnType<typeof bindThunksToStore> & { signUp: VoidHandler };
};

type ControllerPropsWithOptionalHandlers = Omit<ControllerProps, 'handlers'> &
  Pick<MapControllerPropsOptions, 'handlers'>;

type RegisterStoreChangeListenerOptions = RequiredControllerParams & {
  metaSiteId: Nullable<string>;
  store: Store;
  dataSyncService: DataSyncService;
};

interface RegisterCurrentUserListenerOptions {
  store: Store;
  flowAPI: FlowAPI;
  initialDataFetchService: InitialDataFetchService;
}

interface DataSyncListenerOptions {
  dataSyncService: DataSyncService;
  store: Store;
  getPublicAPI: GetPublicAPI;
  initialDataFetchService: InitialDataFetchService;
  flowAPI: FlowAPI;
}

interface WidgetPluginHostListenerOptions {
  store: Store;
  widgetPluginService: IMembersAreaWidgetPluginService;
  initialDataFetchService: InitialDataFetchService;
  wixCodeApi: WixCodeApi;
}

interface MyAccountListenerOptions {
  store: Store;
  getPublicAPI: GetPublicAPI;
  initialDataFetchService: InitialDataFetchService;
  wixCodeApi: WixCodeApi;
}

const getSignUpHandler = (wixCodeApi: WixCodeApi) => () => {
  requestLogin(wixCodeApi);
};

const mapControllerProps = ({
  metaSiteId,
  state,
  handlers,
  controllerConfig,
  flowAPI,
  dataSyncService,
}: MapControllerPropsOptions): ControllerPropsWithOptionalHandlers => {
  const { users, badges, roles, ...controllerProps } = state;
  const { isRTL, isMobile } = flowAPI.environment;
  const { compId, platformAPIs } = controllerConfig;
  const isThunderbolt = platformAPIs.bi?.viewerName === 'thunderbolt';

  return {
    ...controllerProps,
    ...(!!handlers && { handlers }),
    compId,
    metaSiteId,
    member: users.viewed.uid ? users.viewed : null,
    rolesMap: roles.map,
    isRTL,
    isMobile,
    isCurrentUserAuthenticated: !!users.current,
    fitToContentHeight: isThunderbolt,
    computed: getComputedProps(flowAPI, state),
    iFrameEvents: dataSyncService.purgeIFrameEvents(),
  };
};

export const registerStoreChangeListener = ({
  metaSiteId,
  store,
  controllerConfig,
  flowAPI,
  dataSyncService,
}: RegisterStoreChangeListenerOptions) => {
  const storeHandlers = bindThunksToStore(store);
  const signUp = getSignUpHandler(controllerConfig.wixCodeApi);
  const initialProps = mapControllerProps({
    metaSiteId,
    state: store.getState(),
    handlers: { ...storeHandlers, signUp },
    controllerConfig,
    flowAPI,
    dataSyncService,
  });
  controllerConfig.setProps(initialProps);

  store.subscribe(() => {
    const updatedProps = mapControllerProps({
      metaSiteId,
      state: store.getState(),
      controllerConfig,
      flowAPI,
      dataSyncService,
    });
    controllerConfig.setProps(updatedProps);
  });

  return storeHandlers;
};

export const registerCurrentUserListener = ({
  store,
  flowAPI,
  initialDataFetchService,
}: RegisterCurrentUserListenerOptions) => {
  const { wixCodeApi } = flowAPI.controllerConfig;

  wixCodeApi.user.onLogin(async () => {
    await initProps({
      store,
      initialDataFetchService,
      wixCodeApi,
    });
  });
};

export const registerWidgetPluginHostListeners = ({
  store,
  widgetPluginService,
  initialDataFetchService,
  wixCodeApi,
}: WidgetPluginHostListenerOptions) => {
  widgetPluginService.onMembersAreaEvent((event) => {
    switch (event.type) {
      case 'MEMBERS_CHANGED':
        return void initProps({
          store,
          initialDataFetchService,
          wixCodeApi,
        });
    }
  });
};

const registerMyAccountListeners = async ({
  store,
  getPublicAPI,
  initialDataFetchService,
  wixCodeApi,
}: MyAccountListenerOptions) => {
  const myAccountApi = await getPublicAPI(Applications.MyAccount);

  if (!myAccountApi) {
    return;
  }

  const profileInfoChangeCallback = async (profileInfo: ProfileInfo) => {
    const { users } = store.getState();
    const currentMemberId = users.current?.uid ?? null;
    const viewedMemberId = users.viewed.uid;

    initialDataFetchService.clearCache(currentMemberId, viewedMemberId);

    if (profileInfo.profilePrivacy) {
      await initProps({
        store,
        initialDataFetchService,
        wixCodeApi,
      });
    } else {
      store.dispatch(getSetViewedMemberDetails({ ...profileInfo }));
    }
  };

  myAccountApi.registerToProfileInfoChange(profileInfoChangeCallback);
};

export const registerDataSyncListener = async ({
  store,
  dataSyncService,
  getPublicAPI,
  initialDataFetchService,
  flowAPI,
}: DataSyncListenerOptions) => {
  if (flowAPI.environment.isEditor || flowAPI.environment.isSSR) {
    return;
  }
  await registerMyAccountListeners({
    store,
    getPublicAPI,
    initialDataFetchService,
    wixCodeApi: flowAPI.controllerConfig.wixCodeApi,
  });

  dataSyncService.registerListeners(store);
  store.subscribe(() => dataSyncService.emitEvents(store));
};

export const createSettingsListener = (publicData: Object = {}) => {
  return createEventHandler<SettingsEvent>(publicData);
};

export const registerSettingsListeners = ({
  eventHandler,
  dataSyncService,
  store,
}: {
  eventHandler: ReturnType<typeof createSettingsListener>;
  dataSyncService: DataSyncService;
  store: Store;
}) => {
  eventHandler.on('tabChange', (settingsTab: DataHook) => {
    store.dispatch(getSetSettingsTabAction(settingsTab));
  });

  eventHandler.on('tabMenuItemChange', (settingsTabMenuItem: DataHook) => {
    store.dispatch(getSettingsTabMenuItemAction(settingsTabMenuItem));
  });

  eventHandler.on('globalSettings', (settings: PartialGlobalSettings) => {
    const action = getPatchGlobalSettingsAction(settings);

    store.dispatch(action);
    dataSyncService.emitEvent(action);
    dataSyncService.addIFrameEvent(IFrameEvent.SetGlobalSettings);
  });

  eventHandler.onReset(() => {
    store.dispatch(getSetSettingsTabAction(null));
    store.dispatch(getSetSettingsTabAction(null));
  });
};
