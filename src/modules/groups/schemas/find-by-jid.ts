import {
  GroupWithParticipantsResponse,
  GroupWithParticipantsSchema,
} from "./common";

export const ResponseSchema = GroupWithParticipantsSchema;

export const Response = (response: unknown) => {
  const data = ResponseSchema.parse(response);
  return GroupWithParticipantsResponse(data);
};

export type FindGroupByJidResponse = ReturnType<typeof Response>;
