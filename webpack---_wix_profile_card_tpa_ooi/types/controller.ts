import { ControllerParams } from '@wix/yoshi-flow-editor';

export type RequiredControllerParams = Pick<
  ControllerParams,
  'controllerConfig' | 'flowAPI'
>;

export type FlowAPI = ControllerParams['flowAPI'];

export type HttpClient = FlowAPI['httpClient'];

export type WixExperiments = FlowAPI['experiments'];

export type ControllerConfig = ControllerParams['controllerConfig'];

export type WixCodeApi = ControllerParams['controllerConfig']['wixCodeApi'];

export type ViewMode = WixCodeApi['window']['viewMode'];

export enum WarmupDataKey {
  InitialData = 'initialData',
}
