import { getMemberPrivacySettings as getMemberPrivacySettingsAmbassador } from '@wix/ambassador-members-v1-member-privacy-settings/http';
import {
  Candidates,
  GetMemberPrivacySettingsResponse,
} from '@wix/ambassador-members-v1-member-privacy-settings/types';

import { HttpClient } from '../types/controller';

export const getIsPublicMemberCandidateNoOne = async (
  httpClient: HttpClient,
): Promise<boolean> => {
  const {
    data: { memberPrivacySettings },
  } = await httpClient.request<GetMemberPrivacySettingsResponse>(
    getMemberPrivacySettingsAmbassador({}),
  );

  return memberPrivacySettings?.publicMemberCandidates === Candidates.NO_ONE;
};
