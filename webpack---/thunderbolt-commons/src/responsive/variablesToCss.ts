import type {
	ItemsAlignmentValue,
	JustifyContentValue,
	UnitSizeValue,
	VariablesValues,
	NumberValue,
	PositionTypeValue,
} from '@wix/thunderbolt-becky-types'
import {
	unitSizeToString,
	gridAlignmentToString,
	flexAlignmentToString,
	flexJustifyContentToString,
	numberToString,
} from './layoutValuesToCss'

export const isUnitSizeValue = (value: VariablesValues): value is UnitSizeValue => value.type === 'UnitSizeValue'
export const isItemsAlignmentValue = (value: VariablesValues): value is ItemsAlignmentValue =>
	value.type === 'ItemsAlignmentValue'
export const isJustifyContentValue = (value: VariablesValues): value is JustifyContentValue =>
	value.type === 'JustifyContentValue'
export const isNumberValue = (value: VariablesValues): value is NumberValue => value.type === 'NumberValue'

export const isPositionTypeValue = (value: VariablesValues): value is PositionTypeValue =>
	value.type === 'PositionTypeValue'

const getBaseVarName = (varId: string) => `--${varId}`

const getVarNameWithSuffix = (varId: string, suffix: string) => `${getBaseVarName(varId)}-${suffix}`

export const variableNameGetters = {
	unitSize: {
		get: (varId: string) => getBaseVarName(varId),
	},
	alignment: {
		getForGrid: (varId: string) => getVarNameWithSuffix(varId, 'grid'),
		getForFlex: (varId: string) => getVarNameWithSuffix(varId, 'flex'),
	},
	justifyContent: {
		get: (varId: string) => getBaseVarName(varId),
	},
	number: {
		get: (varId: string) => getBaseVarName(varId),
	},
	position: {
		get: (varId: string) => getBaseVarName(varId),
		getForceAuto: (varId: string) => getVarNameWithSuffix(varId, 'force-auto'),
	},
}

export const getVariableCss = (
	varValue: VariablesValues,
	variableKey: string,
	environmentRefs: { renderSticky: boolean }
): Record<string, string> => {
	if (isUnitSizeValue(varValue)) {
		return { [variableNameGetters.unitSize.get(variableKey)]: unitSizeToString(varValue.value) }
	}

	if (isItemsAlignmentValue(varValue)) {
		return {
			[variableNameGetters.alignment.getForGrid(variableKey)]: gridAlignmentToString(varValue.value),
			[variableNameGetters.alignment.getForFlex(variableKey)]: flexAlignmentToString(varValue.value),
		}
	}

	if (isJustifyContentValue(varValue)) {
		return {
			[variableNameGetters.justifyContent.get(variableKey)]: flexJustifyContentToString(varValue.value),
		}
	}

	if (isNumberValue(varValue)) {
		return { [variableNameGetters.number.get(variableKey)]: numberToString(varValue.value) }
	}

	if (isPositionTypeValue(varValue)) {
		const isSticky = varValue.value === 'sticky' || varValue.value === 'stickyToHeader'
		const isStickyDisabled = isSticky && !environmentRefs.renderSticky
		if (isStickyDisabled) {
			return {
				[variableNameGetters.position.get(variableKey)]: 'relative',
				[variableNameGetters.position.getForceAuto(variableKey)]: 'auto',
			}
		}
		return {
			[variableNameGetters.position.get(variableKey)]: varValue.value,
			[variableNameGetters.position.getForceAuto(variableKey)]: varValue.value === 'sticky' ? 'initial' : 'auto',
		}
	}

	return {}
}
