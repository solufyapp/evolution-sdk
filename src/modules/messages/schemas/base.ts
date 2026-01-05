import * as z from "zod/mini";

import { ApiNumberSchema } from "@/schemas/common";
import { Jid } from "@/types/tags";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

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

export const KeyResponseSchema = z.object({
  remoteJid: z.string(),
  id: z.string(),
});

export const ReceiverResponse = (remoteJid: string) => {
  return {
    phoneNumber: phoneNumberFromJid(remoteJid),
    jid: Jid(remoteJid),
  };
};

export type BaseMessageOptions = z.infer<typeof BaseMessageOptionsSchema>;
