import { RoleId } from '@wix/members-domain-ts';

import { Origin, ThunkWithArgs } from '../../../types';
import { openModalWithCallback } from '../../../services/modal';
import { getSetViewedMemberAction } from '../../actions';
import { scheduleViewedMemberSync, clearInitialDataCache } from '../common';

type OppositeRolesMap = { [key in RoleId]?: RoleId };

const oppositeRolesMap: OppositeRolesMap = {
  [RoleId.BLOCK_MEMBER]: RoleId.UNBLOCK_MEMBER,
  [RoleId.SET_FORUM_MODERATOR]: RoleId.UNSET_FORUM_MODERATOR,
  [RoleId.SET_BLOG_WRITER]: RoleId.UNSET_BLOG_WRITER,
};

const rolesIdsWithPictures = [
  RoleId.SET_FORUM_MODERATOR,
  RoleId.UNSET_FORUM_MODERATOR,
  RoleId.SET_BLOG_WRITER,
  RoleId.UNSET_BLOG_WRITER,
];

export const modalRoleAction: ThunkWithArgs<RoleId> =
  (roleId) => (dispatch, getState, extra) => {
    const { compId, wixCodeApi, platformAPIs, membersService, experiments } =
      extra;
    const state = getState();
    const { viewed } = state.users;
    const applicableRoleId = viewed.roles.includes(roleId)
      ? oppositeRolesMap[roleId] ?? roleId
      : roleId;
    const hasPicture = rolesIdsWithPictures.includes(roleId);

    const payload = {
      ...(hasPicture && {
        memberName: viewed.name,
        memberPicture: viewed.picture,
      }),
      originalAppComponent: Origin.Profile,
    };

    const onConfirm = async () => {
      const { uid, roles } = viewed;

      clearInitialDataCache(state, extra);
      scheduleViewedMemberSync(extra);
      await membersService.applyRoleAction({
        uid,
        roles,
        roleId,
      });
      const viewedMember = await membersService.getMember(uid);
      dispatch(getSetViewedMemberAction(viewedMember));
    };

    openModalWithCallback({
      compId,
      modalType: applicableRoleId,
      payload,
      platformAPIs,
      wixCodeApi,
      experiments,
      onConfirm,
    });
  };
