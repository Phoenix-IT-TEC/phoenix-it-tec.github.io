import { withDependencies } from '@wix/thunderbolt-ioc'
import { CompsLifeCycleSym, ICompsLifeCycle } from '@wix/thunderbolt-symbols'
import { IWrapComponent } from './types'
import React, { ComponentType, useEffect } from 'react'
import { isForwardRef } from 'react-is'

export const ComponentWrapper = withDependencies(
	[CompsLifeCycleSym],
	(compsLifeCycle: ICompsLifeCycle): IWrapComponent => {
		return {
			wrapComponent: <T extends { id: string; compId?: string }>(Component: ComponentType<Omit<T, 'compId'>>) => {
				const Wrapper = ({ compId, ...props }: T, ref: any) => {
					const { id } = props
					useEffect(() => {
						compsLifeCycle.notifyCompDidMount(compId ?? id, id) // we call it when the id\displayed id changes although it's not mount
						return () => {
							compsLifeCycle.componentDidUnmount(compId ?? id, id)
						}
					}, [compId, id])
					const compWithProps = <Component {...props} />
					return (
						<Component
							{...props}
							ref={isForwardRef(compWithProps) && ref && typeof ref === 'function' ? ref : null}
						/>
					)
				}
				const MemoWrapper = React.memo(React.forwardRef(Wrapper))
				return React.forwardRef((props: any, ref: any) => <MemoWrapper {...props} ref={ref} />)
			},
		}
	}
)
