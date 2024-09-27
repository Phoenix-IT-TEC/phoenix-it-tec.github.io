import { ControllerParams } from '@wix/yoshi-flow-editor';

import { membersAreaAppBaseUrl } from '../constants/urls';
import {
  successMessageNotification,
  profilePreviewNotification,
} from '../constants/modal-type';
import { WixExperiments } from '../types/controller';
import { modalClose, modalConfirm } from '../constants/events';

export enum Notification {
  ProfileSaved = 'profileSaved',
  LeftCommunity = 'leftCommunity',
  JoinedCommunity = 'joinedCommunity',
  MemberBlocked = 'MemberBlocked',
}

type NotificationMap = { [key in Notification]: string };

type PlatformAPIs = ControllerParams['controllerConfig']['platformAPIs'];

type WixCodeApi = ControllerParams['controllerConfig']['wixCodeApi'];

type OnConfirm<T> = (data: T) => void | Promise<void>;

type OnClose = () => void | Promise<void>;

interface PopupOptions {
  width: number | string;
  height: number | string;
  theme: 'BARE';
  position: {
    origin: 'FIXED';
    placement: 'TOP_CENTER' | 'BOTTOM_CENTER' | 'CENTER';
  };
}

interface BasePopupOptions {
  compId: string;
  wixCodeApi: WixCodeApi;
  experiments: WixExperiments;
}

interface OpenPopupOptions extends Omit<BasePopupOptions, 'experiments'> {
  popupUrl: string;
  popupOptions: PopupOptions;
}

interface OpenModalOptions<T> extends BasePopupOptions {
  modalType: string;
  payload: T;
}

interface OpenNotificationOptions extends BasePopupOptions {
  notification: Notification;
  isMobile: boolean;
  queryParams?: Record<string, string>;
}

interface OpenProfilePreviewNotificationOptions extends BasePopupOptions {
  platformAPIs: PlatformAPIs;
  isMobile: boolean;
  isPublic: boolean;
  onClose?: OnClose;
  options?: {
    translationKey: string;
    autoClose?: boolean;
    fullWidth?: boolean;
  };
}

interface OpenModalWithCallbackOptions<T, V> extends OpenModalOptions<T> {
  platformAPIs: PlatformAPIs;
  onConfirm: OnConfirm<V>;
}

export const modalPopupOptions: PopupOptions = {
  width: '100%',
  height: '100%',
  theme: 'BARE',
  position: { origin: 'FIXED', placement: 'CENTER' },
};

const mobileNotificationOptions: PopupOptions = {
  width: '100%',
  height: '100%',
  theme: 'BARE',
  position: { origin: 'FIXED', placement: 'BOTTOM_CENTER' },
};

const desktopNotificationOptions: PopupOptions = {
  width: '450px',
  height: '100%',
  theme: 'BARE',
  position: { origin: 'FIXED', placement: 'TOP_CENTER' },
};

const notificationTranslationsMap: NotificationMap = {
  [Notification.ProfileSaved]: 'profile-widget.saved-message',
  [Notification.JoinedCommunity]: 'community.join.success-message',
  [Notification.LeftCommunity]: 'community.leave.success-message',
  [Notification.MemberBlocked]: 'roles.memberblock.success-message.block',
};

const subscribeToNotificationEvents = (
  pubSub: PlatformAPIs['pubSub'],
  onClose: OnClose,
) => {
  let notificationCloseSubscriptionId = 0;

  const closeAction = () => {
    pubSub.unsubscribe(modalClose, notificationCloseSubscriptionId);
    return onClose();
  };

  notificationCloseSubscriptionId = pubSub.subscribe(
    modalClose,
    closeAction,
    false,
  );
};

const subscribeToModalEvents = <T>(
  pubSub: PlatformAPIs['pubSub'],
  onConfirm: OnConfirm<T>,
) => {
  let modalCloseSubscriptionId = 0;
  let modalConfirmSubscriptionId = 0;

  const unsubscribe = () => {
    pubSub.unsubscribe(modalClose, modalCloseSubscriptionId);
    pubSub.unsubscribe(modalConfirm, modalConfirmSubscriptionId);
  };

  const confirmAction = async (data: T) => {
    unsubscribe();
    await onConfirm(data);
  };

  modalCloseSubscriptionId = pubSub.subscribe(modalClose, unsubscribe, false);
  modalConfirmSubscriptionId = pubSub.subscribe(
    modalConfirm,
    confirmAction,
    false,
  );
};

export const appendQueryParams = <T>(url: string, payload?: T) => {
  const queryParams = new URLSearchParams();
  queryParams.append('isPopup', 'true');
  if (payload) {
    queryParams.append('data', btoa(escape(JSON.stringify(payload))));
  }

  return `${url}?${queryParams.toString()}`;
};

const openPopup = ({
  compId,
  wixCodeApi,
  popupUrl,
  popupOptions,
}: OpenPopupOptions) => {
  return wixCodeApi.window
    .openPopup(popupUrl, popupOptions as any, compId)
    .catch(() => {});
};

export const openModal = <T>({
  compId,
  modalType,
  payload,
  wixCodeApi,
}: OpenModalOptions<T>) => {
  const popupUrl = appendQueryParams(
    `${membersAreaAppBaseUrl}/app/modal/${modalType}`,
    payload,
  );

  openPopup({ compId, wixCodeApi, popupUrl, popupOptions: modalPopupOptions });
};

export const openNotification = ({
  compId,
  notification,
  wixCodeApi,
  isMobile,
  queryParams = {},
}: OpenNotificationOptions) => {
  const translationKey = notificationTranslationsMap[notification];

  const popupUrl = appendQueryParams(
    `${membersAreaAppBaseUrl}/app/modal/${successMessageNotification}`,
    { translationKey, ...queryParams },
  );
  const popupOptions = isMobile
    ? mobileNotificationOptions
    : desktopNotificationOptions;

  openPopup({ compId, wixCodeApi, popupUrl, popupOptions });
};

export const openMemberBlockNotification = ({
  compId,
  wixCodeApi,
  isMobile,
  experiments,
  queryParams,
}: Omit<OpenNotificationOptions, 'notification'>) =>
  openNotification({
    compId,
    wixCodeApi,
    isMobile,
    notification: Notification.MemberBlocked,
    experiments,
    queryParams,
  });

export const openProfileSavedNotification = ({
  compId,
  wixCodeApi,
  isMobile,
  experiments,
}: Omit<OpenNotificationOptions, 'notification'>) =>
  openNotification({
    compId,
    wixCodeApi,
    isMobile,
    notification: Notification.ProfileSaved,
    experiments,
  });

export const openProfilePreviewNotification = ({
  compId,
  wixCodeApi,
  platformAPIs,
  isMobile,
  isPublic,
  onClose,
}: OpenProfilePreviewNotificationOptions) => {
  const popupUrl = appendQueryParams(
    `${membersAreaAppBaseUrl}/app/modal/${profilePreviewNotification}`,
    { isPublic },
  );
  const popupOptions = isMobile
    ? mobileNotificationOptions
    : { ...desktopNotificationOptions, width: isPublic ? '100%' : '475px' };
  const noop = () => {};

  subscribeToNotificationEvents(platformAPIs.pubSub, onClose ?? noop);
  openPopup({
    compId,
    wixCodeApi,
    popupUrl,
    popupOptions,
  });
};

export const openInfoNotification = ({
  compId,
  wixCodeApi,
  isMobile,
  options,
}: OpenProfilePreviewNotificationOptions) => {
  const popupOptions = isMobile
    ? mobileNotificationOptions
    : { ...desktopNotificationOptions, width: '100%' };
  const popupUrl = appendQueryParams(
    `${membersAreaAppBaseUrl}/app/modal/${'info-notification'}`,
    options,
  );
  openPopup({ compId, wixCodeApi, popupUrl, popupOptions });
};

export const openModalWithCallback = <T, V>({
  compId,
  modalType,
  payload,
  platformAPIs,
  wixCodeApi,
  experiments,
  onConfirm,
}: OpenModalWithCallbackOptions<T, V>) => {
  subscribeToModalEvents(platformAPIs.pubSub, onConfirm);
  openModal({ compId, modalType, payload, wixCodeApi, experiments });
};
