import { MEMBERS_AREA_V2 } from '@wix/app-definition-ids';

import type { WixCodeApi } from '../types/controller';
import { MembersTpaPageId } from '../constants/tpa';
import { MAVersion } from '../constants/common';

const isProfilePageBoBInstalled = (wixCodeApi: WixCodeApi) =>
  wixCodeApi.site.isAppSectionInstalled({
    sectionId: MembersTpaPageId.Profile,
    appDefinitionId: MEMBERS_AREA_V2,
  });

const isSettingsPageInstalled = (wixCodeApi: WixCodeApi) =>
  wixCodeApi.site.isAppSectionInstalled({
    sectionId: MembersTpaPageId.Settings,
    appDefinitionId: MEMBERS_AREA_V2,
  });

export const getInstalledMAVersion = async (wixCodeApi: WixCodeApi) => {
  if (await isSettingsPageInstalled(wixCodeApi)) {
    return MAVersion.v3;
  }

  if (await isProfilePageBoBInstalled(wixCodeApi)) {
    return MAVersion.v2;
  }

  return MAVersion.v1;
};
