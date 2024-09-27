import { RoleId } from '@wix/members-domain-ts';
import { reportMemberSubmitted } from '@wix/bi-logger-members-app-uou/v2';
import { Category } from '@wix/ambassador-members-v1-member-report/types';

import { ThunkWithArgs, ReportCategory } from '../../../../types';
import { openModalWithCallback, openModal } from '../../../../services/modal';
import { getCommonBIEventProps } from '../../../../services/bi-event';

type OnConfirmProps = {
  data: {
    category: number;
    description: string;
  };
};

const THANKS_FOR_REPORT_MODAL = 'thanks-for-report';

const reportCategoryMap = [
  ReportCategory.Spam,
  ReportCategory.Impersonation,
  ReportCategory.Harassment,
  ReportCategory.Other,
];

export const reportMember: ThunkWithArgs<RoleId> =
  (roleId) => async (dispatch, getState, extra) => {
    const {
      compId,
      wixCodeApi,
      platformAPIs,
      experiments,
      biLogger,
      flowAPI,
      metaData,
      reportMemberService,
    } = extra;

    const state = getState();
    const { viewed, current } = state.users;
    const { uid } = viewed;

    const onConfirm = async ({ data }: OnConfirmProps) => {
      const reason = reportCategoryMap[data.category] as unknown as Category;
      const details = data.description;

      await reportMemberService.reportMember(uid, current?.uid!, {
        category: reason,
        description: details,
      });

      biLogger?.report(
        reportMemberSubmitted({
          ...getCommonBIEventProps(flowAPI, state, metaData),
          member_chosen: uid,
          siteMemberId: state.users.current?.uid,
          details,
          reason,
          visitor_id: platformAPIs.bi?.visitorId,
        }),
      );

      openModal({
        compId,
        modalType: THANKS_FOR_REPORT_MODAL,
        wixCodeApi,
        experiments,
        payload: {},
      });
    };

    openModalWithCallback({
      compId,
      modalType: roleId,
      payload: {},
      platformAPIs,
      wixCodeApi,
      experiments,
      onConfirm,
    });
  };
