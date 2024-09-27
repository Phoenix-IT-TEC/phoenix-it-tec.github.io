import { createSlice } from '@reduxjs/toolkit';

import { Nullable, PublicMember, Reducer } from '../../types';
import PublicMemberBuilder from '../../services/public-member-builder';

export interface UsersState {
  current: Nullable<PublicMember>;
  viewed: PublicMember;
}

export interface SetUsersPayload {
  current: Nullable<PublicMember>;
  viewed?: PublicMember;
}

export type SetViewedMemberPayload = Pick<UsersState, 'viewed'>;

export type SetViewedMemberPhotoPayload = Pick<PublicMember, 'picture'>;

export type SetViewedMemberCoverPayload = Pick<PublicMember, 'cover'>;

export type SetMemberDetailsPayload = Partial<
  Pick<PublicMember, 'cover' | 'picture' | 'name' | 'title' | 'privacyStatus'>
>;

export type SetViewedMemberFollowingCount = Pick<
  PublicMember,
  'followingCount'
>;

export type SetViewedMemberFollowerCount = Pick<PublicMember, 'followerCount'>;

const name = 'users';

const emptyMember = new PublicMemberBuilder().build();

const initialState: UsersState = { current: null, viewed: emptyMember };

const dereferenceViewedMember = ({ viewed }: UsersState) => ({ ...viewed });

const setUsers: Reducer<UsersState, SetUsersPayload> = (
  state,
  { payload },
) => ({
  ...state,
  ...payload,
});

const setViewedMember: Reducer<UsersState, SetViewedMemberPayload> = (
  state,
  { payload },
) => ({ ...state, ...payload });

const setViewedMemberPicture: Reducer<
  UsersState,
  SetViewedMemberPhotoPayload
> = (state, { payload }) => {
  const viewed = dereferenceViewedMember(state);
  viewed.picture = payload.picture;

  return { ...state, viewed };
};

const setViewedMemberCover: Reducer<UsersState, SetViewedMemberCoverPayload> = (
  state,
  { payload },
) => {
  const viewed = dereferenceViewedMember(state);
  viewed.cover = payload.cover;

  return { ...state, viewed };
};

const setViewedMemberDetails: Reducer<UsersState, SetMemberDetailsPayload> = (
  state,
  { payload },
) => ({
  ...state,
  viewed: { ...state.viewed, ...payload },
});

const setCurrentMemberDetails: Reducer<UsersState, SetMemberDetailsPayload> = (
  state,
  { payload },
) => ({
  ...state,
  current: { ...state.current!, ...payload },
});

const followOrUnfollowViewedMember: Reducer<UsersState> = (state) => {
  const viewed = dereferenceViewedMember(state);
  viewed.isSubscribed = !viewed.isSubscribed;
  viewed.followerCount = viewed.followerCount + (viewed.isSubscribed ? 1 : -1);

  return { ...state, viewed };
};

const setViewedMemberFollowingCount: Reducer<
  UsersState,
  SetViewedMemberFollowingCount
> = (state, { payload }) => ({
  ...state,
  viewed: { ...state.viewed, ...payload },
});

const setViewedMemberFollowerCount: Reducer<
  UsersState,
  SetViewedMemberFollowerCount
> = (state, { payload }) => ({
  ...state,
  viewed: { ...state.viewed, ...payload },
});

const reducers = {
  setUsers,
  setViewedMember,
  setViewedMemberPicture,
  setViewedMemberCover,
  setViewedMemberDetails,
  setCurrentMemberDetails,
  setViewedMemberFollowingCount,
  setViewedMemberFollowerCount,
  followOrUnfollowViewedMember,
};

const usersSlice = createSlice({ name, initialState, reducers });

export default usersSlice;
