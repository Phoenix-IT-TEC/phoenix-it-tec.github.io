import { PublicRouterService } from './public-router';
export function routerDataServiceFactory(widgetPluginService, wixUserAPI, wixWindowAPI) {
  const getRouteData = () => {
    const isWidgetPlugin = widgetPluginService.getIsWidgetPlugin();
    if (isWidgetPlugin) {
      return widgetPluginService.getMembers();
    }
    const routerService = new PublicRouterService(wixUserAPI, wixWindowAPI);
    return routerService.getRouteData();
  };
  return {
    getRouteData
  };
}
//# sourceMappingURL=route-data.js.map