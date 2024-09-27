import { createSlice } from '@reduxjs/toolkit';

import { Reducer, InjectedGlobalSettings } from '../../types';
import GlobalSettingsBuilder from '../../services/global-settings-builder';

export type GlobalSettingsState = InjectedGlobalSettings;

export type PatchGlobalSettingsPayload = Partial<GlobalSettingsState>;

export type SetSitePresetsPayload = Pick<
  GlobalSettingsState,
  'siteColors' | 'siteTextPresets'
>;

const name = 'globalSettings';

const initialState: GlobalSettingsState = new GlobalSettingsBuilder().build();

const setGlobalSettings: Reducer<GlobalSettingsState, GlobalSettingsState> = (
  state,
  { payload },
) => ({ ...state, ...payload });

const patchGlobalSettings: Reducer<
  GlobalSettingsState,
  PatchGlobalSettingsPayload
> = (state, { payload }) => ({ ...state, ...payload });

const setSitePresets: Reducer<GlobalSettingsState, SetSitePresetsPayload> = (
  state,
  { payload },
) => ({ ...state, payload });

const reducers = { setGlobalSettings, patchGlobalSettings, setSitePresets };

const globalSettingsSlice = createSlice({ name, initialState, reducers });

export default globalSettingsSlice;
