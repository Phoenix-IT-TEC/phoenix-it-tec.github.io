import membersPrivacySlice from '../slices/members-privacy-slice';

export const getSetIsPublicMemberCandidateNoOneAction = (
  isPublicMemberCandidateNoOne: boolean,
) =>
  membersPrivacySlice.actions.setIsPublicMemberCandidateNoOne({
    isPublicMemberCandidateNoOne,
  });
