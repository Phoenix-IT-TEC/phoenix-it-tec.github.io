import { Builder, InjectedSite } from '../types';

class SiteBuilder implements Builder<InjectedSite> {
  private settingsTab = null;
  private settingsTabMenuItem = null;
  private installedApps = {};
  private installedMAVersion = '' as never;
  private isSocial = false;
  private isSocialChat = false;
  private isWidgetPlugin = false;
  private visibleWidgetId = '';

  build = (): InjectedSite => ({
    settingsTab: this.settingsTab,
    settingsTabMenuItem: this.settingsTabMenuItem,
    installedApps: this.installedApps,
    installedMAVersion: this.installedMAVersion,
    isSocial: this.isSocial,
    isSocialChat: this.isSocialChat,
    isWidgetPlugin: this.isWidgetPlugin,
    visibleWidgetId: this.visibleWidgetId,
  });

  withIsSocial = (isSocial: boolean) => {
    this.isSocial = isSocial;
    return this;
  };

  withIsSocialChat = (isSocialChat: boolean) => {
    this.isSocialChat = isSocialChat;
    return this;
  };
}

export default SiteBuilder;
