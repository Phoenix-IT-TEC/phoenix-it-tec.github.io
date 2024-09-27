import type { IDialogContext, IDialogProps, IVerifyPagePasswordResponse } from './types'
import { DialogComponentId as PagePasswordDialogId, SitePasswordDialogComponentId } from '../symbols'
import { AUTH_RESULT_REASON } from 'feature-site-members'
import type { IPropsStore, IStructureAPI } from '@wix/thunderbolt-symbols'
import type { PagePasswordDialogResult, PasswordDialogProps, SitePasswordDialogResult } from '../types'

export function createSitePasswordDialog(
	{ propsStore, structureApi, api }: IDialogContext,
	translations: Record<string, string>
) {
	const dialog = createDialog(SitePasswordDialogComponentId, propsStore, structureApi, translations)

	return {
		prompt(): SitePasswordDialogResult {
			dialog.hide()

			return new Promise(async (resolve) => {
				const props = createDialogProps({
					isCloseable: false,
					onCloseCallback() {},
					async onSubmitCallback(password: string) {
						dialog.hideError()

						const response = await api.verifySitePassword(password)

						if (response.errorCode) {
							dialog.displayError(response.errorCode)
							return
						}

						resolve({ authorizedPagesMap: response.pagesMap, onComplete: dialog.hide })
					},
				})

				await dialog.prompt(props)
			})
		},
	}
}

export function createPagePasswordDialog(
	{ propsStore, structureApi, fetchApi, siteFeatureConfig, currentRouteInfo, viewerModel }: IDialogContext,
	translations: Record<string, string>
) {
	const { siteRevision, metaSiteId, siteId } = viewerModel.site

	const url = `${siteFeatureConfig.protectedPageResolverUrl}?siteRevision=${siteRevision}`
	const dialog = createDialog(PagePasswordDialogId, propsStore, structureApi, translations)

	return {
		prompt(pageId: string): PagePasswordDialogResult {
			dialog.hide()

			return new Promise(async (resolve) => {
				const isLandingOnProtectedPage = currentRouteInfo.isLandingOnProtectedPage()
				const isHomePage = siteFeatureConfig.homePageId === pageId

				const props = createDialogProps({
					isCloseable: !isLandingOnProtectedPage || !isHomePage,
					onCloseCallback() {
						dialog.hide()

						if (isLandingOnProtectedPage) {
							resolve({
								authenticationResult: { reason: AUTH_RESULT_REASON.CANCELED },
								authorizedPagesMap: {},
							})
						}
					},
					async onSubmitCallback(password: string) {
						dialog.hideError()
						const response: IVerifyPagePasswordResponse = await fetchApi
							.envFetch(url, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({ password, pageId, metaSiteId, siteId }),
							})
							.then((res) => res.json())

						if (response.errorCode) {
							dialog.displayError(response.errorCode)
							return
						}

						resolve({
							authorizedPagesMap: { [pageId]: getPageJsonName(response.payload.urls[0]) },
							onProtectedPageNavigationComplete: dialog.hide,
						})
					},
				})

				await dialog.prompt(props)
			})
		},
	}
}

function getPageJsonName(pageJsonUrl: string) {
	const urlPath = pageJsonUrl.split('/').pop() || ''
	return urlPath.split('.')[0]
}

function createDialogProps({ isCloseable, onCloseCallback, onSubmitCallback }: IDialogProps) {
	return {
		errorCode: 0,
		isCloseable,
		onCloseDialogCallback: onCloseCallback,
		onSubmitCallback,
	}
}

function createDialog(
	dialogId: string,
	propsStore: IPropsStore,
	structureApi: IStructureAPI,
	translations: Record<string, string>
) {
	async function prompt(props: PasswordDialogProps) {
		propsStore.update({ [dialogId]: { translations, ...props } })
		await structureApi.addComponentToDynamicStructure(dialogId, {
			componentType: 'EnterPasswordDialog',
			components: [],
		})
	}
	function hide() {
		structureApi.removeComponentFromDynamicStructure(dialogId)
	}

	function hideError() {
		propsStore.update({ [dialogId]: { errorCode: 0 } })
	}

	function displayError(errorCode: number) {
		propsStore.update({ [dialogId]: { errorCode } })
	}

	return {
		prompt,
		hide,
		displayError,
		hideError,
	}
}
