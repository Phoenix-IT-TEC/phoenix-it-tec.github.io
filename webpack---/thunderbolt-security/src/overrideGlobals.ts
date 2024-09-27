/**
 * This file is with it's imports is being loaded in the main-head.ejs on production using webpack.
 * While working locally, the last bundle is being loaded in the main-head.ejs as minified + uglyfied code.
 * To see changes from your code locally, after each change you need to run "npx webpack" from the package folder and copy
 * the content of the generated file in "dist/overrideGlobalsBundle.js" to the main-head.ejs file.
 * This is only because yoshi does let us to remove the loaded webpack-dev-server into the bundle and it causes errors locally only.
 */
import { initOverridingGlobals, shouldExcludeFromSecurityExperiments } from './helpers'
import { overrideWindowOpen } from './overridingGlobals/window'
import { overrideIframe } from './overridingGlobals/iframe'
import { overrideFetch, overrideXHR } from './overridingGlobals/fetchAndXHR'
import { freezeClientGlobals } from './freezeClientGlobals'
import { overrideTimeout } from './overridingGlobals/timeout'

performance.mark('overrideGlobals started')

// @ts-ignore
const { siteAppDefIds, experiments } = window.viewerModel

const isExcludedFromSecurityExperiments = shouldExcludeFromSecurityExperiments(siteAppDefIds)

try {
	// Init overriding globals
	initOverridingGlobals()

	// Start override globals
	if (experiments['specs.thunderbolt.hardenWindowOpen']) {
		overrideWindowOpen()
	}

	if (experiments['specs.thunderbolt.hardenIFrames'] && !isExcludedFromSecurityExperiments) {
		overrideIframe()
	}

	if (experiments['specs.thunderbolt.hardenFetchAndXHR'] && !isExcludedFromSecurityExperiments) {
		overrideFetch()
		overrideXHR()
	}

	freezeClientGlobals(isExcludedFromSecurityExperiments)

	if (experiments['specs.thunderbolt.hardenTimeout']) {
		overrideTimeout()
	}
} catch (e) {
	// @ts-ignore
	if (window?.viewerModel?.mode.debug) {
		console.error(e)
	}

	const error = new Error('TB006')
	// @ts-ignore
	window.fedops?.reportError(error, 'security_overrideGlobals')

	// @ts-ignore
	if (window.Sentry) {
		// @ts-ignore
		window.Sentry.captureException(error)
	} else {
		// @ts-ignore
		globalThis.defineStrictProperty('sentryBuffer', [error], window, false)
	}
}

performance.mark('overrideGlobals ended')
