import * as z from "zod/mini";

import {
  GroupWithParticipantsResponse,
  GroupWithParticipantsSchema,
} from "./common";

const ResponseSchema = z.omit(
  z.extend(GroupWithParticipantsSchema, {
    isCommunity: z.boolean(),
    isCommunityAnnounce: z.boolean(),
    joinApprovalMode: z.boolean(),
    memberAddMode: z.boolean(),
  }),
  { pictureUrl: true },
);

export const Response = (response: unknown) => {
  const data = ResponseSchema.parse(response);
  return {
    ...GroupWithParticipantsResponse({
      ...data,
      pictureUrl: null,
    }),
    isCommunity: data.isCommunity,
    isCommunityAnnounce: data.isCommunityAnnounce,
    joinApprovalMode: data.joinApprovalMode,
    memberAddMode: data.memberAddMode,
  };
};

export type FindGroupByInviteCodeResponse = ReturnType<typeof Response>;
