import type { z } from "zod";

import {
  GroupWithParticipantsResponseSchema,
  GroupWithParticipantsResponseSchemaTransform,
} from "./common";

export const FindGroupByJidResponseSchema =
  GroupWithParticipantsResponseSchema.transform(
    GroupWithParticipantsResponseSchemaTransform,
  );

export type FindGroupByJidResponse = z.infer<
  typeof FindGroupByJidResponseSchema
>;

export { FindGroupByJidResponseSchema as ResponseSchema };
