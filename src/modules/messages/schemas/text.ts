import * as z from "zod/mini";

import { Jid, MessageId } from "@/types/tags";
import { replaceWithGreeting } from "@/utils/greeting";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

import { BaseMessageOptionsSchema } from "./base";

export const TextMessageOptionsSchema = z.extend(BaseMessageOptionsSchema, {
  /**
   * Message text content
   */
  text: z.string().check(z.overwrite(replaceWithGreeting)),
  /**
   * Whether link preview should be shown
   */
  linkPreview: z.optional(z.boolean()),
});

export const TextMessageBodySchema = TextMessageOptionsSchema;

export const TextMessageResponseSchema = z.pipe(
  z.object({
    key: z.object({
      remoteJid: z.string(),
      id: z.string(),
    }),
    messageTimestamp: z.coerce.date(),
  }),
  z.transform((data) => ({
    receiver: {
      phoneNumber: phoneNumberFromJid(data.key.remoteJid),
      jid: Jid(data.key.remoteJid),
    },
    messageId: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  })),
);

export type TextMessageOptions = z.infer<typeof TextMessageOptionsSchema>;
export type TextMessageResponse = z.infer<typeof TextMessageResponseSchema>;

export {
  TextMessageBodySchema as BodySchema,
  TextMessageOptionsSchema as OptionsSchema,
  TextMessageResponseSchema as ResponseSchema,
};
