import { CoverPosition, ImageChangeOptions, Nullable } from '../../types';
import profilePageSlice from '../slices/profile-page-slice';

export const getToggleIsSavingProfileAction = () =>
  profilePageSlice.actions.toggleIsSavingProfile(null);

export const getToggleIsEditingProfileAction = () =>
  profilePageSlice.actions.toggleIsEditingProfile(null);

export const getToggleIsCoverLoadingAction = () =>
  profilePageSlice.actions.toggleIsCoverLoading(null);

export const getToggleIsCoverRepositionModeAction = () =>
  profilePageSlice.actions.toggleIsCoverRepositionMode(null);

export const getStopEditingProfileAction = (
  editName: Nullable<string>,
  editTitle: Nullable<string>,
) => profilePageSlice.actions.stopEditingProfile({ editName, editTitle });

export const getSetEditNameAction = (editName: string) =>
  profilePageSlice.actions.setEditName({ editName });

export const getSetEditTitleAction = (editTitle: string) =>
  profilePageSlice.actions.setEditTitle({ editTitle });

export const getSetEditPictureAction = (
  options: Nullable<ImageChangeOptions>,
) => profilePageSlice.actions.setEditPicture(options);

export const getSetEditCoverAction = (options: Nullable<ImageChangeOptions>) =>
  profilePageSlice.actions.setEditCover(options);

export const getSetEditCoverPositionAction = (position?: CoverPosition) =>
  profilePageSlice.actions.setEditCoverPosition({ position });

export const getSetIsProfilePreviewAction = (isProfilePreview: boolean) =>
  profilePageSlice.actions.setIsProfilePreview({ isProfilePreview });
