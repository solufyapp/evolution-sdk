import * as z from "zod";

import {
  GroupResponseSchema,
  GroupResponseSchemaTransform,
  GroupWithParticipantsResponseSchema,
  GroupWithParticipantsResponseSchemaTransform,
} from "./common";

export const FindAllGroupsResponseSchema = z
  .array(GroupResponseSchema)
  .transform((groups) => groups.map(GroupResponseSchemaTransform));

export const FindAllGroupsWithParticipantsResponseSchema = z
  .array(GroupWithParticipantsResponseSchema)
  .transform((groups) =>
    groups.map(GroupWithParticipantsResponseSchemaTransform),
  );

export type FindAllGroupsResponse = z.infer<typeof FindAllGroupsResponseSchema>;
export type FindAllGroupsWithParticipantsResponse = z.infer<
  typeof FindAllGroupsWithParticipantsResponseSchema
>;

export {
  FindAllGroupsResponseSchema as ResponseSchema,
  FindAllGroupsWithParticipantsResponseSchema as ResponseWithParticipantsSchema,
};
