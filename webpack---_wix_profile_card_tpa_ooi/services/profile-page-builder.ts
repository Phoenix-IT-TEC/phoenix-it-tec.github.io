import {
  Builder,
  EditCover,
  EditPicture,
  InjectedProfilePage,
  Nullable,
} from '../types';

class ProfilePageBuilder implements Builder<InjectedProfilePage> {
  private editName: Nullable<string> = null;
  private editTitle: Nullable<string> = null;
  private editCover: EditCover = null;
  private editPicture: EditPicture = null;
  private isSaving = false;
  private isEditing = false;
  private isCoverLoading = false;
  private isCoverRepositionMode = false;
  private isProfilePreview = false;

  build = (): InjectedProfilePage => ({
    editName: this.editName,
    editTitle: this.editTitle,
    editCover: this.editCover,
    editPicture: this.editPicture,
    isSaving: this.isSaving,
    isEditing: this.isEditing,
    isCoverLoading: this.isCoverLoading,
    isCoverRepositionMode: this.isCoverRepositionMode,
    isProfilePreview: this.isProfilePreview,
  });

  withEditName = (editName: Nullable<string>) => {
    this.editName = editName;
    return this;
  };

  withEditPicture = (editPicture: EditPicture) => {
    this.editPicture = editPicture;
    return this;
  };

  withEditCover = (editCover: EditCover) => {
    this.editCover = editCover;
    return this;
  };

  withIsEditing = (isEditing: boolean) => {
    this.isEditing = isEditing;
    return this;
  };

  withIsCoverRepositionMode = (isCoverRepositionMode: boolean) => {
    this.isCoverRepositionMode = isCoverRepositionMode;
    return this;
  };
}

export default ProfilePageBuilder;
