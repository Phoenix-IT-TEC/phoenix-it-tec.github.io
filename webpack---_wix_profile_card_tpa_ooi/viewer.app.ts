import { InitAppForPageFn } from '@wix/yoshi-flow-editor';

import { ProfileCardAPI } from './types';
import { ProfileSubject } from './services/profile-subject';

const profileSubject = new ProfileSubject();

export const initAppForPage: InitAppForPageFn = async () => ({
  profileSubject,
});

export const exports = (): ProfileCardAPI => ({
  registerToProfileChange: (callback) => {
    profileSubject.registerObserver(callback);
  },
});
