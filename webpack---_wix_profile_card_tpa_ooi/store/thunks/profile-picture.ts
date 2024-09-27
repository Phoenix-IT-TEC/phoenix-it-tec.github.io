import { MediaPlatformImage } from '@wix/members-domain-ts';

import {
  ThunkWithArgs,
  ThunkDispatch,
  ThunkExtra,
  ImageChangeOptions,
  StoreState,
} from '../../types';
import { maybeUploadMediaToMediaStore } from '../../services/file-upload';
import { getSetViewedMemberPictureAction } from '../actions';
import {
  emitProfileEditBIEvents,
  scheduleViewedMemberSync,
  clearInitialDataCache,
  toggleIsProfileSaving,
  toggleProfileSavedNotification,
} from './common';

interface UpdateProfilePictureOptions {
  dispatch: ThunkDispatch;
  state: StoreState;
  options: ImageChangeOptions;
  extra: ThunkExtra;
}

const getUpdatedFields = async (
  { name, imageUrl }: ImageChangeOptions,
  services: ThunkExtra,
) => {
  const editPicture = { name, file: imageUrl };
  return maybeUploadMediaToMediaStore({ services, editPicture });
};

const updateProfilePicture = async ({
  dispatch,
  state: { users },
  options,
  extra,
}: UpdateProfilePictureOptions) => {
  const { uid } = users.viewed;
  const { membersService } = extra;

  const updatedFields = await getUpdatedFields(options, extra);
  const picture = updatedFields.picture as MediaPlatformImage;

  dispatch(getSetViewedMemberPictureAction(picture));
  await membersService.partialMemberUpdate(uid, updatedFields);
  scheduleViewedMemberSync(extra);

  return updatedFields;
};

export const setMemberPicture: ThunkWithArgs<ImageChangeOptions> =
  (options) => async (dispatch, getState, extra) => {
    const state = getState();
    const updateOptions = { dispatch, state, options, extra };
    toggleIsProfileSaving(dispatch, extra);

    const updatedFields = await updateProfilePicture(updateOptions);
    toggleIsProfileSaving(dispatch, extra);
    emitProfileEditBIEvents(state, updatedFields, extra);
    clearInitialDataCache(state, extra);
    toggleProfileSavedNotification(extra);
  };
