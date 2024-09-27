
  import {createControllersWithDescriptors, initAppForPageWrapper} from '@wix/yoshi-flow-editor/runtime/esm/viewerScript/wrapper.js';
  
  
            
import wrapController0 from '@wix/yoshi-flow-editor-runtime/internal/viewerScript/platform';

            import controller0 from '/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/complexAddressController/controller.ts';
            import * as _controllerExport0 from '/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/complexAddressController/controller.ts';
            var controllerExport0 = _controllerExport0;
            

            
import wrapController1 from '@wix/yoshi-flow-editor-runtime/internal/viewerScript/platform';

            import controller1 from '/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/complexPhoneController/controller.ts';
            import * as _controllerExport1 from '/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/complexPhoneController/controller.ts';
            var controllerExport1 = _controllerExport1;
            

            
import wrapController2 from '@wix/yoshi-flow-editor-runtime/internal/viewerScript/platform';

            import controller2 from '/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/getSubscribers/controller.ts';
            import * as _controllerExport2 from '/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/getSubscribers/controller.ts';
            var controllerExport2 = _controllerExport2;
            

            
import wrapController3 from '@wix/yoshi-flow-editor-runtime/internal/viewerScript/platform';

            import controller3 from '/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/multiStepForm/controller.ts';
            import * as _controllerExport3 from '/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/multiStepForm/controller.ts';
            var controllerExport3 = _controllerExport3;
            

            
import wrapController4 from '@wix/yoshi-flow-editor-runtime/internal/viewerScript/platform';

            import controller4 from '/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/registrationForm/controller.ts';
            import * as _controllerExport4 from '/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/registrationForm/controller.ts';
            var controllerExport4 = _controllerExport4;
            

            
import wrapController5 from '@wix/yoshi-flow-editor-runtime/internal/viewerScript/platform';

            import controller5 from '/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/wixForms/controller.ts';
            import * as _controllerExport5 from '/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/wixForms/controller.ts';
            var controllerExport5 = _controllerExport5;
            

  
  import * as viewerApp from '/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/viewer.app.ts';
    var importedApp = viewerApp;


  

    var velocycleMobx = null;
    


  

    var blocksControllerService = null;
    

  
var createHttpClient = null;

  
var initI18n = null;

  
const multilingualDisabled = false;

  

    var createExperiments = null;
    var createWidgetExperiments = null;
    


  var sentryConfig = {
      DSN: 'https://6b4c4ea790f34e0db1e7e0e30eeb6a06@sentry.wixpress.com/51',
      id: '6b4c4ea790f34e0db1e7e0e30eeb6a06',
      projectName: 'forms-viewer',
      teamName: 'forms',
      errorMonitor: true,
    };

  var experimentsConfig = {"centralized":true,"scopes":["viewer-apps-14ce1214-b278-a7e4-1373-00cebd1bef7c"]};

  var translationsConfig = {"enabled":false,"icuEnabled":false};

  var defaultTranslations = null;

  var fedopsConfig = null;

  import { createVisitorBILogger as biLogger } from '/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/target/generated/bi/createBILogger.ts';

  export const exports = importedApp.exports;

  export const initAppForPage = initAppForPageWrapper({
    initAppForPage: importedApp.initAppForPage,
    sentryConfig: sentryConfig,
    experimentsConfig: experimentsConfig,
    inEditor: false,
    biLogger: biLogger,
    multilingualDisabled,
    projectName: "forms-viewer",
    biConfig: null,
    appName: "forms-viewer",
    appDefinitionId: "14ce1214-b278-a7e4-1373-00cebd1bef7c",
    fedopsConfig: fedopsConfig,
    translationsConfig: translationsConfig,
    defaultTranslations: defaultTranslations,
    shouldUseEssentials: true,
    optionalDeps: {
      initI18n,
      createHttpClient,
      createExperiments,
    },
    localeDistPath: "assets/locales",
  });

  const _createControllers = createControllersWithDescriptors({
    initI18n,
    blocksControllerService,
    createHttpClient,
    createExperiments,
    velocycleMobx,
  }, [{ method: controller0,
          wrap: wrapController0,
          exports: controllerExport0,
          widgetType: "PLATFORM_WIDGET",
          translationsConfig,
          multilingualDisabled,
          experimentsConfig: {"centralized":true,"scopes":["viewer-apps-14ce1214-b278-a7e4-1373-00cebd1bef7c"]},
          fedopsConfig: fedopsConfig,
          sentryConfig: sentryConfig,
          persistentAcrossPages: false,
          biLogger: biLogger,
          shouldUseEssentials: true,
          withErrorBoundary: false,
          biConfig: null,
          controllerFileName: "/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/complexAddressController/controller.ts",
          appName: "forms-viewer",
          appDefinitionId: "14ce1214-b278-a7e4-1373-00cebd1bef7c",
          projectName: "forms-viewer",
          componentName: "complexAddressController",
          localeDistPath: "assets/locales",
          defaultTranslations: defaultTranslations,
          id: "complexAddressController" }, { method: controller1,
          wrap: wrapController1,
          exports: controllerExport1,
          widgetType: "PLATFORM_WIDGET",
          translationsConfig,
          multilingualDisabled,
          experimentsConfig: {"centralized":true,"scopes":["viewer-apps-14ce1214-b278-a7e4-1373-00cebd1bef7c"]},
          fedopsConfig: fedopsConfig,
          sentryConfig: sentryConfig,
          persistentAcrossPages: false,
          biLogger: biLogger,
          shouldUseEssentials: true,
          withErrorBoundary: false,
          biConfig: null,
          controllerFileName: "/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/complexPhoneController/controller.ts",
          appName: "forms-viewer",
          appDefinitionId: "14ce1214-b278-a7e4-1373-00cebd1bef7c",
          projectName: "forms-viewer",
          componentName: "complexPhoneController",
          localeDistPath: "assets/locales",
          defaultTranslations: defaultTranslations,
          id: "complexPhoneController" }, { method: controller2,
          wrap: wrapController2,
          exports: controllerExport2,
          widgetType: "PLATFORM_WIDGET",
          translationsConfig,
          multilingualDisabled,
          experimentsConfig: {"centralized":true,"scopes":["viewer-apps-14ce1214-b278-a7e4-1373-00cebd1bef7c"]},
          fedopsConfig: fedopsConfig,
          sentryConfig: sentryConfig,
          persistentAcrossPages: false,
          biLogger: biLogger,
          shouldUseEssentials: true,
          withErrorBoundary: false,
          biConfig: null,
          controllerFileName: "/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/getSubscribers/controller.ts",
          appName: "forms-viewer",
          appDefinitionId: "14ce1214-b278-a7e4-1373-00cebd1bef7c",
          projectName: "forms-viewer",
          componentName: "getSubscribers",
          localeDistPath: "assets/locales",
          defaultTranslations: defaultTranslations,
          id: "getSubscribers" }, { method: controller3,
          wrap: wrapController3,
          exports: controllerExport3,
          widgetType: "PLATFORM_WIDGET",
          translationsConfig,
          multilingualDisabled,
          experimentsConfig: {"centralized":true,"scopes":["viewer-apps-14ce1214-b278-a7e4-1373-00cebd1bef7c"]},
          fedopsConfig: fedopsConfig,
          sentryConfig: sentryConfig,
          persistentAcrossPages: false,
          biLogger: biLogger,
          shouldUseEssentials: true,
          withErrorBoundary: false,
          biConfig: null,
          controllerFileName: "/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/multiStepForm/controller.ts",
          appName: "forms-viewer",
          appDefinitionId: "14ce1214-b278-a7e4-1373-00cebd1bef7c",
          projectName: "forms-viewer",
          componentName: "multiStepForm",
          localeDistPath: "assets/locales",
          defaultTranslations: defaultTranslations,
          id: "multiStepForm" }, { method: controller4,
          wrap: wrapController4,
          exports: controllerExport4,
          widgetType: "PLATFORM_WIDGET",
          translationsConfig,
          multilingualDisabled,
          experimentsConfig: {"centralized":true,"scopes":["viewer-apps-14ce1214-b278-a7e4-1373-00cebd1bef7c"]},
          fedopsConfig: fedopsConfig,
          sentryConfig: sentryConfig,
          persistentAcrossPages: false,
          biLogger: biLogger,
          shouldUseEssentials: true,
          withErrorBoundary: false,
          biConfig: null,
          controllerFileName: "/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/registrationForm/controller.ts",
          appName: "forms-viewer",
          appDefinitionId: "14ce1214-b278-a7e4-1373-00cebd1bef7c",
          projectName: "forms-viewer",
          componentName: "registrationForm",
          localeDistPath: "assets/locales",
          defaultTranslations: defaultTranslations,
          id: "registrationForm" }, { method: controller5,
          wrap: wrapController5,
          exports: controllerExport5,
          widgetType: "PLATFORM_WIDGET",
          translationsConfig,
          multilingualDisabled,
          experimentsConfig: {"centralized":true,"scopes":["viewer-apps-14ce1214-b278-a7e4-1373-00cebd1bef7c"]},
          fedopsConfig: fedopsConfig,
          sentryConfig: sentryConfig,
          persistentAcrossPages: false,
          biLogger: biLogger,
          shouldUseEssentials: true,
          withErrorBoundary: false,
          biConfig: null,
          controllerFileName: "/home/builduser/work/73455c3e2f7ee0e8/packages/forms-viewer/src/components/wixForms/controller.ts",
          appName: "forms-viewer",
          appDefinitionId: "14ce1214-b278-a7e4-1373-00cebd1bef7c",
          projectName: "forms-viewer",
          componentName: "wixForms",
          localeDistPath: "assets/locales",
          defaultTranslations: defaultTranslations,
          id: "wixForms" }],
    true);

    export const createControllers = _createControllers
