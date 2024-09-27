import { createSlice } from '@reduxjs/toolkit';

import {
  Nullable,
  Reducer,
  InjectedProfilePage,
  ImageChangeOptions,
  CoverPosition,
} from '../../types';
import ProfilePageBuilder from '../../services/profile-page-builder';

type SetEditNamePayload = Pick<InjectedProfilePage, 'editName'>;

type SetEditTitlePayload = Pick<InjectedProfilePage, 'editTitle'>;

type StopEditingProfilePayload = SetEditNamePayload & SetEditTitlePayload;

type SetIsProfilePreviewPayload = Pick<InjectedProfilePage, 'isProfilePreview'>;

interface SetEditCoverPosition {
  position?: CoverPosition;
}

type ImageSetReducer = Reducer<
  InjectedProfilePage,
  Nullable<ImageChangeOptions>
>;

const name = 'profilePage';

const initialState = new ProfilePageBuilder().build();

const toggleIsSavingProfile: Reducer<InjectedProfilePage> = (state) => ({
  ...state,
  isSaving: !state.isSaving,
});

const toggleIsCoverLoading: Reducer<InjectedProfilePage> = (state) => ({
  ...state,
  isCoverLoading: !state.isCoverLoading,
});

const toggleIsCoverRepositionMode: Reducer<InjectedProfilePage> = (state) => ({
  ...state,
  isCoverRepositionMode: !state.isCoverRepositionMode,
});

const toggleIsEditingProfile: Reducer<InjectedProfilePage> = (state) => ({
  ...state,
  isEditing: !state.isEditing,
});

const stopEditingProfile: Reducer<
  InjectedProfilePage,
  StopEditingProfilePayload
> = (state, { payload }) => ({
  ...state,
  isEditing: false,
  editCover: null,
  editPicture: null,
  editName: payload.editName,
  editTitle: payload.editTitle,
});

const setEditName: Reducer<InjectedProfilePage, SetEditNamePayload> = (
  state,
  { payload },
) => ({ ...state, editName: payload.editName });

const setEditTitle: Reducer<InjectedProfilePage, SetEditTitlePayload> = (
  state,
  { payload },
) => ({ ...state, editTitle: payload.editTitle });

const setEditPicture: ImageSetReducer = (state, { payload }) => ({
  ...state,
  editPicture: payload ? { file: payload.imageUrl, name: payload.name } : null,
});

const setEditCover: ImageSetReducer = (state, { payload }) => ({
  ...state,
  editCover: payload ? { file: payload.imageUrl, name: payload.name } : null,
});

const setEditCoverPosition: Reducer<
  InjectedProfilePage,
  SetEditCoverPosition
> = (state, { payload }) => {
  const { editCover } = state;
  if (!editCover) {
    return { ...state, editCover: { position: payload.position } };
  }

  const cover = { ...editCover };
  cover.position = payload.position;

  return { ...state, editCover: cover };
};

const setIsProfilePreview: Reducer<
  InjectedProfilePage,
  SetIsProfilePreviewPayload
> = (state, { payload }) => ({
  ...state,
  isProfilePreview: payload.isProfilePreview,
});

const reducers = {
  toggleIsSavingProfile,
  toggleIsEditingProfile,
  toggleIsCoverLoading,
  toggleIsCoverRepositionMode,
  stopEditingProfile,
  setEditName,
  setEditTitle,
  setEditPicture,
  setEditCover,
  setEditCoverPosition,
  setIsProfilePreview,
};

const profilePageSlice = createSlice({ name, initialState, reducers });

export default profilePageSlice;
