import type { HttpClient } from '../types/controller';
import type { InjectedGlobalSettings, PublicMember, RolesMap } from '../types';

export class ProfileCardMiddlewareService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly isEditor: boolean,
  ) {}

  async getMember(uid: string) {
    const { data } = await this.httpClient.get<PublicMember>(
      `/_serverless/profile-card-middleware/member/${uid}`,
    );

    return data;
  }

  async getRolesMap() {
    const { data } = await this.httpClient.get<RolesMap>(
      `/_serverless/profile-card-middleware/roles-map`,
    );

    return data;
  }

  async getGlobalSettings() {
    const { data } = await this.httpClient.get<InjectedGlobalSettings>(
      `/_serverless/profile-card-middleware/global-settings`,
      { params: { isEditor: this.isEditor ? 'true' : 'false' } },
    );

    return data;
  }
}
