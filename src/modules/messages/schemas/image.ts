import * as z from "zod/mini";

import { mediaSchema } from "@/schemas/common";
import { Jid, MessageId } from "@/types/tags";
import { replaceWithGreeting } from "@/utils/greeting";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

import { BaseMessageOptionsSchema } from "./base";

export const ImageMessageOptionsSchema = z.extend(BaseMessageOptionsSchema, {
  /**
   * Image URL or file in base64
   */
  image: mediaSchema,
  /**
   * Caption to send with image
   */
  caption: z.optional(z.string()).check(z.overwrite(replaceWithGreeting)),
  /**
   * Image mimetype
   */
  mimetype: z.optional(z.string()),
});

export const ImageMessageBodySchema = z.pipe(
  ImageMessageOptionsSchema,
  z.transform(({ image, ...data }) => ({
    ...data,
    media: image,
    mediatype: "image",
  })),
);

export const ImageMessageResponseSchema = z.pipe(
  z.object({
    key: z.object({
      remoteJid: z.string(),
      id: z.string(),
    }),
    message: z.object({
      imageMessage: z.object({
        url: z.url(),
        mimetype: z.optional(z.string()),
        fileSha256: z.base64(),
        fileLength: z.coerce.number(),
        height: z.number(),
        width: z.number(),
        mediaKey: z.base64(),
        caption: z.optional(z.string()),
        fileEncSha256: z.base64(),
        directPath: z.string(),
        mediaKeyTimestamp: z.coerce.date(),
      }),
    }),
    messageTimestamp: z.coerce.date(),
  }),
  z.transform((data) => ({
    receiver: {
      phoneNumber: phoneNumberFromJid(data.key.remoteJid),
      jid: Jid(data.key.remoteJid),
    },
    media: {
      url: data.message.imageMessage.url,
      caption: data.message.imageMessage.caption,
      mimetype: data.message.imageMessage.mimetype,
      length: data.message.imageMessage.fileLength,
      height: data.message.imageMessage.height,
      width: data.message.imageMessage.width,
      sha256: data.message.imageMessage.fileSha256,
      encryptedSha256: data.message.imageMessage.fileEncSha256,
      directPath: data.message.imageMessage.directPath,
      key: data.message.imageMessage.mediaKey,
      keyTimestamp: data.message.imageMessage.mediaKeyTimestamp,
    },
    id: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  })),
);

export type ImageMessageOptions = z.infer<typeof ImageMessageOptionsSchema>;
export type ImageMessageResponse = z.infer<typeof ImageMessageResponseSchema>;

export {
  ImageMessageBodySchema as BodySchema,
  ImageMessageOptionsSchema as OptionsSchema,
  ImageMessageResponseSchema as ResponseSchema,
};
