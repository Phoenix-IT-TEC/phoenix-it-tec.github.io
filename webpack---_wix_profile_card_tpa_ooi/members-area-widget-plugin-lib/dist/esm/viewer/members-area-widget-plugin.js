import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { PubSub } from './pub-sub';
export class MembersAreaWidgetPluginService {
  constructor() {
    _defineProperty(this, "isWidgetPlugin", false);
    _defineProperty(this, "members", null);
    _defineProperty(this, "membersWereSet", false);
    _defineProperty(this, "visibleWidgetId", '');
    _defineProperty(this, "isRendered", false);
    _defineProperty(this, "membersPubSub", new PubSub());
    _defineProperty(this, "eventPubSub", new PubSub());
  }
  async getMembers() {
    if (this.membersWereSet || !this.isWidgetPlugin) {
      return this.members;
    }
    return new Promise(resolve => this.membersPubSub.addListener(resolve));
  }
  setMembers(members) {
    this.members = members;
    this.membersWereSet = true;
    this.membersPubSub.notifyListeners(members);
  }
  onMembersAreaEvent(listener) {
    if (this.isWidgetPlugin) {
      this.eventPubSub.addListener(listener);
    }
  }
  notifyMembersAreaEventListeners(event) {
    if (this.isWidgetPlugin) {
      this.eventPubSub.notifyListeners(event);
    }
  }
  getIsWidgetPlugin() {
    return this.isWidgetPlugin;
  }
  setIsWidgetPlugin(isWidgetPlugin) {
    this.isWidgetPlugin = isWidgetPlugin;
  }
  getVisibleWidgetId() {
    return this.visibleWidgetId;
  }
  setVisibleWidgetId(tabId) {
    this.visibleWidgetId = tabId;
  }
  getIsRendered() {
    if (!this.isWidgetPlugin) {
      return true;
    }
    return this.isRendered;
  }
  setIsRendered(isRendered) {
    this.isRendered = isRendered;
  }
  reset() {
    this.isWidgetPlugin = false;
    this.membersWereSet = false;
    this.members = null;
    this.visibleWidgetId = '';
    this.isRendered = false;
    this.membersPubSub.purge();
    this.eventPubSub.purge();
  }
}
//# sourceMappingURL=members-area-widget-plugin.js.map