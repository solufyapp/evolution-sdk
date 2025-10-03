import * as z from "zod";

import { Jid, MessageId } from "@/types/tags";
import { replaceWithGreeting } from "@/utils/greeting";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

import { BaseMessageOptionsSchema } from "./base";

export const TextMessageOptionsSchema = BaseMessageOptionsSchema.extend({
  /**
   * Message text content
   */
  text: z.string().overwrite(replaceWithGreeting),
  /**
   * Whether link preview should be shown
   */
  linkPreview: z.boolean().optional(),
});

export const TextMessageBodySchema = TextMessageOptionsSchema;

export const TextMessageResponseSchema = z
  .object({
    key: z.object({
      remoteJid: z.string(),
      id: z.string(),
    }),
    messageTimestamp: z.coerce.date(),
  })
  .transform((data) => ({
    receiver: {
      phoneNumber: phoneNumberFromJid(data.key.remoteJid),
      jid: Jid(data.key.remoteJid),
    },
    messageId: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  }));

export type TextMessageOptions = z.infer<typeof TextMessageOptionsSchema>;
export type TextMessageResponse = z.infer<typeof TextMessageResponseSchema>;

export {
  TextMessageBodySchema as BodySchema,
  TextMessageOptionsSchema as OptionsSchema,
  TextMessageResponseSchema as ResponseSchema,
};
