import * as z from "zod/mini";

import { MessageId } from "@/types/tags";
import { replaceWithGreeting } from "@/utils/greeting";

import {
  BaseMessageOptionsSchema,
  KeyResponseSchema,
  ReceiverResponse,
} from "./base";

const OptionsSchema = z.extend(BaseMessageOptionsSchema, {
  /**
   * Message text content
   */
  text: z.string().check(z.overwrite(replaceWithGreeting)),
  /**
   * Whether link preview should be shown
   */
  linkPreview: z.optional(z.boolean()),
});

export const Body = (options: TextMessageOptions) => {
  return OptionsSchema.parse(options);
};

const ResponseSchema = z.object({
  key: KeyResponseSchema,
  messageTimestamp: z.coerce.date(),
});

export const Response = (response: unknown) => {
  const data = ResponseSchema.parse(response);
  return {
    receiver: ReceiverResponse(data.key.remoteJid),
    messageId: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  };
};

export type TextMessageOptions = z.infer<typeof OptionsSchema>;
export type TextMessageResponse = ReturnType<typeof Response>;
