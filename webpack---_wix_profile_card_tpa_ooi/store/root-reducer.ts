import { combineReducers } from '@reduxjs/toolkit';

import usersSlice from './slices/users-slice';
import badgesSlice from './slices/badge-slice';
import rolesSlice from './slices/roles-slice';
import siteSlice from './slices/site-slice';
import profilePageSlice from './slices/profile-page-slice';
import globalSettingsSlice from './slices/global-settings-slice';
import componentSettingsSlice from './slices/component-settings-slice';
import membersPrivacySlice from './slices/members-privacy-slice';
import uiSlice from './slices/ui-slice';

const rootReducer = combineReducers({
  users: usersSlice.reducer,
  badges: badgesSlice.reducer,
  roles: rolesSlice.reducer,
  site: siteSlice.reducer,
  profilePage: profilePageSlice.reducer,
  globalSettings: globalSettingsSlice.reducer,
  componentSettings: componentSettingsSlice.reducer,
  membersPrivacy: membersPrivacySlice.reducer,
  ui: uiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
