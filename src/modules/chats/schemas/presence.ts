import * as z from "zod/mini";

import { ApiNumberSchema } from "@/schemas/common";

const OptionsSchema = z.object({
  /**
   * Chat number or JID to receve the presence
   */
  number: ApiNumberSchema,
  /**
   * Duration of the presence in millisseconds
   */
  duration: z.number(),
  /**
   * Presence state
   * - `composing`: typing a message
   * - `recording`: recording an audio
   */
  presence: z.enum(["composing", "recording"]),
  /**
   * Whether to wait until the presence is finished (duration)
   */
  waitUntilFinish: z.optional(z.boolean()),
});

export const Body = (options: PresenceOptions) => {
  const { waitUntilFinish, duration, ...data } = OptionsSchema.parse(options);
  return { ...data, delay: duration };
};

export type PresenceOptions = z.infer<typeof OptionsSchema>;
