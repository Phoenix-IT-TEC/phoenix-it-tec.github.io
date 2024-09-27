import { withCompController } from '@wix/editor-elements-integrations/src/thunderbolt';
import {
  AnalyticsClicksGroups,
  tryReportAnalyticsClicksBi,
} from '@wix/editor-elements-common-utils';
import type {
  IVerticalAnchorsMenuControllerProps,
  IVerticalAnchorsMenuMapperProps,
  IVerticalAnchorsMenuStateRefValues,
  IVerticalAnchorsMenuProps,
} from '../VerticalAnchorsMenu.types';

export default withCompController<
  IVerticalAnchorsMenuMapperProps,
  IVerticalAnchorsMenuControllerProps,
  IVerticalAnchorsMenuProps,
  IVerticalAnchorsMenuStateRefValues
>(({ stateValues, mapperProps }) => {
  const { currentUrl, reportBi } = stateValues;
  const {
    compId,
    language,
    fullNameCompType,
    trackClicksAnalytics,
    ...restMapperProps
  } = mapperProps;

  const reportBiOnClick: IVerticalAnchorsMenuControllerProps['reportBiOnClick'] =
    anchor => {
      tryReportAnalyticsClicksBi(reportBi, {
        language,
        trackClicksAnalytics,
        element_id: compId,
        value: anchor.dataId,
        elementTitle: anchor.name,
        elementType: fullNameCompType,
        elementGroup: AnalyticsClicksGroups.MenuAndAnchor,
      });
    };

  return { ...restMapperProps, currentPageHref: currentUrl, reportBiOnClick };
});
