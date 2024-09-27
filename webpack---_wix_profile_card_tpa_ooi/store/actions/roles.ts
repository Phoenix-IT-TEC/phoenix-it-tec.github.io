import rolesSlice, { SetRolesMapPayload } from '../slices/roles-slice';

export const getSetRolesMapAction = (map: SetRolesMapPayload['map']) =>
  rolesSlice.actions.setRolesMap({ map });
