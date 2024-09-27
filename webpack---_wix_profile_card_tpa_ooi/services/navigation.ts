import { ControllerParams } from '@wix/yoshi-flow-editor';

import { Nullable } from '../types';

type WixCodeApi = ControllerParams['controllerConfig']['wixCodeApi'];

export const maybeNavigateToHomePage = async (wixCodeApi: WixCodeApi) => {
  const { pages } = await wixCodeApi.site.getSiteStructure({
    includePageId: true,
  });

  const homePage = pages.find(({ isHomePage }) => isHomePage);

  if (!homePage) {
    return;
  }

  return wixCodeApi.location.navigateTo?.({ pageId: homePage.id });
};

export const maybeOpenContactsWindow = async (
  metaSiteId: Nullable<string>,
  memberUid: string,
  isEditorX: boolean,
) => {
  if (!metaSiteId) {
    return;
  }

  const baseUrl = isEditorX
    ? 'https://manage.editorx.com'
    : 'https://www.wix.com';
  const contactsUrl = `${baseUrl}/my-account/sites/${metaSiteId}/contacts/view/${memberUid}`;

  window.open(contactsUrl);
};
