import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { PasswordProtectedPageApi } from './passwordProtectedPageApi'
import { PasswordProtectedPageApiSymbol } from './symbols'
import type { IPasswordProtectedPageApi } from './types'
import { LifeCycle } from '@wix/thunderbolt-symbols'

export const site: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.AppDidMountHandler, PasswordProtectedPageApiSymbol).to(PasswordProtectedPageApi)
}

export { PasswordProtectedPageApiSymbol, IPasswordProtectedPageApi }
