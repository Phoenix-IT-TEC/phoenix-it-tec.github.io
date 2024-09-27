import { InjectedGlobalSettings, ThunkWithArgs } from '../../types';
import {
  getPatchGlobalSettingsAction,
  getSetViewedMemberFollowerCount,
  getSetViewedMemberFollowingCount,
} from '../actions';
import { clearInitialDataCache } from './common';

export const updateViewedMemberFollowingCount: ThunkWithArgs<number> =
  (followingCountChange) => async (dispatch, getState, extra) => {
    const state = getState();
    const { viewed } = state.users;
    const setFollowingCountPayload = {
      followingCount: viewed.followingCount + followingCountChange,
    };

    dispatch(getSetViewedMemberFollowingCount(setFollowingCountPayload));
    clearInitialDataCache(state, extra);
  };

export const updateViewedMemberFollowerCount: ThunkWithArgs<number> =
  (followerCountChange) => async (dispatch, getState, extra) => {
    const state = getState();
    const { viewed } = state.users;
    const setFollowerCountPayload = {
      followerCount: viewed.followerCount + followerCountChange,
    };

    dispatch(getSetViewedMemberFollowerCount(setFollowerCountPayload));
    clearInitialDataCache(state, extra);
  };

export const patchGlobalSettingsInStore: ThunkWithArgs<
  Partial<InjectedGlobalSettings>
> = (changedSettings) => async (dispatch, getState, extra) => {
  dispatch(getPatchGlobalSettingsAction(changedSettings));
  clearInitialDataCache(getState(), extra);
};
