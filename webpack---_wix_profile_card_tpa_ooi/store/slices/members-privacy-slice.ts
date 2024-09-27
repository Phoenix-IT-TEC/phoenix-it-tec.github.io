import { createSlice } from '@reduxjs/toolkit';

import { Reducer } from '../../types';

export interface MembersPrivacyState {
  isPublicMemberCandidateNoOne: boolean;
}

type SetMembersPrivacyPayload = MembersPrivacyState;

const name = 'members-privacy';

const initialState: MembersPrivacyState = {
  isPublicMemberCandidateNoOne: false,
};

const setIsPublicMemberCandidateNoOne: Reducer<
  MembersPrivacyState,
  SetMembersPrivacyPayload
> = (state, { payload }) => ({
  ...state,
  isPublicMemberCandidateNoOne: payload.isPublicMemberCandidateNoOne,
});

const reducers = { setIsPublicMemberCandidateNoOne };

const membersPrivacySlice = createSlice({ name, initialState, reducers });

export default membersPrivacySlice;
