import { CreateControllerFn } from '@wix/yoshi-flow-editor';
import { createWidgetPluginExports } from '@wix/members-area-widget-plugin-lib/viewer';
import {
  setComponentSettings,
  setSitePresets,
} from '../../services/controller-utils';
import {
  getControllerContext,
  initialiseProfileCard,
} from './controller-utils';

const noop = () => Promise.resolve();

const createController: CreateControllerFn = async (controllerProps) => {
  const context = getControllerContext(controllerProps);
  const { store, settingsListener, dataSyncService, profileSubject, services } =
    context;

  return {
    async pageReady() {
      await initialiseProfileCard(context);
    },
    updateConfig(_, { style, publicData }) {
      settingsListener.notify(publicData.COMPONENT || {});

      if (style?.styleParams) {
        const { styleParams, ...sitePresets } = style;
        setComponentSettings(store, style.styleParams);
        setSitePresets(store, sitePresets);
      }
    },
    onBeforeUnLoad() {
      dataSyncService.unregisterListeners();

      if (profileSubject) {
        profileSubject.unregisterObservers();
      }
    },
    exports() {
      return createWidgetPluginExports(services.widgetPluginService, noop);
    },
  };
};

export default createController;
