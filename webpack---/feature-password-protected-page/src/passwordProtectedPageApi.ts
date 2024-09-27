import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	CurrentRouteInfoSymbol,
	Experiments,
	ExperimentsSymbol,
	Fetch,
	IFetchApi,
	ILogger,
	IPropsStore,
	IStructureAPI,
	LoggerSymbol,
	MasterPageFeatureConfigSymbol,
	Props,
	SiteFeatureConfigSymbol,
	StructureAPI,
	ViewerModel,
	ViewerModelSym,
} from '@wix/thunderbolt-symbols'
import { name } from './symbols'
import type {
	IPasswordProtectedPageApi,
	PasswordProtectedMasterPageConfig,
	PasswordProtectedPageSiteConfig,
} from './types'
import type { ICurrentRouteInfo } from 'feature-router'
import { createSitePasswordDialog, createPagePasswordDialog } from './dialog/dialogs'
import type { IDialogContext } from './dialog/types'
import { ISessionManager, SessionManagerSymbol } from 'feature-session-manager'
import { createProtectedPageAPI } from './dialog/api'

const passwordProtectedPageApi = (
	propsStore: IPropsStore,
	structureApi: IStructureAPI,
	fetchApi: IFetchApi,
	siteFeatureConfig: PasswordProtectedPageSiteConfig,
	viewerModel: ViewerModel,
	currentRouteInfo: ICurrentRouteInfo,
	{ pagePasswordDialogTranslations, sitePasswordDialogTranslations }: PasswordProtectedMasterPageConfig,
	sessionManager: ISessionManager,
	experiments: Experiments,
	logger: ILogger
): IPasswordProtectedPageApi => {
	let isAppMounted = false
	let pendingDialog: null | Function

	const ctx: IDialogContext = {
		propsStore,
		structureApi,
		fetchApi,
		siteFeatureConfig,
		viewerModel,
		currentRouteInfo,
		api: createProtectedPageAPI(
			sessionManager.getAppInstanceByAppDefId('22bef345-3c5b-4c18-b782-74d4085112ff') ?? '',
			experiments,
			logger
		),
	}

	const pagePasswordDialog = createPagePasswordDialog(ctx, pagePasswordDialogTranslations)
	const sitePasswordDialog = createSitePasswordDialog(ctx, sitePasswordDialogTranslations)

	function queueOrPromptDialog<T>(shouldQueueDialog: boolean, promptDialog: () => Promise<T>): Promise<T> {
		return new Promise<T>(async (resolve) => {
			const showPrompt = () => promptDialog().then(resolve)

			if (shouldQueueDialog) {
				pendingDialog = showPrompt
				return
			}

			await showPrompt()
		})
	}

	return {
		appDidMount: () => {
			if (pendingDialog) {
				pendingDialog()
				pendingDialog = null
			}
			isAppMounted = true
		},

		promptPagePasswordDialog(pageId: string) {
			const shouldQueueDialog = currentRouteInfo.isLandingOnProtectedPage() && !isAppMounted
			return queueOrPromptDialog(shouldQueueDialog, () => pagePasswordDialog.prompt(pageId))
		},

		promptSitePasswordDialog() {
			const shouldQueueDialog = !isAppMounted
			return queueOrPromptDialog(shouldQueueDialog, () => sitePasswordDialog.prompt())
		},
	}
}

export const PasswordProtectedPageApi = withDependencies(
	[
		Props,
		StructureAPI,
		Fetch,
		named(SiteFeatureConfigSymbol, name),
		ViewerModelSym,
		CurrentRouteInfoSymbol,
		named(MasterPageFeatureConfigSymbol, name),
		SessionManagerSymbol,
		ExperimentsSymbol,
		LoggerSymbol,
	],
	passwordProtectedPageApi
)
