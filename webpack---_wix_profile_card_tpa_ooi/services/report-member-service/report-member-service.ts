import { reportMember } from '@wix/ambassador-members-v1-member-report/http';
import { Reason } from '@wix/ambassador-members-v1-member-report/types';

import { HttpClient } from '../../types/controller';

export class ReportMemberService {
  constructor(private readonly httpClient: HttpClient) {}

  async reportMember(
    reportedMemberId: string,
    reportingMemberId: string,
    reason: Reason,
  ) {
    return this.httpClient.request(
      reportMember({
        memberReport: { reportedMemberId, reportingMemberId, reason },
      }),
    );
  }
}
