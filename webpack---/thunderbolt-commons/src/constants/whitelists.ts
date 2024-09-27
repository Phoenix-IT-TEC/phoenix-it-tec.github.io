import { Experiments, SiteAssetsExperimentMetadata } from '@wix/thunderbolt-symbols'
import { siteAssetsModules } from './siteAssetsModules'

const createExperiments = <T extends Record<string, SiteAssetsExperimentMetadata>>(obj: T) => obj

export const beckySpecs = createExperiments({
	'specs.thunderbolt.musicPlayerWaitUntilPlayed': { modules: siteAssetsModules },
	'specs.thunderbolt.fixRatingsInputLeftShift': {
		modules: ['thunderbolt-features', 'thunderbolt-css', 'thunderbolt-platform'],
	},
	'specs.thunderbolt.supportPositionDesignVar': { modules: siteAssetsModules },
	dm_changeCSMKeys: {
		modules: ['thunderbolt-features', 'thunderbolt-platform', 'thunderbolt-site-map'],
	},
	'specs.thunderbolt.deprecateAppId': {
		modules: ['thunderbolt-features', 'thunderbolt-platform', 'thunderbolt-site-map'],
	},
	'specs.thunderbolt.breakingBekyCache': { modules: siteAssetsModules },
	'specs.thunderbolt.DatePickerPortal': { modules: siteAssetsModules },
	'specs.thunderbolt.LinkBarPlaceholderImages': { modules: siteAssetsModules },
	'specs.thunderbolt.presenceApi': { modules: siteAssetsModules },
	'specs.thunderbolt.presenceWithoutChat': { modules: siteAssetsModules },
	'specs.thunderbolt.repeater_keyboard_navigation': { modules: siteAssetsModules },
	'specs.thunderbolt.WRichTextResponsiveTagsInBlocksWidget': { modules: siteAssetsModules },
	'specs.thunderbolt.dropdownOptionStyle': { modules: siteAssetsModules },
	'specs.thunderbolt.oneDocStrictMode': {
		modules: ['thunderbolt-features', 'thunderbolt-css', 'thunderbolt-platform'],
	},
	'specs.thunderbolt.prefetchPageResourcesVeloApi': { modules: ['thunderbolt-features'] },
	'specs.thunderbolt.shouldUseViewTransition': { modules: ['thunderbolt-features'] },
	'specs.thunderbolt.native_css_mappers_video': { modules: ['thunderbolt-css'] },
	'specs.thunderbolt.edixIsInFirstFold': {
		modules: ['thunderbolt-features', 'thunderbolt-platform', 'thunderbolt-site-map'],
	},
	'specs.thunderbolt.shouldUseResponsiveImages': { modules: ['thunderbolt-features'] },
	'specs.thunderbolt.DDMenuMigrateCssCarmiMapper': { modules: siteAssetsModules },
	'specs.thunderbolt.supportSpxInEEMappers': { modules: siteAssetsModules },
	'specs.thunderbolt.AnalyticsElementsClicks': { modules: siteAssetsModules },
	'specs.thunderbolt.roundBordersInResponsiveContainer': { modules: siteAssetsModules },
	'specs.thunderbolt.customDropdownForMobile': { modules: siteAssetsModules },
	'specs.studio.breadcrumbsSection': { modules: siteAssetsModules },
	'specs.thunderbolt.designableListForMobileDropdown': { modules: siteAssetsModules },
	'specs.thunderbolt.fiveGridLineStudioSkins': {
		modules: ['thunderbolt-features', 'thunderbolt-platform'],
	},
	'specs.thunderbolt.keepTextInputHeight': { modules: siteAssetsModules },
	'specs.thunderbolt.fetchBlocksDevCenterWidgetIds': {
		modules: ['thunderbolt-features', 'thunderbolt-css', 'thunderbolt-platform', 'thunderbolt-site-map'],
	},
	'specs.thunderbolt.migrateStylableComponentsInBlocksWidgets': { modules: siteAssetsModules },
	'specs.thunderbolt.WRichTextPropsMapper': { modules: ['thunderbolt-features', 'thunderbolt-platform'] },
	'specs.thunderbolt.doNotInflateSharedParts': {
		modules: ['thunderbolt-features', 'thunderbolt-css', 'thunderbolt-platform', 'thunderbolt-site-map'],
	},
	'specs.thunderbolt.BuilderComponent': {
		modules: ['thunderbolt-features', 'thunderbolt-css', 'thunderbolt-platform', 'thunderbolt-site-map'],
	},
	'specs.thunderbolt.CollapsibleTextNewPreviewStateImplementation': { modules: siteAssetsModules },
	'specs.thunderbolt.TextInputAutoFillFix': { modules: ['thunderbolt-features', 'thunderbolt-platform'] },
	'specs.thunderbolt.SetNoCacheOnRefComponentError': { modules: siteAssetsModules },
	'specs.thunderbolt.removeHeaderFooterWrappers': { modules: ['thunderbolt-features', 'thunderbolt-css'] },
	'specs.thunderbolt.carouselGalleryImageFitting': { modules: siteAssetsModules },
	'specs.thunderbolt.fontsFromExternal': { modules: ['thunderbolt-css'] },
	'specs.thunderbolt.fixAnchorSections': { modules: siteAssetsModules },
	'specs.thunderbolt.allowCustomElementForAll': { modules: siteAssetsModules },
	'specs.thunderbolt.fixDisabledLinkButtonStyles': { modules: siteAssetsModules },
	'specs.thunderbolt.buttonUdp': { modules: siteAssetsModules },
	'specs.thunderbolt.enableOneDoc': { modules: ['thunderbolt-features', 'thunderbolt-css', 'thunderbolt-platform'] },
	'specs.thunderbolt.mergeSkinDefaultsFromRegistry': { modules: siteAssetsModules },
	'specs.thunderbolt.allowAnimatedImageTransform': { modules: ['thunderbolt-features'] },
	'specs.thunderbolt.PayPalButtonRedirectFlow': { modules: siteAssetsModules },
	'specs.thunderbolt.A11yWPhotoPopupSemanticsAndKeyboardOperability': {
		modules: ['thunderbolt-features', 'thunderbolt-platform'],
	},
	'specs.thunderbolt.magnifyKeyboardOperability': { modules: siteAssetsModules },
	'specs.thunderbolt.useInternalBlocksRefType': {
		modules: ['thunderbolt-features', 'thunderbolt-css', 'thunderbolt-platform', 'thunderbolt-site-map'],
	},
	'specs.thunderbolt.fixGoogleMapLanguage': { modules: siteAssetsModules },
	'specs.thunderbolt.compCssMappers_catharsis': { modules: ['thunderbolt-css'] },
	'specs.thunderbolt.one_cell_grid_display_flex': { modules: ['thunderbolt-css'] },
	'specs.thunderbolt.one_cell_grid_display_block': { modules: ['thunderbolt-css'] },
	'specs.thunderbolt.comp_designCss_selectorToCss_Mappers_catharsis': { modules: ['thunderbolt-css'] },
	'specs.thunderbolt.ooiCssAsLinkTag': { modules: ['thunderbolt-css'] },
	'specs.thunderbolt.motionFeature': { modules: ['thunderbolt-features', 'thunderbolt-css'] },
	'specs.thunderbolt.motionBgScrub': { modules: ['thunderbolt-features', 'thunderbolt-css'] },
	'specs.thunderbolt.motionScrollMoveIgnoreOffsets': { modules: ['thunderbolt-features'] },
	'specs.thunderbolt.dynamicLoadTpaFeature': { modules: siteAssetsModules },
	'specs.thunderbolt.sandboxForCustomElement': { modules: siteAssetsModules },
	'specs.thunderbolt.fixCustomElementInWidgetInRepeater': { modules: siteAssetsModules },
	'specs.thunderbolt.forceStudio': { modules: siteAssetsModules },
	'specs.thunderbolt.accordionHeightAuto': { modules: siteAssetsModules },
	'specs.thunderbolt.minMaxInCheckboxGroup': { modules: siteAssetsModules },
	'specs.thunderbolt.newVhCalc': { modules: ['thunderbolt-css'] },
	'specs.thunderbolt.noHeightOnTextMask': { modules: ['thunderbolt-css'] },
	'specs.thunderbolt.WRichTextVerticalTextNowidth': { modules: siteAssetsModules },
	'specs.thunderbolt.newSpxResolving': { modules: ['thunderbolt-css'] },
	'specs.thunderbolt.useSvgLoaderFeature': { modules: ['thunderbolt-features'] },
	'specs.thunderbolt.WixFreeSiteBannerDesktop': {
		modules: ['thunderbolt-features', 'thunderbolt-css', 'thunderbolt-platform'],
	},
	'specs.thunderbolt.WixFreeSiteBannerMobile': {
		modules: ['thunderbolt-features', 'thunderbolt-css', 'thunderbolt-platform'],
	},
	'specs.thunderbolt.dataBindingInMasterResponsive': {
		modules: ['thunderbolt-features', 'thunderbolt-css', 'thunderbolt-platform', 'thunderbolt-site-map'],
	},
})

/*
 * This list contains experiments names that are relevant to code running in site-assets (A.K.A Becky)
 * They are available via envApi.getExperiments() for carmi code and compInfo['experiments'] for components mappers
 * If the code that uses the experiment runs in feature - you don't need to add it here
 * See becky experiment guidelines here: https://wix.slack.com/canvas/C4D8A09PZ
 * */
export type beckyWhitelistSpecType = keyof typeof beckySpecs
export const beckyWhitelist = Object.keys(beckySpecs) as Array<beckyWhitelistSpecType>

/*
 * This list contains experiments names that are relevant to data-fixer code running in site-assets
 * They are passed to becky (site-assets modules) so that it can get fixed JSONs as input
 * Add only data-fixers experiments relevant to TB (they will be sent only if the experiment is open in thunderbolt-viewer scope)
 * */
export const dataFixersSpecsWhitelist = [
	'sv_migrateTpaToSemiNative',
	'bv_migrateAbsoluteLayoutToDataMaps',
	'bv_scrollEffectsFixer',
	'bv_migrate',
	'bv_migrateResponsiveLayoutToSingleLayoutData',
	'dm_removeMissingResponsiveRefs',
	'bv_removeMenuDataFromPageJson',
	'dm_fixMobileSplitInVariantNs',
	'dm_fixMobileSplitDesign',
	'dm_keepChildlessAppWidget',
	'dm_removeResponsiveDataFromClassicEditorFixer',
	'dm_enableDefaultA11ySettings',
	'dm_linkRelDefaults',
	'specs.thunderbolt.use_data_fixed_pages_upstream',
	'dm_meshLayout',
]

/*
 * This list contains experiments names that are relevant to data-fixer code running in site-assets
 * They are passed to becky (site-assets modules) so that it can get fixed JSONs as input
 * These experiments are always sent, regardless of conduction in thunderbolt-viewer scope.
 * */
export const hardCodedListOfDataFixersExperiments: Experiments = {}
