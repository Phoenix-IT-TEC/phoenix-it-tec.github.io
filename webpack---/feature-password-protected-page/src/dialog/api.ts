import { resolveProtectedPagesJsonFilename } from '@wix/ambassador-document-management-public-editor-info-v1-published-site-details/http'
import type { ResolveProtectedPagesJsonFilenameRequest } from '@wix/ambassador-document-management-public-editor-info-v1-published-site-details/types'
import { createHttpClient } from '@wix/http-client'
import type { PagesMap } from '../types'
import type { Experiments, ILogger } from '@wix/thunderbolt-symbols'
import { PasswordVerificationError } from './errors/PasswordVerificationError'

interface IVerifyPasswordResponse {
	success: boolean
	errorCode: number
	pagesMap: PagesMap
}

export function createProtectedPageAPI(signedInstance: string, experiments: Experiments, logger: ILogger) {
	const httpClient = createHttpClient({ isSSR: false })
	const errorTypeToErrorCodeMap: { [key: string]: number } = {
		PAGE_ACCESS_DENIED: -17005,
	} as const
	const VERIFICATION_FAILED_CODE = -19970

	async function doVerify(payload: ResolveProtectedPagesJsonFilenameRequest): Promise<IVerifyPasswordResponse> {
		try {
			const response = await httpClient.request(resolveProtectedPagesJsonFilename(payload), { signedInstance })
			return {
				success: true,
				errorCode: 0,
				pagesMap: response.data.pagesJsonFilename!.reduce((acc, it) => {
					acc[it.pageId!] = it.jsonFilename!
					return acc
				}, {} as PagesMap),
			}
		} catch (ex) {
			const errorType = ex.response?.data?.details?.applicationError?.code
			const errorCode = errorTypeToErrorCodeMap[errorType] ?? VERIFICATION_FAILED_CODE

			if (errorCode === VERIFICATION_FAILED_CODE) {
				logger.captureError(new PasswordVerificationError('Failed to verify site/page password'), {
					tags: {
						feature: 'feature-password-protected-page',
						method: 'doVerify',
					},
					extra: {
						error: ex,
						requestId: ex.response?.headers?.['x-wix-request-id'],
					},
				})
			}

			return {
				success: false,
				errorCode,
				pagesMap: {},
			}
		}
	}

	return {
		verifyPagePassword(pageId: string, password: string) {
			return doVerify({ pageId, password })
		},
		verifySitePassword(password: string) {
			return doVerify({ password })
		},
	}
}
