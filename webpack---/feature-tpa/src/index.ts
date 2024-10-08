import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { FeatureName, InitSymbol, LifeCycle, TpaHandlerProviderSymbol, TpaPopupSymbol } from '@wix/thunderbolt-symbols'
import { TpaHandlersManager } from './tpaHandlersManager'
import { TpaBroadcastManager } from './tpaBroadcastManager'
import {
	TpaModalSymbol,
	TpaEventsListenerManagerSymbol,
	TpaPopupApiSymbol,
	TpaSymbol,
	TpaComponentApiSymbol,
	IFrameStartedLoadingReporterSymbol,
	SiteMapSymbol,
	name,
	TpaLoadMeasureSymbol,
} from './symbols'
import { handlers } from './handlers'
import { TpaEventsListenerManager } from './eventsListenerManager'
import { TpaPopupFactory } from './tpaPopup'
import { TpaPopupApiFactory } from './tpaPopupApi'
import { TpaModal } from './tpaModal'
import { SiteScrollDispatcher } from './siteScrollDispatch'
import { tpaCommonConfigUpdater } from './tpaCommonConfigUpdater'
import { TpaHandlersManagerSymbol } from 'feature-tpa-commons'
import { TpaPageNavigationDispatcher } from './TpaPageNavigationDispatcher'
import { Tpa } from './tpa'
import { TpaStateManager } from './tpaStateManager'
import { UrlChangeHandlerForPage } from 'feature-router'
import { TpaCurrentCurrencyManager } from './tpaCurrentCurrencyManager'
import { TpaComponentApi } from './tpaComponentApi'
import { ComponentWillMountSymbol } from 'feature-components'
import { TpaComponentWillMount } from './tpaComponentWillMount'
import { IFrameStartedLoadingReporter } from './iframeStartedLoadingReporter'
import { SiteMap } from './siteMap'
import { TpaLoadMeasure } from './tpaLoadMeasure'

const featureName: FeatureName = 'tpa'

export const page: ContainerModuleLoader = (bind) => {
	bind(TpaComponentApiSymbol).to(TpaComponentApi)
	bind(IFrameStartedLoadingReporterSymbol).to(IFrameStartedLoadingReporter)
	bind(LifeCycle.PageDidMountHandler, TpaSymbol).to(Tpa)
	bind(ComponentWillMountSymbol).to(TpaComponentWillMount)
	bind(TpaHandlersManagerSymbol).to(TpaHandlersManager)
	bind(LifeCycle.PageDidMountHandler, TpaEventsListenerManagerSymbol).to(TpaEventsListenerManager)
	bind(LifeCycle.PageDidLoadHandler).to(TpaPageNavigationDispatcher)
	bind(TpaPopupApiSymbol).to(TpaPopupApiFactory)
	bind(LifeCycle.PageDidMountHandler, TpaPopupSymbol).to(TpaPopupFactory)
	bind(SiteMapSymbol).to(SiteMap)
	handlers.forEach((factory) => {
		// TODO fetch and bind only handlers we need https://jira.wixpress.com/browse/PLAT-715
		bind(TpaHandlerProviderSymbol).to(factory)
	})
	bind(LifeCycle.PageDidMountHandler).to(TpaBroadcastManager)
	bind(LifeCycle.PageWillUnmountHandler, TpaModalSymbol).to(TpaModal)
	bind(LifeCycle.PageWillMountHandler).to(SiteScrollDispatcher)
	bind(LifeCycle.PageDidMountHandler).to(tpaCommonConfigUpdater)
	bind(UrlChangeHandlerForPage).to(TpaStateManager)
	bind(UrlChangeHandlerForPage).to(TpaCurrentCurrencyManager)
	bind(TpaLoadMeasureSymbol).to(TpaLoadMeasure)

	bind(InitSymbol).to(TpaPopupFactory).whenTargetNamed(featureName)
	bind(InitSymbol).to(TpaModal).whenTargetNamed(featureName)
}

export type {
	TpaPopupOrigin,
	TpaPopupPlacement,
	OpenModalOptions,
	BaseResponse,
	ITpaModal,
	OpenPopupOptions,
	ITPAEventsListenerManager,
	ISiteMapDs,
	TpaPageConfig,
	ITpa,
	TpaFeatureState,
} from './types'
export { TpaPopupSymbol, TpaEventsListenerManagerSymbol }
export { TpaModalSymbol, TpaSymbol }
export { SiteMapSymbol, name }
