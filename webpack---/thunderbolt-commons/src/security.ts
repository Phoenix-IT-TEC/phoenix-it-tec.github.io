const WIX_HOTEL_APP_DEF_ID = '826670ba-3a6b-4157-ac72-7c4fca9ce220'

export const shouldExcludeFromSecurityExperiments = (siteAppDefIds: Array<string>) =>
	siteAppDefIds?.includes(WIX_HOTEL_APP_DEF_ID)
