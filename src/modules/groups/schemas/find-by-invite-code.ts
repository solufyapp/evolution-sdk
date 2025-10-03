import * as z from "zod";

import {
  GroupWithParticipantsResponseSchema,
  GroupWithParticipantsResponseSchemaTransform,
} from "./common";

export const FindGroupByInviteCodeResponseSchema =
  GroupWithParticipantsResponseSchema.extend({
    isCommunity: z.boolean(),
    isCommunityAnnounce: z.boolean(),
    joinApprovalMode: z.boolean(),
    memberAddMode: z.boolean(),
  })
    .omit({ pictureUrl: true })
    .transform((group) => ({
      ...GroupWithParticipantsResponseSchemaTransform({
        ...group,
        pictureUrl: null,
      }),
      isCommunity: group.isCommunity,
      isCommunityAnnounce: group.isCommunityAnnounce,
      joinApprovalMode: group.joinApprovalMode,
      memberAddMode: group.memberAddMode,
    }));

export type FindGroupByInviteCodeResponse = z.infer<
  typeof FindGroupByInviteCodeResponseSchema
>;

export { FindGroupByInviteCodeResponseSchema as ResponseSchema };
