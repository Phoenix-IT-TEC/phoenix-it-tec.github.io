import { createSlice } from '@reduxjs/toolkit';

import { Reducer, ComponentSettings } from '../../types';

export type ComponentSettingsState = ComponentSettings;

const name = 'componentSettings';

const initialState: ComponentSettingsState = {
  styleParams: {
    numbers: {},
    colors: {},
    fonts: {},
    booleans: {},
  },
};

const setComponentSettings: Reducer<
  ComponentSettingsState,
  ComponentSettingsState
> = (state, { payload }) => ({ ...state, ...payload });

const reducers = { setComponentSettings };

const componentSettingsSlice = createSlice({ name, initialState, reducers });

export default componentSettingsSlice;
