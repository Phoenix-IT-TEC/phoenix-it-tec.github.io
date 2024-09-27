import { ClientGlobals } from './types'

export const freezeClientGlobals = (isExcludedFromSecurityExperiments: boolean) => {
	let publicAPIsToFreeze: Array<ClientGlobals> = []

	// @ts-ignore
	const { experiments } = window.viewerModel

	// Check which freeze to apply
	if (experiments['specs.thunderbolt.hardenClientGlobals_Text']) {
		publicAPIsToFreeze = publicAPIsToFreeze.concat(['TextEncoder', 'TextDecoder'])
	}

	if (experiments['specs.thunderbolt.hardenClientGlobals_EventTarget'] && !isExcludedFromSecurityExperiments) {
		publicAPIsToFreeze = publicAPIsToFreeze.concat(['XMLHttpRequestEventTarget', 'EventTarget'])
	}

	if (experiments['specs.thunderbolt.hardenClientGlobals_Array_URL_JSON']) {
		publicAPIsToFreeze = publicAPIsToFreeze.concat(['Array', 'URL', 'JSON'])
	}

	if (experiments['specs.thunderbolt.hardenClientGlobals_EventListener']) {
		publicAPIsToFreeze = publicAPIsToFreeze.concat(['addEventListener', 'removeEventListener'])
	}

	if (experiments['specs.thunderbolt.hardenEncodingDecoding']) {
		publicAPIsToFreeze = publicAPIsToFreeze.concat([
			'encodeURI',
			'encodeURIComponent',
			'decodeURI',
			'decodeURIComponent',
		])
	}

	if (experiments['specs.thunderbolt.hardenStringAndNumber']) {
		publicAPIsToFreeze = publicAPIsToFreeze.concat(['String', 'Number'])
	}

	if (experiments['specs.thunderbolt.hardenObject']) {
		publicAPIsToFreeze.push('Object')
	}

	publicAPIsToFreeze.forEach((key) => {
		// Freeze the object
		const value = Object.freeze(globalThis[key])
		// Freezing prototype if exists excluding Array because of ooiLoadComponentsPageWillMountClient.ts using chunkLoadingGlobal
		// which on webpack is override push function for a specific instance
		if (value.hasOwnProperty('prototype') && key !== 'Array') {
			// @ts-ignore
			Object.freeze(value.prototype)
		}

		if (['addEventListener', 'removeEventListener'].includes(key) && !isExcludedFromSecurityExperiments) {
			// @ts-ignore
			globalThis.defineStrictProperty(key, document[key], document, true)
		}

		// @ts-ignore
		globalThis.defineStrictProperty(key, globalThis[key], globalThis, true)
	})
}
