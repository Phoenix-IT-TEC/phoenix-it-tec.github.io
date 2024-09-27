import { MEMBERS_AREA, WIX_CHAT } from '@wix/app-definition-ids';

import { Nullable, MembersAreaApi, ChatApi, MyAccountApi } from '../types';
import { myAccountAppDefinitionId } from '../constants/app-definition-id';

type WixCodeGetPublicApi = <T>(appDefinitionId: string) => Promise<Nullable<T>>;

type PublicAPI = MembersAreaApi | ChatApi | MyAccountApi;

type PublicAPIMap = { [key: string]: PublicAPI };

export enum Applications {
  MembersArea = 'membersArea',
  Chat = 'chat',
  MyAccount = 'myAccount',
}

type GetPublicAPIResponse<T extends Applications> = {
  [Applications.MembersArea]: MembersAreaApi;
  [Applications.Chat]: ChatApi;
  [Applications.MyAccount]: MyAccountApi;
}[T];

export type GetPublicAPI = <T extends Applications>(
  application: T,
) => Promise<Nullable<GetPublicAPIResponse<T>>>;

const appDefinitionIdMap = {
  [Applications.MembersArea]: MEMBERS_AREA,
  [Applications.Chat]: WIX_CHAT,
  [Applications.MyAccount]: myAccountAppDefinitionId,
};

export const createPublicAPIStore = (
  getPublicApi: WixCodeGetPublicApi,
): GetPublicAPI => {
  const publicApiMap: PublicAPIMap = {};

  return async <T extends PublicAPI>(application: Applications) => {
    const appDefinitionId = appDefinitionIdMap[application];
    if (publicApiMap[appDefinitionId]) {
      return publicApiMap[appDefinitionId] as T;
    }

    try {
      const publicApi = await getPublicApi<T>(appDefinitionId);
      if (publicApi) {
        publicApiMap[appDefinitionId] = publicApi;
      }
      return publicApi;
    } catch {
      return null;
    }
  };
};
