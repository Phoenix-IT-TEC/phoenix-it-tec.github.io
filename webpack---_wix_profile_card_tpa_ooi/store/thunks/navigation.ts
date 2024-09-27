import { Thunk, ThunkWithArgs } from '../../types';
import { membersFFAppDefId } from '../../constants/app-definition-id';
import { ffSectionId } from '../../constants/section-id';
import { Applications } from '../../services/public-api-store';
import { FOLLOWERS_FOLLOWING_WIDGET_ID } from '../../constants/widgets-ids';

export const logError =
  (name: string) =>
  <T>(error: T) => {
    console.error(name, error);
  };

export const navigateToViewedMember: Thunk =
  () =>
  async (_, getState, { getPublicAPI }) => {
    const { viewed } = getState().users;
    const membersAreaAPI = await getPublicAPI(Applications.MembersArea);

    await membersAreaAPI
      ?.navigateToMember({ memberId: viewed.uid, memberSlug: viewed.slug })
      .catch(logError('navigateToMember'));
  };

export const navigateToViewedMemberFFPage: ThunkWithArgs<boolean> =
  (toFollowersPage: boolean) =>
  async (_, getState, { getPublicAPI }) => {
    const { viewed } = getState().users;
    const membersAreaAPI = await getPublicAPI(Applications.MembersArea);
    const tpaInnerRoute = toFollowersPage ? 'followers' : 'following';

    await membersAreaAPI
      ?.navigateToSection({
        tpaInnerRoute,
        memberId: viewed.slug || viewed.uid,
        sectionId: ffSectionId,
        appDefinitionId: membersFFAppDefId,
        widgetId: FOLLOWERS_FOLLOWING_WIDGET_ID,
      })
      .catch(logError('navigateToMember'));
  };
