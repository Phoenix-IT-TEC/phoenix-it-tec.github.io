import type { Profile } from '@wix/ambassador-members-v1-member/types';

import type {
  ImageChangeOptions,
  Nullable,
  StoreState,
  Thunk,
  ThunkExtra,
  ThunkWithArgs,
  PublicMemberInfoUpdateOptions,
  ThunkDispatch,
} from '../../types';
import { myAccountAppDefinitionId } from '../../constants/app-definition-id';
import { myAccountPageId } from '../../constants/section-id';
import { ToastType } from '../../constants/toast';
import {
  getSetEditCoverAction,
  getSetEditNameAction,
  getSetEditPictureAction,
  getSetEditTitleAction,
  getSetViewedMemberDetails,
  getSetCurrentMemberDetails,
  getStopEditingProfileAction,
  getToggleIsCoverLoadingAction,
  getToggleIsCoverRepositionModeAction,
  getShowToastAction,
} from '../actions';
import { getCanEdit } from '../selectors';

import { Applications } from '../../services/public-api-store';
import { MY_ACCOUNT_PAGE_WIDGET_ID } from '../../constants/widgets-ids';

interface UpdateMemberDetailsOptions {
  state: StoreState;
  profile: Profile;
  dispatch: ThunkDispatch;
}

export const enterCoverRepositionMode = () => {
  return getToggleIsCoverRepositionModeAction();
};

const navigateToMyAccount = async (
  { users, site }: StoreState,
  { getPublicAPI }: ThunkExtra,
) => {
  const membersAreaAPI = await getPublicAPI(Applications.MembersArea);
  const { uid, slug } = users.viewed;

  return membersAreaAPI?.navigateToSection({
    appDefinitionId: myAccountAppDefinitionId,
    sectionId: myAccountPageId,
    memberId: slug || uid,
    widgetId: MY_ACCOUNT_PAGE_WIDGET_ID,
  });
};

const updateMemberDetailsInState = ({
  state,
  profile,
  dispatch,
}: UpdateMemberDetailsOptions) => {
  const canEdit = getCanEdit(state);

  const memberDetails = {
    name: profile.nickname ?? '',
    title: profile.title ?? '',
  };

  if (state.users.current) {
    dispatch(getSetCurrentMemberDetails(memberDetails));
  }

  if (canEdit) {
    dispatch(getSetViewedMemberDetails(memberDetails));
  }
};

export const toggleIsEditingProfile: Thunk =
  () => (dispatch, getState, extra) =>
    navigateToMyAccount(getState(), extra);

export const stopEditingProfile: Thunk = () => (dispatch, getState) => {
  const { users } = getState();
  const { viewed } = users;

  dispatch(getStopEditingProfileAction(viewed.name, viewed.title ?? null));
};

export const setEditName = (editName: string) => getSetEditNameAction(editName);

export const setEditTitle = (editTitle: string) =>
  getSetEditTitleAction(editTitle);

export const setEditPicture = (options: ImageChangeOptions) =>
  getSetEditPictureAction(options);

export const setEditCover: ThunkWithArgs<Nullable<ImageChangeOptions>> =
  (options) => (dispatch) => {
    dispatch(getToggleIsCoverLoadingAction());
    dispatch(getSetEditCoverAction(options));
    dispatch(getToggleIsCoverLoadingAction());
  };

export const updateProfileDisplayInfo: ThunkWithArgs<
  PublicMemberInfoUpdateOptions
> =
  (payload) =>
  async (dispatch, getState, { membersService }) => {
    try {
      const { member } = await membersService.updateMemberPublicInfo(payload);

      updateMemberDetailsInState({
        state: getState(),
        profile: member?.profile ?? {},
        dispatch,
      });

      dispatch(getShowToastAction(ToastType.ProfileDisplayInfoUpdated));
    } catch {
      dispatch(getShowToastAction(ToastType.ErrorSavingProfileDisplayInfo));
    }
  };
