import { createSlice } from '@reduxjs/toolkit';

import { Reducer, RolesMap } from '../../types';

export interface RolesState {
  map: RolesMap;
}

export type SetRolesMapPayload = RolesState;

const name = 'roles';

const initialState: RolesState = { map: null };

const setRolesMap: Reducer<RolesState, SetRolesMapPayload> = (
  state,
  { payload },
) => ({
  ...state,
  map: payload.map,
});

const reducers = { setRolesMap };

const rolesSlice = createSlice({ name, initialState, reducers });

export default rolesSlice;
