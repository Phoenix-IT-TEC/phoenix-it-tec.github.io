import badgesSlice, { SetBadgeListPayload } from '../slices/badge-slice';

export const getSetBadgeListPayload = (list: SetBadgeListPayload['list']) =>
  badgesSlice.actions.setBadgeList({ list });
