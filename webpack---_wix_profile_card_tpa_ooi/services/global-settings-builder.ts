import { Builder, InjectedGlobalSettings, Nullable } from '../types';

class GlobalSettingsBuilder implements Builder<InjectedGlobalSettings> {
  private showFollowers = false;
  private showMemberTitle: Nullable<boolean> = null;
  private showFollowersMobile = false;
  private defaultProfileCoverUrl: Nullable<string> = null;

  build = (): InjectedGlobalSettings => ({
    showFollowers: this.showFollowers,
    showFollowersMobile: this.showFollowersMobile,
    defaultProfileCoverUrl: this.defaultProfileCoverUrl,
    showMemberTitle: this.showMemberTitle,
  });

  withShowFollowers = (showFollowers: boolean) => {
    this.showFollowers = showFollowers;
    return this;
  };

  withShowMemberTitle = (showMemberTitle: Nullable<boolean>) => {
    this.showMemberTitle = showMemberTitle;
    return this;
  };
}

export default GlobalSettingsBuilder;
