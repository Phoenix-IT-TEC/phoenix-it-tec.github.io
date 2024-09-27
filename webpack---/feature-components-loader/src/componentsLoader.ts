import { multi, withDependencies } from '@wix/thunderbolt-ioc'
import {
	AppStructure,
	ComponentLibrariesSymbol,
	Experiments,
	ExperimentsSymbol,
	ILogger,
	INavigationManager,
	IPropsStore,
	LoggerSymbol,
	NavigationManagerSymbol,
	Props,
	SuspendedCompsAPI,
	SuspendedCompsSym,
	ViewerModel,
	ViewerModelSym,
} from '@wix/thunderbolt-symbols'
import type {
	ComponentsLoaderRegistry,
	ComponentsRegistry,
	ComponentLibraries,
	CompControllersRegistry,
	IComponentsRegistrar,
	ComponentModule,
	IWrapComponent,
	ComponentLoaderFunction,
} from './types'
import { IComponentsLoader } from './IComponentLoader'
import { createViewportObserver, getCompClassType, taskify } from '@wix/thunderbolt-commons'
import { ComponentsRegistrarSymbol, ComponentWrapperSymbol } from './symbols'

import { createSuspenseWrapper, WithHydrateWrapperCSR } from './suspenseManagerClient'
import { WithHydrateWrapperSSR } from './suspenseManagerSSR'
import { isLazyLoadCompatible } from './helpers'
import { lazy } from 'react'

const TPA_WIDGET_NATIVE_COMP_TYPE = 'tpaWidgetNative'
const COMP_TYPES_LAZY_BLACKLIST_PREFIXES = ['HeaderContainer', 'StylableHorizontalMenu', 'DivWithChildren', 'Page']
const isCsr = !!process.env.browser

type ComponentsLoaderFactory = (
	componentsLibraries: ComponentLibraries,
	componentsRegistrars: Array<IComponentsRegistrar>,
	logger: ILogger,
	viewerModel: ViewerModel,
	suspendedComps: SuspendedCompsAPI,
	componentWrapper: IWrapComponent,
	navigationManager: INavigationManager,
	experiments: Experiments,
	propsStore: IPropsStore
) => IComponentsLoader

const isComponentModule = <T>(loader: any): loader is ComponentModule<T> => !!loader.component

const componentsLoaderFactory: ComponentsLoaderFactory = (
	componentsLibraries,
	componentsRegistrars,
	logger,
	viewerModel,
	suspendedComps,
	componentWrapper,
	navigationManager,
	experiments,
	propsStore
) => {
	const lazyManifestsResolvers: Array<() => Promise<void>> = []
	const componentsLoaderRegistry: ComponentsLoaderRegistry = {}
	const componentsRegistry: ComponentsRegistry = {}
	const suspendedComponentsRegistry: ComponentsRegistry = {}
	const compControllersRegistry: CompControllersRegistry = {}
	const compRunControllerPropsPreRender: Record<string, Array<string>> = {}
	const downloadOnViewportWhiteList: Record<string, boolean> = {}
	const suspenseBlacklist =
		viewerModel.react18HydrationBlackListWidgets?.reduce((acc, widgetId) => {
			acc[getCompClassType(TPA_WIDGET_NATIVE_COMP_TYPE, widgetId)] = true
			return acc
		}, {} as Record<string, boolean>) || {}
	const debugRendering = viewerModel.requestUrl.includes('debugRendering=true')
	const shouldWaitForReact = !viewerModel.experiments['specs.thunderbolt.reactScriptsBeforeApp']
	const isOOIComponentsRegistrar = experiments['specs.thunderbolt.ooi_register_with_components_registrar']
	const shouldExpandLazyLoad =
		viewerModel.experiments['specs.thunderbolt.viewport_hydration_extended_react_18'] &&
		viewerModel.experiments['specs.thunderbolt.renderToPipeableStream'] &&
		isLazyLoadCompatible(viewerModel)
	const shouldSuspenseContainers = shouldExpandLazyLoad && !viewerModel.react18HydrationBlackListWidgets?.length

	if (shouldExpandLazyLoad) {
		Object.assign(downloadOnViewportWhiteList, {
			TPAWidget: true,
		})

		if (shouldSuspenseContainers) {
			Object.assign(downloadOnViewportWhiteList, {
				Section: true,
				AppWidget: true,
				ClassicSection: true,
				AppWidget_Classic: true,
			})
		}
	}

	const getComponentLoader = async (compType: string) => {
		const loader = componentsLoaderRegistry[compType]

		if (!loader && lazyManifestsResolvers.length) {
			await Promise.all(lazyManifestsResolvers.map((resolver) => resolver()))
			return componentsLoaderRegistry[compType]
		}

		return loader
	}

	const loadComponentModule = async (compType: string, useRegistry = true) => {
		if (useRegistry && componentsRegistry[compType]) {
			return { component: componentsRegistry[compType] }
		}
		const loader = await getComponentLoader(compType)
		shouldWaitForReact && isCsr && (await window.externalsRegistry.react.loaded) // components require React within their code so they have to be evaluated once React is defined.
		const module = await taskify(() => loader())
		const { wrapComponent } = componentWrapper
		if (isComponentModule(module)) {
			module.component.displayName = compType
			if (module.controller) {
				compControllersRegistry[compType] = module.controller
				compRunControllerPropsPreRender[compType]?.forEach((compId) =>
					propsStore.update({ [compId]: { rendered: true } })
				)
				compRunControllerPropsPreRender[compType] = []
			}
			return { ...module, component: wrapComponent(module.component) }
		}
		return { ...module, component: wrapComponent(module.default) }
	}

	const createSuspenseComponentCSR = (compType: string) => {
		if (suspendedComponentsRegistry[compType]) {
			return suspendedComponentsRegistry[compType]
		}
		const deferredComponentLoaderFactory = (compId: string) => {
			setRunControllerPropsPreRender(compType, compId)
			if (navigationManager.isDuringNavigation() && !navigationManager.isFirstNavigation()) {
				return {
					componentPromise: Promise.resolve(
						loadComponentModule(compType, false).then((module) => module.component)
					),
					onUnmount: () => {},
				}
			}
			const { promise: viewportObserverPromise, cleaner: viewportObserverCleaner } = createViewportObserver(
				compId
			)
			return {
				componentPromise: viewportObserverPromise
					.then(() => loadComponentModule(compType, false))
					.then(async (module) => {
						if (!componentsRegistry[compType]) {
							componentsRegistry[compType] = module.component
						}
						if ((module as any).waitForLoadableReady) {
							const { waitForLoadableReady } = module as any
							await waitForLoadableReady?.(compId)
						}
						return module.component
					}),
				onUnmount: viewportObserverCleaner,
			}
		}
		const comp = WithHydrateWrapperCSR({
			deferredComponentLoaderFactory,
			setIsWaitingSuspense: suspendedComps.setIsWaitingSuspense,
			debugRendering,
		})
		return comp
	}

	const createSuspenseComponentSSR = async (compType: string) => {
		const Comp = (await loadComponentModule(compType)).component
		return WithHydrateWrapperSSR({
			Comp,
		})
	}

	const createSuspenseComponent = isCsr ? createSuspenseComponentCSR : createSuspenseComponentSSR

	const registerComponent = async (compType: string) => {
		return shouldSuspenseComponent(compType)
			? registerSuspendedComponent(compType)
			: loadAndRegisterComponent(compType)
	}

	const shouldReportMissingLoader = (compType: string) =>
		isOOIComponentsRegistrar && compType.startsWith(TPA_WIDGET_NATIVE_COMP_TYPE)

	const setRunControllerPropsPreRender = (compType: string, compId: string) => {
		if (!compRunControllerPropsPreRender[compType]) {
			compRunControllerPropsPreRender[compType] = []
		}
		compRunControllerPropsPreRender[compType].push(compId)
	}

	const loadAndRegisterComponent = async (compType: string) => {
		if (componentsRegistry[compType]) {
			return
		}

		const loader = await getComponentLoader(compType)

		if (!loader) {
			if (shouldReportMissingLoader(compType)) {
				const message = `loadAndRegisterComponent -> Component loader for ${compType} is not defined`
				console.error(message)
				logger.captureError(new Error(message), { tags: { feature: 'components' } })
			}
			return
		}
		// components require React within their code so they have to be evaluated once React is defined.
		shouldWaitForReact && isCsr && (await window.externalsRegistry.react.loaded)
		if (shouldLazyLoadComponent(compType)) {
			const load = () => loadComponentModule(compType, false).then((module) => ({ default: module.component }))
			componentsRegistry[compType] = createSuspenseWrapper(
				isCsr ? lazy(load) : (await load()).default,
				setRunControllerPropsPreRender
			)
		} else {
			componentsRegistry[compType] = (await loadComponentModule(compType)).component
		}
	}

	const registerSuspendedComponent = async (compType: string) => {
		if (suspendedComponentsRegistry[compType]) {
			return
		}

		const loader = await getComponentLoader(compType)

		if (!loader) {
			if (shouldReportMissingLoader(compType)) {
				const message = `registerSuspendedComponent -> Component loader for ${compType} is not defined`
				console.error(message)
				logger.captureError(new Error(message), { tags: { feature: 'components' } })
			}
			return
		}
		// components require React within their code so they have to be evaluated once React is defined.
		shouldWaitForReact && isCsr && (await window.externalsRegistry.react.loaded)
		suspendedComponentsRegistry[compType] = await createSuspenseComponent(compType)
	}

	const shouldLazyLoadComponent = (compType: string) =>
		shouldSuspenseContainers &&
		navigationManager.isFirstPage() &&
		(!isCsr || !window.clientSideRender) &&
		!COMP_TYPES_LAZY_BLACKLIST_PREFIXES.find((prefix) => compType.startsWith(prefix))

	const shouldSuspenseComponent = (compType: string) =>
		isLazyLoadCompatible(viewerModel) &&
		navigationManager.isFirstPage() &&
		!suspenseBlacklist[compType] &&
		(downloadOnViewportWhiteList[compType] ||
			(compType.startsWith(TPA_WIDGET_NATIVE_COMP_TYPE) &&
				experiments['specs.thunderbolt.ooi_lazy_load_components']))

	const getRequiredComps = (structure: AppStructure) => {
		const allCompClassTypes = Object.entries(structure).map(([_, { componentType, uiType, isInSlot }]) => {
			const compClassType = getCompClassType(componentType, uiType)
			if (isInSlot) {
				suspenseBlacklist[compClassType] = true
			}
			return compClassType
		})
		if (allCompClassTypes.includes('RefComponent')) {
			allCompClassTypes.push('BuilderPathsContainer')
		}
		const uniqueCompTypes = [...new Set(allCompClassTypes)]
		return uniqueCompTypes
	}

	const registerLibraries = taskify(async () => {
		const assignComponents = (components: Record<string, any>) => {
			Object.assign(componentsLoaderRegistry, components)
		}

		logger.phaseStarted('componentsLibraries')
		const libs = [...componentsRegistrars, ...(await componentsLibraries)]
		logger.phaseEnded('componentsLibraries')

		logger.phaseStarted('componentLoaders')
		libs.forEach(({ getAllComponentsLoaders, getComponents }) => {
			assignComponents(getComponents())

			if (getAllComponentsLoaders) {
				lazyManifestsResolvers.push(async () => {
					assignComponents(await getAllComponentsLoaders())
				})
			}
		})
		logger.phaseEnded('componentLoaders')
	})

	return {
		getComponentsMap: () => componentsRegistry,
		getCompControllersMap: () => compControllersRegistry,
		loadComponents: async (structure) => {
			await registerLibraries
			const requiredComps = getRequiredComps(structure)
			return Promise.all(requiredComps.map((compType) => registerComponent(compType)))
		},
		loadAllComponents: async () => {
			await registerLibraries
			const requiredComps = Object.keys(componentsLoaderRegistry)
			return Promise.all(requiredComps.map((compType) => registerComponent(compType)))
		},
		loadComponent: async (componentType: string, uiType?: string) => {
			await registerLibraries
			const compType = getCompClassType(componentType, uiType)
			return registerComponent(compType)
		},
		// delete when merging 'specs.thunderbolt.ooi_register_in_app_will_mount'
		registerSuspendedComponent: (compType: string, loader: ComponentLoaderFunction<any>, { uiType } = {}) => {
			const componentType = getCompClassType(compType, uiType)
			componentsLoaderRegistry[componentType] = loader
			registerComponent(componentType)
		},
		// delete when merging 'specs.thunderbolt.ooi_register_in_app_will_mount'
		registerComponent: (compType: string, loader: ComponentLoaderFunction<any>, { uiType } = {}) => {
			const componentType = getCompClassType(compType, uiType)
			componentsLoaderRegistry[componentType] = loader
			return loadAndRegisterComponent(componentType)
		},
		getComponentToRender: (compType: string) =>
			shouldSuspenseComponent(compType)
				? suspendedComponentsRegistry[compType]
				: componentsRegistry[compType] || suspendedComponentsRegistry[compType],
	}
}

export const ComponentsLoader = withDependencies(
	[
		ComponentLibrariesSymbol,
		multi(ComponentsRegistrarSymbol),
		LoggerSymbol,
		ViewerModelSym,
		SuspendedCompsSym,
		ComponentWrapperSymbol,
		NavigationManagerSymbol,
		ExperimentsSymbol,
		Props,
	] as const,
	componentsLoaderFactory
)
