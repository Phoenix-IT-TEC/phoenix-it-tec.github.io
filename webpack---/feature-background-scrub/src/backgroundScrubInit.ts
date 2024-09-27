import { withDependencies } from '@wix/thunderbolt-ioc'
import { IPageDidLoadHandler, ReducedMotionSymbol } from '@wix/thunderbolt-symbols'
import type { IBackgroundScrub } from './types'
import { BackgroundScrubSymbol } from './symbols'

const backgroundScrubInitFactory = (backgroundScrub: IBackgroundScrub, reducedMotion: boolean): IPageDidLoadHandler => {
	return {
		async pageDidLoad() {
			if (!reducedMotion) {
				await backgroundScrub.init()
			}
		},
	}
}

export const BackgroundScrubInit = withDependencies(
	[BackgroundScrubSymbol, ReducedMotionSymbol],
	backgroundScrubInitFactory
)
