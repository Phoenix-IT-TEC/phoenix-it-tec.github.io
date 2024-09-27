import usersSlice, {
  SetUsersPayload,
  SetViewedMemberPayload,
  SetViewedMemberPhotoPayload,
  SetViewedMemberCoverPayload,
  SetMemberDetailsPayload,
  SetViewedMemberFollowingCount,
  SetViewedMemberFollowerCount,
} from '../slices/users-slice';

export const getSetUsersAction = (users: SetUsersPayload) =>
  usersSlice.actions.setUsers(users);

export const getSetViewedMemberAction = (
  viewed: SetViewedMemberPayload['viewed'],
) => usersSlice.actions.setViewedMember({ viewed });

export const getSetViewedMemberPictureAction = (
  picture: SetViewedMemberPhotoPayload['picture'],
) => usersSlice.actions.setViewedMemberPicture({ picture });

export const getSetViewedMemberCoverAction = (
  cover: SetViewedMemberCoverPayload['cover'],
) => usersSlice.actions.setViewedMemberCover({ cover });

export const getSetCurrentMemberDetails = (payload: SetMemberDetailsPayload) =>
  usersSlice.actions.setCurrentMemberDetails(payload);

export const getSetViewedMemberDetails = (payload: SetMemberDetailsPayload) =>
  usersSlice.actions.setViewedMemberDetails(payload);

export const getFollowOrUnfollowAction = () =>
  usersSlice.actions.followOrUnfollowViewedMember(null);

export const getSetViewedMemberFollowingCount = (
  payload: SetViewedMemberFollowingCount,
) => usersSlice.actions.setViewedMemberFollowingCount(payload);

export const getSetViewedMemberFollowerCount = (
  payload: SetViewedMemberFollowerCount,
) => usersSlice.actions.setViewedMemberFollowerCount(payload);
