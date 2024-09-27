import { socialApps } from '../constants/social-apps';
import { InjectedSite } from '../types';

type InstalledAppsMap = InjectedSite['installedApps'];

export const checkIfSiteIsSocial = (installedApps: InstalledAppsMap) => {
  return socialApps.some((socialApp) => installedApps[socialApp]);
};
