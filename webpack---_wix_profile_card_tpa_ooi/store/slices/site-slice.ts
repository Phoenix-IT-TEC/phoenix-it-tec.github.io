import { createSlice } from '@reduxjs/toolkit';

import { InjectedSite, Reducer } from '../../types';
import SiteBuilder from '../../services/site-builder';
import { checkIfSiteIsSocial } from '../../services/social-status';

export type SetInstalledAppsPayload = Pick<InjectedSite, 'installedApps'>;

export type SetInstalledMAVersionPayload = Pick<
  InjectedSite,
  'installedMAVersion'
>;

export type SetIsSocialChatPayload = Pick<InjectedSite, 'isSocialChat'>;

export type SetSettingsTabPayload = Pick<InjectedSite, 'settingsTab'>;

export type SetIsWidgetPluginPayload = Pick<InjectedSite, 'isWidgetPlugin'>;

export type SetVisibleWidgetIdPayload = Pick<InjectedSite, 'visibleWidgetId'>;

export type SetSettingsTabMenuItemPayload = Pick<
  InjectedSite,
  'settingsTabMenuItem'
>;

const name = 'site';

const initialState = new SiteBuilder().build();

const setInstalledApps: Reducer<InjectedSite, SetInstalledAppsPayload> = (
  state,
  { payload },
) => ({
  ...state,
  installedApps: payload.installedApps,
  isSocial: checkIfSiteIsSocial(payload.installedApps),
});

const setInstalledMAVersion: Reducer<
  InjectedSite,
  SetInstalledMAVersionPayload
> = (state, { payload }) => ({
  ...state,
  installedMAVersion: payload.installedMAVersion,
});

const setIsSocialChat: Reducer<InjectedSite, SetIsSocialChatPayload> = (
  state,
  { payload },
) => ({ ...state, isSocialChat: payload.isSocialChat });

const setSettingsTab: Reducer<InjectedSite, SetSettingsTabPayload> = (
  state,
  { payload },
) => ({
  ...state,
  settingsTab: payload.settingsTab,
});

const setSettingsTabMenuItem: Reducer<
  InjectedSite,
  SetSettingsTabMenuItemPayload
> = (state, { payload }) => ({
  ...state,
  settingsTabMenuItem: payload.settingsTabMenuItem,
});

const setIsWidgetPlugin: Reducer<InjectedSite, SetIsWidgetPluginPayload> = (
  state,
  { payload },
) => ({ ...state, isWidgetPlugin: payload.isWidgetPlugin });

const setVisibleWidgetIdId: Reducer<InjectedSite, SetVisibleWidgetIdPayload> = (
  state,
  { payload },
) => ({
  ...state,
  visibleWidgetId: payload.visibleWidgetId,
});

const reducers = {
  setInstalledApps,
  setInstalledMAVersion,
  setIsSocialChat,
  setSettingsTab,
  setIsWidgetPlugin,
  setVisibleWidgetIdId,
  setSettingsTabMenuItem,
};

const siteSlice = createSlice({ name, initialState, reducers });

export default siteSlice;
