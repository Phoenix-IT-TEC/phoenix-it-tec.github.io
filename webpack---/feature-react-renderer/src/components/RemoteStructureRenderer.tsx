import React, { ComponentType, useContext, useMemo } from 'react'
import type { RendererProps } from '../types'
import { extendStoreWithSubscribe } from './extendStoreWithSubscribe'
import Context from './AppContext'
import StructureComponent from './StructureComponent'
import type { Structure } from '@wix/thunderbolt-becky-types'
import { AppStructure, PropsMap } from '@wix/thunderbolt-symbols'
import { getStore } from 'feature-stores'

interface RemoteStructureRendererProps {
	id: string
	structure: Structure
	compProps: Record<string, any>
	rootCompId: string
	siteStylesCSS?: string
	activeVariants?: Array<string>
	megaStore: any
}

const RemoteStructureRenderer: ComponentType<RemoteStructureRendererProps> = (props) => {
	const { id, structure, compProps, rootCompId, siteStylesCSS, activeVariants = [], megaStore } = props
	const context = useContext(Context) as RendererProps
	const css = useMemo(() => {
		if (rootCompId && megaStore && context.componentCssRenderer) {
			return context.componentCssRenderer.renderMegaStore(rootCompId, megaStore)
		}

		return null
	}, [rootCompId, megaStore, context.componentCssRenderer])

	if (!structure || !compProps || !rootCompId) {
		return null
	}

	const structureStore = extendStoreWithSubscribe(
		getStore<AppStructure>(),
		context.batchingStrategy,
		context.layoutDoneService
	)
	structureStore.update(structure)

	const propsStore = extendStoreWithSubscribe(
		getStore<PropsMap>(),
		context.batchingStrategy,
		context.layoutDoneService
	)
	propsStore.update(compProps) // TODO run inner elements mappers somehow

	const scopedContextValue = {
		...context,
		structure: structureStore,
		props: propsStore,
	} as RendererProps

	return (
		<div id={id} className={activeVariants.join(' ')}>
			{css}
			{Boolean(siteStylesCSS) && <style data-id={`${id}_siteStylesCSS`}>{siteStylesCSS}</style>}

			<Context.Provider value={scopedContextValue}>
				<StructureComponent
					id={rootCompId}
					scopeData={{
						scope: [],
						repeaterItemsIndexes: [],
					}}
				/>
			</Context.Provider>
		</div>
	)
}

export default RemoteStructureRenderer
