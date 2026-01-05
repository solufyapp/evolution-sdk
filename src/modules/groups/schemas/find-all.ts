import * as z from "zod/mini";

import {
  GroupResponseSchema,
  GroupResponseSchemaTransform,
  GroupWithParticipantsResponseSchema,
  GroupWithParticipantsResponseSchemaTransform,
} from "./common";

export const FindAllGroupsResponseSchema = z.pipe(
  z.array(GroupResponseSchema),
  z.transform((groups) => groups.map(GroupResponseSchemaTransform)),
);

export const FindAllGroupsWithParticipantsResponseSchema = z.pipe(
  z.array(GroupWithParticipantsResponseSchema),
  z.transform((groups) =>
    groups.map(GroupWithParticipantsResponseSchemaTransform),
  ),
);

export type FindAllGroupsResponse = z.infer<typeof FindAllGroupsResponseSchema>;
export type FindAllGroupsWithParticipantsResponse = z.infer<
  typeof FindAllGroupsWithParticipantsResponseSchema
>;

export {
  FindAllGroupsResponseSchema as ResponseSchema,
  FindAllGroupsWithParticipantsResponseSchema as ResponseWithParticipantsSchema,
};
