import * as z from "zod/mini";

import {
  GroupWithParticipantsResponseSchema,
  GroupWithParticipantsResponseSchemaTransform,
} from "./common";

export const FindGroupByJidResponseSchema = z.pipe(
  GroupWithParticipantsResponseSchema,
  z.transform(GroupWithParticipantsResponseSchemaTransform),
);

export type FindGroupByJidResponse = z.infer<
  typeof FindGroupByJidResponseSchema
>;

export { FindGroupByJidResponseSchema as ResponseSchema };
