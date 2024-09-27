import { MediaPlatformImage } from '@wix/members-domain-ts';

import { EditCover, EditPicture } from '../types';
import MembersService from './members-service';
import MediaService from './media-service';

interface Picture {
  name?: string;
  dataUrl?: string;
}

interface Services {
  membersService: MembersService;
  mediaService: MediaService;
}

interface UploadPictureToMediaStoreOptions {
  services: Services;
  picture: Picture;
  pictureModifiers?: Pick<MediaPlatformImage, 'offset_x' | 'offset_y'>;
  defaultPicture?: MediaPlatformImage;
}

interface MaybeUploadMediaToMediaStoreOptions {
  services: Services;
  defaultCover?: MediaPlatformImage;
  editCover?: EditCover;
  editPicture?: EditPicture;
}

interface MediaPlatformPictures {
  cover?: MediaPlatformImage;
  picture?: MediaPlatformImage;
}

const DEFAULT_OFFSET = { offset_x: 50, offset_y: 50 };

const uploadPictureToMediaStore = async ({
  services: { membersService, mediaService },
  picture,
  pictureModifiers,
  defaultPicture,
}: UploadPictureToMediaStoreOptions) => {
  const credentials = await membersService.getMediaPlatformCredentials();
  let mediaPicture = defaultPicture as MediaPlatformImage;

  if (picture.name && picture.dataUrl) {
    mediaPicture = await mediaService.uploadPicture({
      ...credentials,
      fileName: picture.name,
      fileDataUrl: picture.dataUrl,
    });
  }

  await membersService.setMediaPlatformPictureDetails({
    ...mediaPicture,
    ...(!!pictureModifiers && pictureModifiers),
  });

  return mediaPicture;
};

export const maybeUploadMediaToMediaStore = async ({
  defaultCover,
  editCover,
  editPicture,
  services: { membersService, mediaService },
}: MaybeUploadMediaToMediaStoreOptions) => {
  const promises: Promise<MediaPlatformPictures>[] = [];

  if (editPicture) {
    promises.push(
      uploadPictureToMediaStore({
        services: { membersService, mediaService },
        picture: { name: editPicture.name, dataUrl: editPicture.file },
      }).then((file) => ({ picture: file })),
    );
  }

  if (editCover) {
    const pictureModifiers = editCover.position
      ? {
          offset_x: Math.round(editCover.position.x),
          offset_y: Math.round(editCover.position.y),
        }
      : DEFAULT_OFFSET;

    promises.push(
      uploadPictureToMediaStore({
        services: { membersService, mediaService },
        defaultPicture: defaultCover,
        picture: { name: editCover.name, dataUrl: editCover.file },
        pictureModifiers,
      }).then((file) => ({ cover: { ...file, ...pictureModifiers } })),
    );
  }

  const response = await Promise.all(promises);

  return response.reduce(
    (previousValue, currentValue) => ({ ...previousValue, ...currentValue }),
    {},
  );
};
