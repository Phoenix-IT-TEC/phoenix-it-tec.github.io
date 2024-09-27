import { actionButtonClicked } from '@wix/bi-logger-members-app-uou/v2';
import {
  IFrameEvent,
  Interaction,
  ProfileActionType,
  ProfileChangeEvent,
  Thunk,
  ThunkDispatch,
  ThunkExtra,
} from '../../types';
import { Applications } from '../../services/public-api-store';
import {
  openInfoNotification,
  openProfilePreviewNotification,
} from '../../services/modal';
import { getSetIsProfilePreviewAction } from '../actions';
import { RootState } from '../root-reducer';
import { notifyProfileChangeObservers } from './common';
import { getCommonBIEventProps } from '../../services/bi-event';

const toggleProfilePreviewInMenu = async (
  getPublicAPI: ThunkExtra['getPublicAPI'],
  shouldEnterPreview: boolean,
) => {
  const membersAreaAPI = await getPublicAPI(Applications.MembersArea);
  return shouldEnterPreview
    ? membersAreaAPI?.enterPublicProfilePreviewMode()
    : membersAreaAPI?.leavePublicProfilePreviewMode();
};

const openPublicProfilePreviewNotification = (
  dispatch: ThunkDispatch,
  getState: () => RootState,
  extra: ThunkExtra,
) => {
  const {
    compId,
    metaData,
    biLogger,
    flowAPI,
    wixCodeApi,
    platformAPIs,
    dataSyncService,
    getPublicAPI,
    experiments,
  } = extra;

  const onNotificationClose = async () => {
    biLogger?.report(
      actionButtonClicked({
        ...getCommonBIEventProps(flowAPI, getState(), metaData),
        action_type: ProfileActionType.EXIT_VIEW_PUBLIC_PROFILE,
      }),
    );
    await toggleProfilePreviewInMenu(getPublicAPI, false);
    dataSyncService.addIFrameEvent(IFrameEvent.LeavePublicProfilePreview);
    notifyProfileChangeObservers(extra, {
      event: ProfileChangeEvent.PublicProfilePreviewChanged,
      isPublicProfilePreview: false,
    });
    dispatch(getSetIsProfilePreviewAction(false));
  };

  openProfilePreviewNotification({
    compId,
    wixCodeApi,
    platformAPIs,
    experiments,
    isPublic: true,
    isMobile: flowAPI.environment.isMobile,
    onClose: onNotificationClose,
  });
};

export const togglePublicProfilePreview: Thunk =
  () => async (dispatch, getState, extra) => {
    const {
      getPublicAPI,
      dataSyncService,
      monitoringService,
      biLogger,
      flowAPI,
      metaData,
    } = extra;

    const handlePublicProfileToggle = async () => {
      await toggleProfilePreviewInMenu(getPublicAPI, true);
      dataSyncService.addIFrameEvent(IFrameEvent.EnterPublicProfilePreview);
      dispatch(getSetIsProfilePreviewAction(true));
      openPublicProfilePreviewNotification(dispatch, getState, extra);
      notifyProfileChangeObservers(extra, {
        event: ProfileChangeEvent.PublicProfilePreviewChanged,
        isPublicProfilePreview: true,
      });
      biLogger?.report(
        actionButtonClicked({
          ...getCommonBIEventProps(flowAPI, getState(), metaData),
          action_type: ProfileActionType.VIEW_PUBLIC_PROFILE,
        }),
      );
    };

    await monitoringService.toMonitored(
      Interaction.EnterPublicProfilePreview,
      handlePublicProfileToggle(),
    );
  };

export const openPrivateProfilePreviewNotification: Thunk =
  () =>
  async (_, __, { compId, flowAPI, wixCodeApi, platformAPIs, experiments }) => {
    openProfilePreviewNotification({
      compId,
      wixCodeApi,
      platformAPIs,
      experiments,
      isPublic: false,
      isMobile: flowAPI.environment.isMobile,
    });
  };

export const openPrivatePagePreviewNotification: Thunk =
  () =>
  async (_, __, { compId, flowAPI, wixCodeApi, platformAPIs, experiments }) => {
    openInfoNotification({
      compId,
      wixCodeApi,
      platformAPIs,
      experiments,
      isPublic: false,
      isMobile: flowAPI.environment.isMobile,
      options: {
        translationKey: 'about-page.private-profile-toast',
        autoClose: false,
        fullWidth: true,
      },
    });
  };
