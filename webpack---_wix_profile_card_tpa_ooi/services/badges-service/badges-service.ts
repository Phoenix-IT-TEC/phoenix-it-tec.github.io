import { BadgeType } from '@wix/members-badge-lib';

import { HttpClient } from '../../types/controller';

interface BadgeListResponse {
  badges: BadgeType[];
}

export class BadgesService {
  constructor(
    private readonly baseUrl: string,
    private readonly httpClient: HttpClient,
  ) {}

  readonly getBadgeList = async () => {
    const url = `${this.baseUrl}/badges`;
    const { data } = await this.httpClient.get<BadgeListResponse>(url);

    return data.badges;
  };
}
