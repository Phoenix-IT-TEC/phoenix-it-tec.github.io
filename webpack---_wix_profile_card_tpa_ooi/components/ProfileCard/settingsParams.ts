import {
  createSettingsParams,
  SettingsParamType,
  createSettingsParam,
} from '@wix/tpa-settings';

export type ISettingsParams = {
  showCoverPhoto: SettingsParamType.Boolean;
  showCoverPhotoDesktop: SettingsParamType.Boolean;
  showFollowButton: SettingsParamType.Boolean;
  showRoleLabel: SettingsParamType.Boolean;
  followButtonText: SettingsParamType.String;
  followingButtonText: SettingsParamType.String;
  messageButtonText: SettingsParamType.String;
  followingCountersText: SettingsParamType.String;
  followersCountersText: SettingsParamType.String;
};

const showCoverPhoto = createSettingsParam('showCoverPhoto', {
  type: SettingsParamType.Boolean,
  getDefaultValue: () => true,
});

export default createSettingsParams<ISettingsParams>({
  showCoverPhoto,
  showCoverPhotoDesktop: {
    type: SettingsParamType.Boolean,
    key: 'pw-show-cover-photo-desktop',
    dangerousKeyTransformationOverride: () => 'pw-show-cover-photo-desktop',
    getDefaultValue: ({ getSettingParamValue }) => {
      const showCoverPhotoFallback = getSettingParamValue(showCoverPhoto);
      return showCoverPhotoFallback === undefined
        ? true
        : showCoverPhotoFallback;
    },
  },
  showFollowButton: {
    type: SettingsParamType.Boolean,
    getDefaultValue: () => true,
  },
  showRoleLabel: {
    type: SettingsParamType.Boolean,
    getDefaultValue: () => true,
  },
  followButtonText: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) => t('profile-widget.follow'),
  },
  followingButtonText: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) => t('profile-widget.unfollow'),
  },
  messageButtonText: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) => t('profile-widget.message'),
  },
  followingCountersText: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) => t('profile-widget.following'),
  },
  followersCountersText: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) => t('profile-widget.followers'),
  },
});
