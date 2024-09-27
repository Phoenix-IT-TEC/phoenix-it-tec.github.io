import { withCompController } from '@wix/editor-elements-integrations';
import {
  AnalyticsClicksGroups,
  tryReportAnalyticsClicksBi,
} from '@wix/editor-elements-common-utils';
import type {
  VerticalMenuControllerProps,
  VerticalMenuMapperProps,
  VerticalMenuStateRefs,
} from '../VerticalMenu.types';

const compController = withCompController<
  VerticalMenuMapperProps,
  VerticalMenuControllerProps,
  VerticalMenuStateRefs
>(({ stateValues, mapperProps }) => {
  const { currentUrl, reportBi } = stateValues;
  const {
    compId,
    language,
    mainPageId,
    fullNameCompType,
    trackClicksAnalytics,
    ...restMapperProps
  } = mapperProps;

  const reportBiOnClick: VerticalMenuControllerProps['reportBiOnClick'] =
    item => {
      const { link, label, selected } = item;

      tryReportAnalyticsClicksBi(reportBi, {
        link,
        language,
        trackClicksAnalytics,
        element_id: compId,
        elementTitle: label,
        details: { selected },
        elementType: fullNameCompType,
        pagesMetadata: { mainPageId },
        elementGroup: AnalyticsClicksGroups.MenuAndAnchor,
      });
    };

  return {
    ...restMapperProps,
    currentUrl,
    reportBiOnClick,
  };
});

export default compController;
