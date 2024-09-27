import { ImageChangeOptions, ThunkWithArgs } from '../../types';
import {
  clearInitialDataCache,
  emitProfileEditBIEvents,
  scheduleViewedMemberSync,
  toggleIsProfileSaving,
  toggleProfileSavedNotification,
} from './common';
import { maybeUploadMediaToMediaStore } from '../../services/file-upload';
import { MediaPlatformImage } from '@wix/members-domain-ts';
import {
  getSetEditCoverAction,
  getSetViewedMemberCoverAction,
} from '../actions';
import { setEditCover } from './profile-page';

export const saveCoverPhoto: ThunkWithArgs<ImageChangeOptions> =
  (image) => async (dispatch, getState, extra) => {
    const state = getState();
    setEditCover(image)(dispatch, getState, extra);

    if (image) {
      toggleIsProfileSaving(dispatch, extra);
      const updatedFields = await maybeUploadMediaToMediaStore({
        editCover: { file: image.imageUrl, name: image.name },
        services: extra,
        defaultCover: state.users.viewed.cover as MediaPlatformImage,
      });
      const updatedCover = updatedFields.cover as MediaPlatformImage;
      await extra.membersService.partialMemberUpdate(
        state.users.viewed.uid,
        updatedFields,
      );
      scheduleViewedMemberSync(extra);
      dispatch(getSetViewedMemberCoverAction(updatedCover));
      dispatch(getSetEditCoverAction(null));

      toggleIsProfileSaving(dispatch, extra);
      emitProfileEditBIEvents(state, updatedFields, extra);
      toggleProfileSavedNotification(extra);
      clearInitialDataCache(state, extra);
    }
  };
