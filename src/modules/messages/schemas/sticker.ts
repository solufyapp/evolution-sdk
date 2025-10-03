import * as z from "zod";

import { mediaSchema } from "@/schemas/common";
import { Jid, MessageId } from "@/types/tags";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

import { BaseMessageOptionsSchema } from "./base";

export const StickerMessageOptionsSchema = BaseMessageOptionsSchema.extend({
  /**
   * Image URL or file in base64
   */
  sticker: mediaSchema,
});

export const StickerMessageBodySchema = StickerMessageOptionsSchema;

export const StickerMessageResponseSchema = z
  .object({
    key: z.object({
      remoteJid: z.string(),
      id: z.string(),
    }),
    message: z.object({
      stickerMessage: z.object({
        url: z.url(),
        fileSha256: z.base64(),
        fileEncSha256: z.base64(),
        mediaKey: z.base64(),
        mimetype: z.string().optional(),
        directPath: z.string(),
        fileLength: z.coerce.number(),
        mediaKeyTimestamp: z.coerce.date(),
      }),
    }),
    messageTimestamp: z.coerce.date(),
  })
  .transform((data) => ({
    receiver: {
      phoneNumber: phoneNumberFromJid(data.key.remoteJid),
      jid: Jid(data.key.remoteJid),
    },
    media: {
      url: data.message.stickerMessage.url,
      mimetype: data.message.stickerMessage.mimetype,
      length: data.message.stickerMessage.fileLength,
      sha256: data.message.stickerMessage.fileSha256,
      encryptedSha256: data.message.stickerMessage.fileEncSha256,
      directPath: data.message.stickerMessage.directPath,
      key: data.message.stickerMessage.mediaKey,
      keyTimestamp: data.message.stickerMessage.mediaKeyTimestamp,
    },
    id: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  }));

export type StickerMessageOptions = z.infer<typeof StickerMessageOptionsSchema>;
export type StickerMessageResponse = z.infer<
  typeof StickerMessageResponseSchema
>;

export {
  StickerMessageBodySchema as BodySchema,
  StickerMessageOptionsSchema as OptionsSchema,
  StickerMessageResponseSchema as ResponseSchema,
};
