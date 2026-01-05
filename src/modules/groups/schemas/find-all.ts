import * as z from "zod/mini";

import {
  GroupResponse,
  GroupSchema,
  GroupWithParticipantsResponse,
  GroupWithParticipantsSchema,
} from "./common";

const ResponseSchema = z.array(GroupSchema);
const ResponseWithParticipantsSchema = z.array(GroupWithParticipantsSchema);

export const Response = (response: unknown) => {
  const data = ResponseSchema.parse(response);
  return data.map(GroupResponse);
};

export const ResponseWithParticipants = (response: unknown) => {
  const data = ResponseWithParticipantsSchema.parse(response);
  return data.map(GroupWithParticipantsResponse);
};

export type FindAllGroupsResponse = ReturnType<typeof Response>;
export type FindAllGroupsWithParticipantsResponse = ReturnType<
  typeof ResponseWithParticipants
>;
