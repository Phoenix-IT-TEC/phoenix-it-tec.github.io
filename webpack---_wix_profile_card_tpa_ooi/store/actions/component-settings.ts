import componentSettingsSlice, {
  ComponentSettingsState,
} from '../slices/component-settings-slice';

export const getSetComponentSettingsAction = (
  settings: ComponentSettingsState,
) => componentSettingsSlice.actions.setComponentSettings(settings);
