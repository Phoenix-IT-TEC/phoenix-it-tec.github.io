import globalSettingsSlice, {
  GlobalSettingsState,
  PatchGlobalSettingsPayload,
  SetSitePresetsPayload,
} from '../slices/global-settings-slice';

export const getSetGlobalSettingsAction = (settings: GlobalSettingsState) =>
  globalSettingsSlice.actions.setGlobalSettings(settings);

export const getPatchGlobalSettingsAction = (
  settings: PatchGlobalSettingsPayload,
) => globalSettingsSlice.actions.patchGlobalSettings(settings);

export const getSetSitePresetsAction = (sitePresets: SetSitePresetsPayload) =>
  globalSettingsSlice.actions.setSitePresets(sitePresets);
