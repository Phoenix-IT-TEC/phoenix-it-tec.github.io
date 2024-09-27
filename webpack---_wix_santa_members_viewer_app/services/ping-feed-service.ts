import { ViewerScriptFlowAPI } from '@wix/yoshi-flow-editor';
import { getNumberOfUnseenNotifications } from '@wix/ambassador-ping-feed-v1-notification/http';
import {
  FeedChannel,
  SpecialMigrationSpecs,
} from '@wix/ambassador-ping-feed-v1-notification/types';
import type { ActivityCounter } from '@wix/ambassador-members-v1-activity-counter/types';
import { MEMBERS_AREA } from '@wix/app-definition-ids';

import type { FlowAPI, WixCodeApi } from '../types';
import { NOTIFICATIONS_APP_ID } from '../constants';

interface Request {
  flowAPI: FlowAPI | ViewerScriptFlowAPI;
  memberId: string;
  metaSiteId: string;
  wixCodeApi: WixCodeApi;
}

export async function getNumberOfUnseenNotificationsActivityCounter({
  metaSiteId,
  flowAPI,
  memberId,
  wixCodeApi,
}: Request): Promise<ActivityCounter | null> {
  const signedInstance = wixCodeApi.site.getAppToken?.(MEMBERS_AREA);

  if (!signedInstance) {
    return null;
  }

  try {
    const response = await flowAPI.httpClient.request(
      getNumberOfUnseenNotifications({
        shouldCancelMergeContactInMobile: false,
        recipient: {
          contact: {
            metaSiteId,
            contactId: memberId,
          },
        },
        feedFilter: {
          channel: FeedChannel.WEB,
        },
        specialMigrationSpecs: [SpecialMigrationSpecs.HideChatNotifications],
      }),
      { signedInstance },
    );

    const numberOfUnseen = response?.data?.numberOfUnseen;

    if (!numberOfUnseen) {
      return null;
    }

    return {
      memberId,
      appId: NOTIFICATIONS_APP_ID,
      counters: [
        { key: 'notificationsCount', public: false, count: numberOfUnseen },
      ],
    };
  } catch (error) {
    flowAPI.errorMonitor?.captureException(error as Error);
    return null;
  }
}
