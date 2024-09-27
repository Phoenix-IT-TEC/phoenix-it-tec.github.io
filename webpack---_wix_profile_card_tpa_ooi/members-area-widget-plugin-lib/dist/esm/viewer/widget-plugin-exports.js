export function createWidgetPluginExports(widgetPluginService, pageReady) {
  return {
    set isWidgetPlugin(value) {
      widgetPluginService.setIsWidgetPlugin(value);
    },
    set members(value) {
      widgetPluginService.setMembers(value);
    },
    set visibleWidgetId(visibleWidgetId) {
      widgetPluginService.setVisibleWidgetId(visibleWidgetId);
    },
    set isRendered(isRendered) {
      widgetPluginService.setIsRendered(isRendered);
    },
    get isRendered() {
      return widgetPluginService.getIsRendered();
    },
    onMembersAreaEvent(event) {
      widgetPluginService.notifyMembersAreaEventListeners(event);
    },
    membersAreaWidgetReady() {
      return pageReady();
    }
  };
}
//# sourceMappingURL=widget-plugin-exports.js.map