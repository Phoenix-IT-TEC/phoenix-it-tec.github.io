import { getActivityCounters } from '@wix/ambassador-members-v1-activity-counter/http';
import { IPlatformServices, ViewerScriptFlowAPI } from '@wix/yoshi-flow-editor';
import { getNumberOfUnseenNotificationsActivityCounter } from '../../services/ping-feed-service';
import { WixCodeApi } from '../../types';

interface Request {
  memberId: string;
  loggedIn: boolean;
  biService: IPlatformServices['bi'];
  flowAPI: ViewerScriptFlowAPI;
  wixCodeApi: WixCodeApi;
}
export async function getMemberActivityCounters({
  memberId,
  loggedIn,
  biService,
  flowAPI,
  wixCodeApi,
}: Request) {
  try {
    const [activityCountersResponse, numberOfUnseenActivityCounter] =
      await Promise.all([
        flowAPI.httpClient.request(getActivityCounters({ memberId })),
        loggedIn
          ? getNumberOfUnseenNotificationsActivityCounter({
              metaSiteId: biService?.bi?.metaSiteId,
              memberId,
              flowAPI,
              wixCodeApi,
            })
          : null,
      ]);

    const activityCounters =
      activityCountersResponse?.data?.activityCounters || [];

    if (numberOfUnseenActivityCounter) {
      activityCounters.push(numberOfUnseenActivityCounter);
    }

    const apps = activityCounters.map((activityCounter) => ({
      appDefId: activityCounter.appId,
      numbers: activityCounter.counters?.reduce(
        (
          acc: Record<string, { public?: boolean; count?: number }>,
          counter,
        ) => {
          acc[counter.key!] = {
            public: counter.public,
            count: counter.count,
          };
          return acc;
        },
        {},
      ),
    }));

    return apps;
  } catch (error) {
    flowAPI.errorMonitor?.captureException(error as Error);
    return [];
  }
}

export type MemberActivityCounters = Awaited<
  ReturnType<typeof getMemberActivityCounters>
>;
