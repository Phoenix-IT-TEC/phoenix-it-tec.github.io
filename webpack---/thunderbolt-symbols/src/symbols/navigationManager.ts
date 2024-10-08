export const NavigationManagerSymbol = Symbol('NavigationManager')

export type NavigationStartListener = () => void

export interface INavigationManager {
	isDuringNavigation(): boolean
	isFirstNavigation(): boolean
	startNavigation(isLightbox?: boolean): void
	setShouldBlockRender(shouldBlockRender: boolean): void
	shouldBlockRender(): boolean
	endNavigation(): void
	waitForShouldContinueNavigation(): Promise<boolean>
	waitForNavigationEnd(): Promise<void>
	startDataFetching(): void
	endDataFetching(): void
	isDuringDataFetching(): boolean
	waitForDataFetching(): Promise<void>
	registerToNavigationStart(listener: NavigationStartListener): () => void
	getLastNavigationTimings(): { start: null | number; end: null | number }
	isFirstPage(): boolean
}
