import {
  ProfileChangePayload,
  StoreState,
  ThunkDispatch,
  ThunkExtra,
  PartialUpdatableFields,
} from '../../types';
import {
  emitProfileEditedBIEvent,
  emitAuthorEditedBIEvent,
} from '../../services/bi-event';
import { WidgetEvent } from '../../services/data-sync-service';
import { openProfileSavedNotification } from '../../services/modal';
import { getToggleIsSavingProfileAction } from '../actions';
import { isBlogWriterOrEditor } from '../selectors';

export const toggleIsProfileSaving = (
  dispatch: ThunkDispatch,
  { dataSyncService }: ThunkExtra,
) => {
  const action = getToggleIsSavingProfileAction();

  dispatch(action);
  dataSyncService.emitEvent(action);
};

export const scheduleViewedMemberSync = ({ dataSyncService }: ThunkExtra) => {
  dataSyncService.scheduleEvent(WidgetEvent.SetViewedMember);
};

export const emitProfileEditBIEvents = (
  state: StoreState,
  updatedFields: PartialUpdatableFields,
  extra: ThunkExtra,
) => {
  emitProfileEditedBIEvent(state, updatedFields, extra);

  if (isBlogWriterOrEditor(state)) {
    emitAuthorEditedBIEvent(state, updatedFields, extra);
  }
};

export const toggleProfileSavedNotification = ({
  compId,
  flowAPI,
  wixCodeApi,
  experiments,
}: ThunkExtra) => {
  openProfileSavedNotification({
    compId,
    wixCodeApi,
    experiments,
    isMobile: flowAPI.environment.isMobile,
  });
};

export const clearInitialDataCache = (
  state: StoreState,
  { initialDataFetchService }: ThunkExtra,
) => {
  const { current, viewed } = state.users;
  initialDataFetchService.clearCache(current?.uid ?? null, viewed?.uid ?? null);
};

export const notifyProfileChangeObservers = (
  { profileSubject }: ThunkExtra,
  event: ProfileChangePayload,
) => {
  if (profileSubject) {
    profileSubject.notifyObservers(event);
  }
};
