import * as memberToMemberBlocksApi from '@wix/ambassador-members-v1-member-to-member-block/http';

import { HttpClient } from '../../types/controller';

export class BlockMemberService {
  constructor(private readonly httpClient: HttpClient) {}

  async blockMember(memberId: string) {
    return this.httpClient.request(
      memberToMemberBlocksApi.blockMember({ memberId }),
    );
  }
}
