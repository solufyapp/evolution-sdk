import * as z from "zod/mini";

import { Jid, MessageId } from "@/types/tags";
import { replaceWithGreeting } from "@/utils/greeting";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

import { BaseMessageOptionsSchema } from "./base";

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
  key: z.object({
    remoteJid: z.string(),
    id: z.string(),
  }),
  messageTimestamp: z.coerce.date(),
});

export const Response = (response: unknown) => {
  const data = ResponseSchema.parse(response);
  return {
    receiver: {
      phoneNumber: phoneNumberFromJid(data.key.remoteJid),
      jid: Jid(data.key.remoteJid),
    },
    messageId: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  };
};

export type TextMessageOptions = z.infer<typeof OptionsSchema>;
export type TextMessageResponse = ReturnType<typeof Response>;
