import { ImageService } from '@wix/members-area-commons-ts';
import { MediaPlatformImage } from '@wix/members-domain-ts';

import { CoverPosition, EditCover, Nullable, ProfileLayout } from '../types';

interface WithCover {
  cover: Nullable<string | MediaPlatformImage>;
}

interface GetImagePropertiesOptions {
  profileLayout?: ProfileLayout;
  isMobile: boolean;
  isFullWidth: boolean;
  reducedQuality: boolean;
}

interface GetCoverUrlOptions {
  member: WithCover;
  imageProps: { rw: number; rh: number; quality: number };
  defaultCoverUrl: string | null;
  isCoverRepositionMode: boolean;
  editCover?: EditCover;
}

interface GetCoverPositionOptions {
  member: WithCover;
  editCover?: EditCover;
}

interface GetCoverImageStyleOptions {
  coverUrl: string | null;
  member: WithCover;
  editCover?: EditCover;
  withCoverReposition?: boolean;
}

interface GetUpdatedCoverPositionOptions {
  member: WithCover;
  editCover?: EditCover;
  coverWidth: number;
  movement: CoverPosition;
  isMobile: boolean;
}

const COVER_MAX_WIDTH = {
  FULL_WIDTH: 2000,
  HORIZONTAL: 2000,
  VERTICAL: 650,
  MOBILE: 500,
};

export const getImageProperties = ({
  profileLayout,
  isMobile,
  isFullWidth,
  reducedQuality,
}: GetImagePropertiesOptions) => {
  const scaling = reducedQuality ? 0.1 : 1;
  const rh = 4000 * scaling;
  const quality = reducedQuality ? 40 : 90;
  const isVerticalLayout = profileLayout === ProfileLayout.Card;
  const rw =
    (isMobile
      ? COVER_MAX_WIDTH.MOBILE
      : isFullWidth
      ? COVER_MAX_WIDTH.FULL_WIDTH
      : isVerticalLayout
      ? COVER_MAX_WIDTH.VERTICAL
      : COVER_MAX_WIDTH.HORIZONTAL) * scaling;

  return {
    rw,
    rh,
    quality,
  };
};

const getFullCoverUrl = (
  fileName: string,
  maxWidth: number,
  maxHeight: number,
  quality: number,
) =>
  `https://static.wixstatic.com/media/${fileName}/v1/fit/w_${maxWidth},h_${maxHeight},q_${quality}/image.jpg`;

export const getCoverUrl = ({
  member,
  editCover,
  defaultCoverUrl,
  imageProps,
  isCoverRepositionMode,
}: GetCoverUrlOptions) => {
  if (editCover?.file) {
    return editCover?.file;
  }

  if (member.cover && !isCoverRepositionMode) {
    return typeof member.cover === 'object'
      ? member.cover?.file_name
      : member.cover;
  }

  const imageService = new ImageService();

  if (member.cover) {
    return imageService.getImageUrl({
      image: member.cover,
      rw: imageProps.rw,
      rh: imageProps.rh,
      quality: imageProps.quality,
    });
  }

  if (defaultCoverUrl) {
    return getFullCoverUrl(
      defaultCoverUrl,
      imageProps.rw,
      imageProps.rh,
      imageProps.quality,
    );
  }

  return null;
};

export const getCoverPosition = ({
  member,
  editCover,
}: GetCoverPositionOptions) => {
  const offsetX =
    editCover?.position?.x ??
    (member.cover as MediaPlatformImage)?.offset_x ??
    50;
  const offsetY =
    editCover?.position?.y ??
    (member.cover as MediaPlatformImage)?.offset_y ??
    50;

  return {
    x: offsetX,
    y: offsetY,
  };
};

export const getCoverImageStyle = ({
  coverUrl,
  member,
  editCover,
  withCoverReposition = true,
}: GetCoverImageStyleOptions) => {
  const { x, y } = withCoverReposition
    ? getCoverPosition({ member, editCover })
    : { x: 50, y: 50 };

  return coverUrl
    ? {
        backgroundImage: `url('${coverUrl}')`,
        backgroundPositionX: `${x}%`,
        backgroundPositionY: `${y}%`,
      }
    : null;
};

export const getUpdatedCoverPosition = ({
  member,
  editCover,
  coverWidth,
  movement,
  isMobile,
}: GetUpdatedCoverPositionOptions) => {
  const coverHeight = isMobile ? 108 : 250;

  const deltaX = (movement.x / coverWidth) * 100;
  const deltaY = (movement.y / coverHeight) * 100;

  const currentX =
    editCover?.position?.x ??
    (member.cover as MediaPlatformImage)?.offset_x ??
    50;
  const currentY =
    editCover?.position?.y ??
    (member.cover as MediaPlatformImage)?.offset_y ??
    50;

  const newX = Math.max(Math.min(currentX - deltaX, 100), 0);
  const newY = Math.max(Math.min(currentY - deltaY, 100), 0);

  return { x: newX, y: newY };
};
