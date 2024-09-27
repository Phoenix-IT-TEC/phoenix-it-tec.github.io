import { IWixStyleParams } from '@wix/tpa-settings';
import {
  createMembersAreaWidgetPluginService,
  IMembersAreaWidgetPluginService,
  IRouteDataService,
  routerDataServiceFactory,
} from '@wix/members-area-widget-plugin-lib/viewer';

import { InjectedHandlers, MetaData, Nullable } from '../types';
import { ControllerConfig, FlowAPI, WixCodeApi } from '../types/controller';
import {
  badgesApiAbsoluteBaseUrl,
  badgesApiRelativeBaseUrl,
  membersApiAbsoluteBaseUrl,
  membersApiRelativeBaseUrl,
} from '../constants/urls';
import { aboutAppDefinitionId } from '../constants/app-definition-id';
import { ABOUT_PAGE_WIDGET_ID } from '../constants/widgets-ids';
import { Store } from '../store';
import { SetSitePresetsPayload } from '../store/slices/global-settings-slice';
import {
  getSetBadgeListPayload,
  getSetComponentSettingsAction,
  getSetGlobalSettingsAction,
  getSetInstalledAppsAction,
  getSetInstalledMAVersionAction,
  getSetIsSocialChatAction,
  getSetIsWidgetPluginAction,
  getSetRolesMapAction,
  getSetSitePresetsAction,
  getSetUsersAction,
  getSetVisibleWidgetIdIdAction,
} from '../store/actions';
import {
  getIsOwnProfile,
  isInPage,
  isMemberInCommunity,
} from '../store/selectors';
import { getSetIsPublicMemberCandidateNoOneAction } from '../store/actions/members-privacy';
import InitialDataFetchService from './initial-data-fetch-service';
import BlockMemberService from './block-member-service';
import SettingsService from './settings-service';
import MediaService from './media-service';
import BadgesService from './badges-service';
import MembersService from './members-service';
import ReportMemberService from './report-member-service';
import { getInstalledMAVersion } from './app';
import { ProfileCardMiddlewareService } from './profile-card-middleware-service';

export interface Services {
  membersService: MembersService;
  badgesService: BadgesService;
  mediaService: MediaService;
  settingsService: SettingsService;
  blockMemberService: BlockMemberService;
  reportMemberService: ReportMemberService;
  widgetPluginService: IMembersAreaWidgetPluginService;
  routerDataService: IRouteDataService;
  profileCardMiddlewareService: ProfileCardMiddlewareService;
}

interface InitPropsOptions {
  store: Store;
  initialDataFetchService: InitialDataFetchService;
  wixCodeApi: WixCodeApi;
}

interface OpenProfilePreviewNotificationOptions {
  store: Store;
  flowAPI: FlowAPI;
  handlers: Pick<InjectedHandlers, 'openPrivateProfilePreviewNotification'>;
}

export const getMetaData = (getInstance: () => string) => {
  const instance = getInstance();
  if (!instance) {
    return null;
  }

  try {
    const [, base64Data] = instance.split('.', 2);
    return JSON.parse(atob(base64Data)) as MetaData;
  } catch {
    return null;
  }
};

export const getMetaSiteId = (
  controllerConfig: ControllerConfig,
  metaData: Nullable<MetaData>,
) => {
  const { bi } = controllerConfig.platformAPIs;
  if (bi?.metaSiteId) {
    return bi.metaSiteId;
  }

  return metaData?.metaSiteId ?? null;
};

export const getInstanceFactory = ({
  appParams,
  wixCodeApi,
}: ControllerConfig) => {
  const userInstance = wixCodeApi.user.currentUser.instance;
  const appInstance = appParams.instance;
  let instance = userInstance || appInstance;

  wixCodeApi.site.onInstanceChanged((event) => {
    instance = event.instance;
  }, appParams.appDefinitionId);

  return () => instance;
};

const getServices = ({
  componentId,
  useAbsoluteUrl,
  wixCodeApi,
  flowAPI,
}: {
  useAbsoluteUrl: boolean;
  componentId: string;
  wixCodeApi: WixCodeApi;
  flowAPI: FlowAPI;
}) => {
  const { httpClient, environment } = flowAPI;

  const membersServiceBaseUrl = useAbsoluteUrl
    ? membersApiAbsoluteBaseUrl
    : membersApiRelativeBaseUrl;

  const badgesServiceBaseUrl = useAbsoluteUrl
    ? badgesApiAbsoluteBaseUrl
    : badgesApiRelativeBaseUrl;

  const badgesService = new BadgesService(badgesServiceBaseUrl, httpClient);

  const blockMemberService = new BlockMemberService(httpClient);

  const mediaService = new MediaService(httpClient);

  const membersService = new MembersService(membersServiceBaseUrl, httpClient);

  const settingsService = new SettingsService(
    componentId,
    membersServiceBaseUrl,
    httpClient,
  );

  const reportMemberService = new ReportMemberService(httpClient);

  const widgetPluginService = createMembersAreaWidgetPluginService();

  const routerDataService = routerDataServiceFactory(
    widgetPluginService,
    wixCodeApi.user,
    wixCodeApi.window,
  );

  const profileCardMiddlewareService = new ProfileCardMiddlewareService(
    httpClient,
    environment.isEditor,
  );

  return {
    badgesService,
    blockMemberService,
    mediaService,
    membersService,
    settingsService,
    reportMemberService,
    widgetPluginService,
    routerDataService,
    profileCardMiddlewareService,
  };
};

export const initServices = (
  componentId: string,
  flowAPI: FlowAPI,
  wixCodeApi: WixCodeApi,
): Services => {
  const useAbsoluteUrl = flowAPI.environment.isSSR;

  const {
    mediaService,
    settingsService,
    badgesService,
    blockMemberService,
    membersService,
    reportMemberService,
    widgetPluginService,
    routerDataService,
    profileCardMiddlewareService,
  } = getServices({
    componentId,
    useAbsoluteUrl,
    wixCodeApi,
    flowAPI,
  });

  return {
    membersService,
    badgesService,
    mediaService,
    settingsService,
    blockMemberService,
    reportMemberService,
    widgetPluginService,
    routerDataService,
    profileCardMiddlewareService,
  };
};

export const setComponentSettings = (
  store: Store,
  settings: IWixStyleParams,
) => {
  const payload = { styleParams: settings as any };
  const action = getSetComponentSettingsAction(payload);

  store.dispatch(action);
};

export const setSitePresets = (
  store: Store,
  sitePresets: SetSitePresetsPayload,
) => store.dispatch(getSetSitePresetsAction(sitePresets));

export const initProps = async ({
  store,
  initialDataFetchService,
  wixCodeApi,
}: InitPropsOptions) => {
  const propsPromise = initialDataFetchService.fetchInitialData();
  const {
    currentMember,
    viewedMember,
    installedApps,
    isSocialChat,
    rolesMap,
    badgeList,
    globalSettings,
    isPublicMemberCandidateNoOne,
    isWidgetPlugin,
    visibleWidgetId,
  } = await propsPromise;
  const users = {
    ...(viewedMember && { viewed: viewedMember }),
    current: currentMember,
  };
  const installedMAVersion = await getInstalledMAVersion(wixCodeApi);

  store.dispatch(getSetUsersAction(users));
  store.dispatch(getSetBadgeListPayload(badgeList));
  store.dispatch(getSetRolesMapAction(rolesMap));
  store.dispatch(getSetIsSocialChatAction(isSocialChat));
  store.dispatch(getSetInstalledAppsAction(installedApps));
  store.dispatch(getSetInstalledMAVersionAction(installedMAVersion));
  store.dispatch(getSetGlobalSettingsAction(globalSettings));
  store.dispatch(
    getSetIsPublicMemberCandidateNoOneAction(isPublicMemberCandidateNoOne),
  );
  store.dispatch(getSetIsWidgetPluginAction(isWidgetPlugin));
  store.dispatch(getSetVisibleWidgetIdIdAction(visibleWidgetId));
};

const shouldTogglePrivateProfileNotification = (
  store: Store,
  flowAPI: FlowAPI,
) => {
  const state = store.getState();
  const { viewed } = state.users;
  const { isViewer, isSSR } = flowAPI.environment;
  const isViewerCSR = isViewer && !isSSR;

  return (
    isViewerCSR &&
    isInPage({
      state,
      flowAPI,
      applicationId: aboutAppDefinitionId,
      widgetId: ABOUT_PAGE_WIDGET_ID,
    }) &&
    getIsOwnProfile(state) &&
    !isMemberInCommunity(viewed)
  );
};

export const maybeOpenPrivateProfilePreviewNotification = ({
  store,
  flowAPI,
  handlers,
}: OpenProfilePreviewNotificationOptions) => {
  if (shouldTogglePrivateProfileNotification(store, flowAPI)) {
    handlers.openPrivateProfilePreviewNotification();
  }
};
