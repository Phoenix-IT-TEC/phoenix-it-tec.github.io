export class PublicRouterService {
  constructor(wixUserAPI, wixWindowAPI) {
    this.wixUserAPI = wixUserAPI;
    this.wixWindowAPI = wixWindowAPI;
  }
  async getRouteData() {
    const currentMemberIdentifier = this.getCurrentMemberIdentifier();
    const viewedMemberIdentifier = this.getViewedMemberIdentifier() ?? currentMemberIdentifier;
    const routerData = {
      currentMemberIdentifier,
      viewedMemberIdentifier
    };
    return routerData;
  }
  getCurrentMemberIdentifier() {
    return this.wixUserAPI.currentUser.loggedIn ? {
      id: this.wixUserAPI.currentUser.id,
      slug: null
    } : null;
  }
  getViewedMemberIdentifier() {
    const routerPublicData = this.wixWindowAPI.getRouterPublicData();
    const viewedUser = routerPublicData == null ? void 0 : routerPublicData.viewedUser;
    return viewedUser ? {
      id: viewedUser.id,
      slug: viewedUser.slug
    } : null;
  }
}
//# sourceMappingURL=public-router.js.map