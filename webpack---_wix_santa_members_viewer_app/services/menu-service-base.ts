import { makeObservable, observable } from 'mobx';

import type {
  MenuItem,
  RouteConfiguration,
  I$WWrapper,
  StateService as IStateService,
  MenuServiceBase as IMenuServiceBase,
  Experiments,
  MenuContext,
} from '../types';

import { Experiment, APP_WIDGET_LOGIN_MENU_ID } from '../constants';

import { getLoginBarMenu } from '../utils/login-bar-menu';

const getInitialMenuItems = ($w: I$WWrapper) => getLoginBarMenu($w).menuItems;

const findRouteByMenuItem = (routes: RouteConfiguration[], item: MenuItem) =>
  routes.find((route) => item.link?.includes(route.path));

const getIsTabAccessibleWithUserRoles = (
  currentUserRoles: string[],
  visibleForRoles: string[],
) => {
  if (!visibleForRoles.length) {
    return true;
  }

  return currentUserRoles.some((role) => visibleForRoles.includes(role));
};

export default class MenuServiceBase<
  T extends MenuContext = MenuContext,
  K extends IStateService = IStateService,
> implements IMenuServiceBase
{
  menuItems: MenuItem[];
  protected menuContext!: T;

  constructor(
    private readonly $w: I$WWrapper,
    private stateService: K,
    private experiments: Experiments,
  ) {
    this.menuItems = getInitialMenuItems(this.$w);
    makeObservable<this, keyof IMenuServiceBase>(this, {
      menuItems: observable,
    });
  }

  protected setNotificationsCount() {
    const isEnabled = this.experiments.enabled(Experiment.EnableNotifications);
    if (!isEnabled) {
      return;
    }
    const notificationsCounter =
      this.stateService.notificationsCounter?.counters?.find(
        (counter) => counter.key === 'notificationsCount',
      );
    const displayCount = notificationsCounter?.count;
    const appWidgetsLoginMenus: MenuItem[] = this.$w(APP_WIDGET_LOGIN_MENU_ID);
    appWidgetsLoginMenus.forEach((widget) => {
      if (widget.navBarItems?.length) {
        widget.navBarItems = [{ ...widget.navBarItems[0], displayCount }];
      }
    });
  }

  protected bindMenuItems() {
    this.$w(APP_WIDGET_LOGIN_MENU_ID).menuItems = this.menuItems;
  }

  protected filterMenuItemsVisibleForRoles() {
    const { routes } = this.menuContext;
    const { currentUserRoles } = this.menuContext;

    this.menuItems = this.menuItems.filter((item) => {
      const routeConfig = findRouteByMenuItem(routes, item);
      if (!routeConfig?.vfr?.length) {
        return true;
      }
      return getIsTabAccessibleWithUserRoles(currentUserRoles, routeConfig.vfr);
    });
  }
}
