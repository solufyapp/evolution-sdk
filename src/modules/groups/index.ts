import * as z from "zod/mini";

import type { ApiService } from "@/api/service";
import type { GroupInviteCode, GroupJid } from "@/types/tags";
import { Routes } from "@/api/routes";
import { GroupInviteCodeSchema, GroupJidSchema } from "@/schemas/common";

import * as FindAll from "./schemas/find-all";
import * as FindByInviteCode from "./schemas/find-by-invite-code";
import * as FindByJid from "./schemas/find-by-jid";

export class GroupsModule {
  constructor(private readonly api: ApiService) {}

  /**
   * Gets all groups
   * @param getParticipants - Whether to get participants
   */
  async findAll(getParticipants: false): Promise<FindAll.FindAllGroupsResponse>;
  async findAll(
    getParticipants: true,
  ): Promise<FindAll.FindAllGroupsWithParticipantsResponse>;
  async findAll(
    getParticipants = false,
  ): Promise<
    | FindAll.FindAllGroupsResponse
    | FindAll.FindAllGroupsWithParticipantsResponse
  > {
    const response = await this.api.get(Routes.Groups.FindAll, {
      params: { getParticipants: z.boolean().parse(getParticipants) },
    });

    if (getParticipants) {
      return FindAll.ResponseWithParticipants(response);
    }
    return FindAll.Response(response);
  }

  /**
   * Gets a group by invite code
   * @param inviteCode - The group invite code (not the URL)
   */
  async findByInviteCode(
    inviteCode: string | GroupInviteCode,
  ): Promise<FindByInviteCode.FindGroupByInviteCodeResponse> {
    const response = await this.api.get(Routes.Groups.FindByInviteCode, {
      params: { inviteCode: GroupInviteCodeSchema.parse(inviteCode) },
    });

    return FindByInviteCode.Response(response);
  }

  /**
   * Gets a group by JID
   * @param groupJid - The group JID terminated with \@g.us
   */
  async findByJid(
    groupJid: string | GroupJid,
  ): Promise<FindByJid.FindGroupByJidResponse> {
    const response = await this.api.get(Routes.Groups.FindByJid, {
      params: { groupJid: GroupJidSchema.parse(groupJid) },
    });

    return FindByJid.Response(response);
  }
}
