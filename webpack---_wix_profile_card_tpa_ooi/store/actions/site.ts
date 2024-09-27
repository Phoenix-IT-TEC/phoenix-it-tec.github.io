import siteSlice, {
  SetInstalledAppsPayload,
  SetInstalledMAVersionPayload,
  SetIsSocialChatPayload,
  SetIsWidgetPluginPayload,
  SetSettingsTabMenuItemPayload,
  SetSettingsTabPayload,
  SetVisibleWidgetIdPayload,
} from '../slices/site-slice';

export const getSetInstalledAppsAction = (
  installedApps: SetInstalledAppsPayload['installedApps'],
) => siteSlice.actions.setInstalledApps({ installedApps });

export const getSetInstalledMAVersionAction = (
  installedMAVersion: SetInstalledMAVersionPayload['installedMAVersion'],
) => siteSlice.actions.setInstalledMAVersion({ installedMAVersion });

export const getSetIsSocialChatAction = (
  isSocialChat: SetIsSocialChatPayload['isSocialChat'],
) => siteSlice.actions.setIsSocialChat({ isSocialChat });

export const getSetSettingsTabAction = (
  settingsTab: SetSettingsTabPayload['settingsTab'],
) => siteSlice.actions.setSettingsTab({ settingsTab });

export const getSettingsTabMenuItemAction = (
  settingsTabMenuItem: SetSettingsTabMenuItemPayload['settingsTabMenuItem'],
) => siteSlice.actions.setSettingsTabMenuItem({ settingsTabMenuItem });

export const getSetIsWidgetPluginAction = (
  isWidgetPlugin: SetIsWidgetPluginPayload['isWidgetPlugin'],
) => siteSlice.actions.setIsWidgetPlugin({ isWidgetPlugin });

export const getSetVisibleWidgetIdIdAction = (
  visibleWidgetId: SetVisibleWidgetIdPayload['visibleWidgetId'],
) => siteSlice.actions.setVisibleWidgetIdId({ visibleWidgetId });
