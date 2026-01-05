import * as z from "zod/mini";

import { mediaSchema } from "@/schemas/common";
import { Jid, MessageId } from "@/types/tags";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

import { BaseMessageOptionsSchema } from "./base";

const OptionsSchema = z.extend(BaseMessageOptionsSchema, {
  /**
   * Image URL or file in base64
   */
  sticker: mediaSchema,
});

export const Body = (options: StickerMessageOptions) => {
  return OptionsSchema.parse(options);
};

const ResponseSchema = z.object({
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
      mimetype: z.optional(z.string()),
      directPath: z.string(),
      fileLength: z.coerce.number(),
      mediaKeyTimestamp: z.coerce.date(),
    }),
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
  };
};

export type StickerMessageOptions = z.infer<typeof OptionsSchema>;
export type StickerMessageResponse = ReturnType<typeof Response>;
