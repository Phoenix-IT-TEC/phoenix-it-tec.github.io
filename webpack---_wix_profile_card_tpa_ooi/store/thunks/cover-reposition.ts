import { MediaPlatformImage } from '@wix/members-domain-ts';

import {
  Thunk,
  ThunkExtra,
  ThunkWithArgs,
  ThunkDispatch,
  StoreState,
  CoverRepositionOptions,
} from '../../types';
import { getUpdatedCoverPosition } from '../../services/cover-utils';
import { maybeUploadMediaToMediaStore } from '../../services/file-upload';
import {
  getSetEditCoverAction,
  getSetEditCoverPositionAction,
  getSetViewedMemberCoverAction,
  getToggleIsCoverRepositionModeAction,
} from '../actions';
import {
  scheduleViewedMemberSync,
  clearInitialDataCache,
  emitProfileEditBIEvents,
  toggleIsProfileSaving,
  toggleProfileSavedNotification,
} from './common';

export const leaveCoverRepositionMode: Thunk = () => (dispatch, getState) => {
  const { profilePage } = getState();
  const { isEditing } = profilePage;

  if (!isEditing) {
    dispatch(getSetEditCoverAction(null));
  } else {
    dispatch(getSetEditCoverPositionAction());
  }

  dispatch(getToggleIsCoverRepositionModeAction());
};

const getUpdatedFields = async (state: StoreState, extra: ThunkExtra) => {
  const { profilePage, users } = state;

  return maybeUploadMediaToMediaStore({
    editCover: profilePage.editCover,
    services: extra,
    defaultCover: users.viewed.cover as MediaPlatformImage,
  });
};

const updateMemberCover = async (
  dispatch: ThunkDispatch,
  state: StoreState,
  extra: ThunkExtra,
) => {
  const { uid } = state.users.viewed;
  const { membersService } = extra;

  const updatedFields = await getUpdatedFields(state, extra);
  const updatedCover = updatedFields.cover as MediaPlatformImage;
  await membersService.partialMemberUpdate(uid, updatedFields);

  scheduleViewedMemberSync(extra);
  dispatch(getSetViewedMemberCoverAction(updatedCover));
  dispatch(getSetEditCoverAction(null));

  return updatedFields;
};

export const saveCoverReposition: Thunk =
  () => async (dispatch, getState, extra) => {
    const state = getState();
    dispatch(getToggleIsCoverRepositionModeAction());

    if (!state.profilePage.isEditing) {
      toggleIsProfileSaving(dispatch, extra);
      const updatedFields = await updateMemberCover(dispatch, state, extra);
      toggleIsProfileSaving(dispatch, extra);
      emitProfileEditBIEvents(state, updatedFields, extra);
      toggleProfileSavedNotification(extra);
      clearInitialDataCache(state, extra);
    }
  };

export const changeCoverPosition: ThunkWithArgs<CoverRepositionOptions> =
  ({ coverWidth, movement, isMobile }) =>
  (dispatch, getState) => {
    const { users, profilePage } = getState();
    const { editCover } = profilePage;
    const { viewed } = users;

    const position = getUpdatedCoverPosition({
      member: viewed,
      editCover,
      coverWidth,
      movement,
      isMobile,
    });

    dispatch(getSetEditCoverPositionAction(position));
  };
