import { createSlice } from '@reduxjs/toolkit';
import { BadgeType } from '@wix/members-badge-lib';

import { Reducer } from '../../types';

export interface BadgesState {
  list: BadgeType[];
}

export type SetBadgeListPayload = BadgesState;

const name = 'badges';

const initialState: BadgesState = { list: [] };

const setBadgeList: Reducer<BadgesState, SetBadgeListPayload> = (
  state,
  { payload },
) => ({
  ...state,
  list: payload.list,
});

const reducers = { setBadgeList };

const badgesSlice = createSlice({ name, initialState, reducers });

export default badgesSlice;
