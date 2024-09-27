import type { BadgeType } from '@wix/members-badge-lib';
import type {
  IMembersAreaWidgetPluginService,
  IRouteDataService,
} from '@wix/members-area-widget-plugin-lib/viewer';

import type {
  Handler,
  InjectedGlobalSettings,
  InjectedSite,
  Nullable,
  PublicMember,
} from '../types';
import type { FlowAPI } from '../types/controller';

import { Experiment } from '../constants/experiments';
import { WarmupDataKey } from '../types/controller';
import GlobalSettingsBuilder from './global-settings-builder';
import MembersService from './members-service';
import BadgesService from './badges-service';
import SettingsService from './settings-service';
import { getIsPublicMemberCandidateNoOne } from './members-privacy';
import { initWarmupDataService } from './warmup-data-service';
import { ProfileCardMiddlewareService } from './profile-card-middleware-service';

interface CreateInitialDataFetchServiceOptions {
  flowAPI: FlowAPI;
  getInstance: Handler<string>;
  services: DataServices;
}

interface DataServices {
  membersService: MembersService;
  badgesService: BadgesService;
  settingsService: SettingsService;
  routerDataService: IRouteDataService;
  widgetPluginService: IMembersAreaWidgetPluginService;
  profileCardMiddlewareService: ProfileCardMiddlewareService;
}

interface InitialData {
  currentMember: Nullable<PublicMember>;
  viewedMember: Nullable<PublicMember>;
  installedApps: InjectedSite['installedApps'];
  isSocialChat: InjectedSite['isSocialChat'];
  rolesMap: Nullable<{ [key: string]: { roleName: string } }>;
  badgeList: BadgeType[];
  globalSettings: InjectedGlobalSettings;
  isPublicMemberCandidateNoOne: boolean;
  visibleWidgetId: string;
  isWidgetPlugin: boolean;
}

export default class InitialDataFetchService {
  warmupDataService = initWarmupDataService(
    this.flowAPI.controllerConfig.wixCodeApi.window.warmupData,
  );

  constructor(
    private readonly flowAPI: FlowAPI,
    private readonly getInstance: Handler<string>,
    private readonly dataServices: DataServices,
  ) {}

  async fetchInitialData(): Promise<InitialData> {
    const routeData = await this.dataServices.routerDataService.getRouteData();
    const currentMemberId = routeData?.currentMemberIdentifier?.id ?? null;
    const viewedMemberId = routeData?.viewedMemberIdentifier?.id ?? null;

    const cacheKey = this.getCacheKey(currentMemberId, viewedMemberId);
    const cachedInitialData = this.getInitialDataFromCache(cacheKey);
    if (cachedInitialData) {
      return cachedInitialData;
    }

    let initialData: InitialData;
    if (this.flowAPI.environment.isSSR) {
      initialData = await this.getInitialDataFromServices(
        currentMemberId,
        viewedMemberId,
      );
      this.warmupDataService.set(WarmupDataKey.InitialData, initialData);
    } else {
      const warmupData = this.warmupDataService.get<InitialData>(
        WarmupDataKey.InitialData,
      );
      initialData =
        warmupData ??
        (await this.getInitialDataFromServices(
          currentMemberId,
          viewedMemberId,
        ));
    }

    this.addInitialDataToCache(cacheKey, initialData);

    return initialData;
  }

  clearCache(
    currentMemberId: Nullable<string>,
    viewedMemberId: Nullable<string>,
  ) {
    try {
      const cacheKey = this.getCacheKey(currentMemberId, viewedMemberId);
      return this.getStorage()?.removeItem(cacheKey);
    } catch {}
  }

  private async getInitialDataFromServices(
    currentMemberId: Nullable<string>,
    viewedMemberId: Nullable<string>,
  ): Promise<InitialData> {
    const [
      currentMember,
      viewedMember,
      installedApps,
      isSocialChat,
      rolesMap,
      badgeList,
      globalSettings,
      isPublicMemberCandidateNoOne,
      visibleWidgetId,
      isWidgetPlugin,
    ] = await Promise.all([
      ...this.getMembers(currentMemberId, viewedMemberId),
      this.getInstalledApps(),
      this.getIsSocialChat(),
      this.getRolesMap(),
      this.getBadges(),
      this.getGlobalSettings(),
      getIsPublicMemberCandidateNoOne(this.flowAPI.httpClient),
      this.getVisibleWidgetId(),
      this.getIsWidgetPlugin(),
    ]);

    return {
      currentMember,
      viewedMember,
      installedApps,
      isSocialChat,
      rolesMap,
      badgeList,
      globalSettings,
      isPublicMemberCandidateNoOne,
      visibleWidgetId,
      isWidgetPlugin,
    };
  }

  private getVisibleWidgetId() {
    return this.dataServices.widgetPluginService.getVisibleWidgetId();
  }

  private getIsWidgetPlugin() {
    return this.dataServices.widgetPluginService.getIsWidgetPlugin();
  }

  private getMembers(
    currentMemberId: Nullable<string>,
    viewedMemberId: Nullable<string>,
  ): [Promise<Nullable<PublicMember>>, Promise<Nullable<PublicMember>>] {
    const currentMemberPromise = currentMemberId
      ? this.getMember(currentMemberId)
      : Promise.resolve(null);

    if (currentMemberId === viewedMemberId) {
      return [currentMemberPromise, currentMemberPromise];
    }

    const viewedMemberPromise = viewedMemberId
      ? this.getMember(viewedMemberId)
      : Promise.resolve(null);

    return [currentMemberPromise, viewedMemberPromise];
  }

  private getMember(uid: string) {
    const { experiments } = this.flowAPI;
    const { membersService, profileCardMiddlewareService } = this.dataServices;

    return experiments.enabled(Experiment.UseMiddlewareForMemberGetter)
      ? profileCardMiddlewareService.getMember(uid)
      : membersService.getMember(uid);
  }

  private getInstalledApps() {
    try {
      return this.dataServices.membersService.getInstalledApps();
    } catch {
      return Promise.resolve({});
    }
  }

  private getIsSocialChat() {
    try {
      return this.dataServices.membersService.getIsSocialChat();
    } catch {
      return Promise.resolve(false);
    }
  }

  private getRolesMap() {
    const { experiments } = this.flowAPI;
    const { membersService, profileCardMiddlewareService } = this.dataServices;

    try {
      return experiments.enabled(Experiment.UseMiddlewareForRolesMapGetter)
        ? profileCardMiddlewareService.getRolesMap()
        : membersService.getRolesMap();
    } catch {
      return Promise.resolve({});
    }
  }

  private getBadges() {
    try {
      return this.dataServices.badgesService.getBadgeList();
    } catch {
      return Promise.resolve([]);
    }
  }

  private getGlobalSettings() {
    const { controllerConfig, experiments } = this.flowAPI;
    const { viewMode } = controllerConfig.wixCodeApi.window;
    const { profileCardMiddlewareService, settingsService } = this.dataServices;

    try {
      return experiments.enabled(
        Experiment.UseMiddlewareForGlobalSettingsGetter,
      )
        ? profileCardMiddlewareService.getGlobalSettings()
        : settingsService.getGlobalSettings(viewMode);
    } catch {
      const globalSettings = new GlobalSettingsBuilder().build();
      return Promise.resolve(globalSettings);
    }
  }

  private getInitialDataFromCache(cacheKey: string) {
    const storageResponse = this.getStorage()?.getItem(cacheKey);

    if (!storageResponse) {
      return null;
    }

    try {
      return JSON.parse(storageResponse);
    } catch {
      return null;
    }
  }

  private addInitialDataToCache(cacheKey: string, initialData: InitialData) {
    try {
      return this.getStorage()?.setItem(cacheKey, JSON.stringify(initialData));
    } catch {}
  }

  private getCacheKey(
    currentMemberId: Nullable<string>,
    viewedMemberId: Nullable<string>,
  ) {
    const [instance] = this.getInstance().split('.');
    const { appDefinitionId } = this.flowAPI.controllerConfig.appParams;
    const memberIds = [currentMemberId, viewedMemberId].filter(Boolean);

    return memberIds.length
      ? `${appDefinitionId}-${memberIds.join('-')}-${instance}`
      : `${appDefinitionId}-${instance}`;
  }

  private getStorage() {
    const { platformAPIs } = this.flowAPI.controllerConfig;
    return platformAPIs?.storage?.memory;
  }
}

export const createInitialDataFetchService = ({
  flowAPI,
  getInstance,
  services,
}: CreateInitialDataFetchServiceOptions) => {
  return new InitialDataFetchService(flowAPI, getInstance, services);
};
