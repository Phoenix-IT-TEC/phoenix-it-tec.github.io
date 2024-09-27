import { authorEdited } from '@wix/bi-logger-blog-app-users/v2';
import { profileWidgetEdited } from '@wix/bi-logger-members-app-uou/v2';

import {
  MetaData,
  Nullable,
  PartialUpdatableFields,
  ThunkExtra,
} from '../types';
import { RootState } from '../store/root-reducer';

export const getCommonBIEventProps = (
  { controllerConfig }: ThunkExtra['flowAPI'],
  { site, users }: RootState,
  metaData: Nullable<MetaData>,
) => ({
  app_id: controllerConfig.appParams.appDefinitionId,
  biToken: metaData?.biToken ?? '',
  instance_id: controllerConfig.appParams.instanceId,
  is_social: !!site.isSocial,
  role: users.viewed.roles[0] ?? '',
  _: new Date().getTime(),
});

const isUndefined = <T>(value: T | undefined) => value === undefined;

export const emitProfileEditedBIEvent = (
  state: RootState,
  updatedFields: PartialUpdatableFields,
  { flowAPI, biLogger, metaData }: ThunkExtra,
) =>
  biLogger?.report(
    profileWidgetEdited({
      ...getCommonBIEventProps(flowAPI, state, metaData),
      name_changed: !!updatedFields.name,
      photo_changed: !!updatedFields.picture,
      cover_photo_change: !!updatedFields.cover,
      titleChanged: isUndefined(updatedFields.title),
    }),
  );

const getAuthorEditedBIEventPayload = (
  { users: { viewed } }: RootState,
  updatedFields: PartialUpdatableFields,
) => {
  const newAuthorTitle = updatedFields.title ?? viewed.title;

  return {
    author_id: viewed.uid,
    author_role: viewed.roles[0] ?? '',
    cover_changed: !!updatedFields.cover,
    has_cover: !!viewed.cover,
    has_picture: !!viewed.picture,
    new_author_name: updatedFields.name ?? viewed.name,
    ...(newAuthorTitle && { new_author_title: newAuthorTitle }),
    origin: 'members area profile',
    was_name_changed: !!updatedFields.name,
    was_picture_changed: !!updatedFields.picture,
  };
};

export const emitAuthorEditedBIEvent = (
  state: RootState,
  updatedFields: PartialUpdatableFields,
  { flowAPI, biLogger, metaData }: ThunkExtra,
) => {
  const payload = {
    ...getCommonBIEventProps(flowAPI, state, metaData),
    ...getAuthorEditedBIEventPayload(state, updatedFields),
  };
  return biLogger?.report(authorEdited(payload));
};
