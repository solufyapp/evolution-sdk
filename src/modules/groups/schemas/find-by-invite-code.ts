import * as z from "zod/mini";

import {
  GroupWithParticipantsResponseSchema,
  GroupWithParticipantsResponseSchemaTransform,
} from "./common";

export const FindGroupByInviteCodeResponseSchema = z.pipe(
  z.omit(
    z.extend(GroupWithParticipantsResponseSchema, {
      isCommunity: z.boolean(),
      isCommunityAnnounce: z.boolean(),
      joinApprovalMode: z.boolean(),
      memberAddMode: z.boolean(),
    }),
    { pictureUrl: true },
  ),
  z.transform((group) => ({
    ...GroupWithParticipantsResponseSchemaTransform({
      ...group,
      pictureUrl: null,
    }),
    isCommunity: group.isCommunity,
    isCommunityAnnounce: group.isCommunityAnnounce,
    joinApprovalMode: group.joinApprovalMode,
    memberAddMode: group.memberAddMode,
  })),
);

export type FindGroupByInviteCodeResponse = z.infer<
  typeof FindGroupByInviteCodeResponseSchema
>;

export { FindGroupByInviteCodeResponseSchema as ResponseSchema };
