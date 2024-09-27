import { ControllerParams } from '@wix/yoshi-flow-editor';

import { InjectedGlobalSettings, Origin } from '../../types';
import { HttpClient } from '../../types/controller';

type ViewMode =
  ControllerParams['controllerConfig']['wixCodeApi']['window']['viewMode'];

export class SettingsService {
  constructor(
    private readonly componentId: string,
    private readonly baseUrl: string,
    private readonly httpClient: HttpClient,
  ) {}

  async getGlobalSettings(viewMode: ViewMode) {
    const url = `${this.baseUrl}/settings/global`;
    const queryParams = this.getQueryParams(viewMode);
    const { data } = await this.httpClient.get<InjectedGlobalSettings>(
      `${url}?${queryParams}`,
    );

    return data;
  }

  async patchGlobalSettings(globalSettings: Partial<InjectedGlobalSettings>) {
    const url = `${this.baseUrl}/settings/merge/global`;
    const queryParams = this.getQueryParams('Editor');
    const { data } = await this.httpClient.put(
      `${url}?${queryParams}`,
      globalSettings,
    );

    return data;
  }

  private getQueryParams(viewMode: ViewMode) {
    const viewModeLowerCased = viewMode.toLocaleLowerCase();
    return `compId=${this.componentId}&appComponent=${Origin.Profile}&viewMode=${viewModeLowerCased}`;
  }
}
