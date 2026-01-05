import * as z from "zod/mini";

import { ApiNumberSchema } from "@/schemas/common";

export const BaseMessageOptionsSchema = z.object({
  /**
   * Number (with country code) or JID to receive the message
   */
  number: ApiNumberSchema,
  /**
   * Time in milliseconds before sending message
   */
  delay: z.optional(z.number()),
});

export type BaseMessageOptions = z.infer<typeof BaseMessageOptionsSchema>;
