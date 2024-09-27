import type { CSSProperties } from 'react';
import type {
  CompInfo,
  AnyCompDef,
  MapperFunc,
  UiTypeMapperFunc,
  ValuesToRefs,
  NativeExtension,
  UiTypeNativeExtension,
  IComponentMapperModel,
  RefApi,
  RefApiValues,
  ICompControllerHook,
  MapperArgs,
} from '@wix/editor-elements-types/thunderbolt';

type ReactStyles = CSSProperties & Record<`--${string}`, string | number>;

type Props = Record<string, any>;

/**
 * We need to:
 * 1. Extract nested namespaces, like refApi.env, refApi.domain - RefApiValues[keyof RefApiValues]>
 * 2. Then we intersect them
 * 3. So will create mapped type and merge all this into one type
 */

// https://github.com/microsoft/TypeScript/issues/29594
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type IntersectedRefApiValues = UnionToIntersection<
  RefApiValues[keyof RefApiValues] & {
    observeChildListChangeMaster: (
      parentId: string,
      target: HTMLElement,
    ) => void;
  }
>;

export type StateRefsApiValues = {
  [K in keyof IntersectedRefApiValues]: IntersectedRefApiValues[K];
};

export type StateRefGetters = {
  [K in keyof StateRefsApiValues]: () => ValuesToRefs<StateRefsApiValues>[K];
};

export type PickStateRefValues<K extends keyof StateRefGetters> = {
  [T in K]: StateRefsApiValues[T];
};

type CompInfoOverrides = Record<keyof CompInfo, Record<string, any>>;

export const withCompInfo =
  <
    TCompProps extends Props,
    TDefinition extends AnyCompDef,
    TCarmiData = undefined,
    TOverrides extends Partial<CompInfoOverrides> | undefined = undefined,
  >() =>
  <
    TDependencies extends keyof CompInfo<TDefinition>,
    TResolverFunc extends MapperFunc<
      TCompProps,
      TDefinition,
      TDependencies,
      TCarmiData,
      TOverrides
    >,
  >(
    depsArray: Array<TDependencies>,
    resolver: TResolverFunc,
    enhancers: Array<
      (
        v: MapperArgs<TDependencies, TDefinition, TOverrides>,
      ) => MapperArgs<TDependencies, TDefinition, TOverrides>
    > = [],
  ): NativeExtension<
    TCompProps,
    TDefinition,
    TDependencies,
    TCarmiData,
    TOverrides
  > => {
    const deps = depsArray.reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<TDependencies, true>,
    );

    return {
      deps,
      resolver: enhancers.length
        ? (rawCompInfo, carmiData) => {
            const enhancedCompInfo = enhancers.reduce(
              (compInfo, enhancer) => enhancer(compInfo),
              rawCompInfo,
            );
            return resolver(enhancedCompInfo, carmiData);
          }
        : resolver,
    };
  };

type WithUiTypeCompInfo = <
  TUiType extends string,
  TDefinition extends AnyCompDef,
  TCarmiData = undefined,
>() => <
  TDependencies extends keyof CompInfo<TDefinition>,
  TResolverFunc extends UiTypeMapperFunc<
    TUiType,
    TDefinition,
    TDependencies,
    TCarmiData
  >,
>(
  depsArray: Array<TDependencies>,
  resolver: TResolverFunc,
) => UiTypeNativeExtension<TUiType, TDefinition, TDependencies, TCarmiData>;

export const withUiTypeCompInfo: WithUiTypeCompInfo = withCompInfo as any;

export const withStateRefs =
  <
    StateRefsValues extends Record<string, any>,
    TDefinition extends AnyCompDef = AnyCompDef,
    TCarmiData = undefined,
  >() =>
  <
    TDependencies extends keyof CompInfo<TDefinition>,
    TResolverFunc extends MapperFunc<
      ValuesToRefs<StateRefsValues>,
      TDefinition,
      TDependencies | 'refApi',
      TCarmiData
    >,
  >(
    depsArray: Array<TDependencies>,
    resolver: TResolverFunc,
  ) => {
    const refApiKey: keyof CompInfo<TDefinition> = 'refApi';
    const deps = [...depsArray, refApiKey];
    const withCompInfoFunc = withCompInfo<
      ValuesToRefs<StateRefsValues>,
      TDefinition,
      TCarmiData
    >();

    return withCompInfoFunc(deps, resolver);
  };

const getStateRefGetters = (
  stateRefsKeys: Array<keyof StateRefGetters>,
  refApi: RefApi,
) => {
  const stateRefsGetters = Object.values(refApi).reduce(
    (acc, featureDomain) => ({
      ...acc,
      ...featureDomain,
    }),
    {},
  ) as StateRefGetters;

  return stateRefsKeys.reduce((acc, key) => {
    if (!stateRefsGetters[key]) {
      return acc;
    }

    return {
      ...acc,
      [key]: stateRefsGetters[key](),
    };
  }, {} as Partial<StateRefGetters>);
};

export const withStateRefsValues = <
  TStateRefsKeys extends keyof StateRefsApiValues,
>(
  stateRefsKeys: Array<TStateRefsKeys>,
) => {
  return withCompInfo()(['refApi'], ({ refApi }) => {
    return getStateRefGetters(stateRefsKeys, refApi);
  });
};

export function createComponentMapperModel<
  TComponentMapperModel extends IComponentMapperModel,
>(mapper: TComponentMapperModel): TComponentMapperModel {
  return mapper;
}

export interface IPlatformData<
  TMapperProps extends Props,
  TComponentProps extends Props = never,
  TStateValues extends Partial<StateRefsApiValues> = never,
> {
  mapperProps: TMapperProps;
  stateValues: TStateValues;
  controllerUtils: {
    updateProps(partialProps: Partial<TComponentProps>): void;
    updateStyles(styles: ReactStyles): void;
  };
}

const isCSSVariable = (str: string) => str.startsWith('--');

const camelCaseToDashCase = (str: string) =>
  str.replace(/([A-Z])/g, val => `-${val.toLowerCase()}`);

const patchControllerUtils = (controllerUtils: {
  updateProps(partialProps: Record<string, any>): void;
  updateStyles(styles: Record<string, string | null>): void;
}) => {
  /**
   * From this: { marginTop: 10 }
   * to this { margin-top: 10 }
   */
  const patchedUpdateStyles = (reactStyles: ReactStyles) => {
    const styles = Object.entries(reactStyles).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [isCSSVariable(key) ? key : camelCaseToDashCase(key)]:
          value === undefined ? null : value,
      }),
      {},
    );

    controllerUtils.updateStyles(styles);
  };
  return {
    ...controllerUtils,
    updateStyles: patchedUpdateStyles,
  };
};

export const withCompController = <
  TMapperProps extends Props,
  TControllerProps extends Props,
  TComponentProps extends Props = never,
  TStateValues extends Partial<StateRefsApiValues> = never,
>(
  componentPropsCreator: (
    platformData: IPlatformData<TMapperProps, TComponentProps, TStateValues>,
  ) => TControllerProps,
): ICompControllerHook<TMapperProps, TControllerProps, TStateValues> => {
  return {
    useComponentProps: (mapperProps, stateValues, controllerUtils) => {
      const patchedUtils = patchControllerUtils(controllerUtils);

      return componentPropsCreator({
        mapperProps,
        stateValues,
        controllerUtils: patchedUtils,
      });
    },
  };
};
