import * as z from "zod/mini";

import { mediaSchema } from "@/schemas/common";
import { MessageId } from "@/types/tags";
import { replaceWithGreeting } from "@/utils/greeting";

import {
  BaseMessageOptionsSchema,
  KeyResponseSchema,
  ReceiverResponse,
} from "./base";

const OptionsSchema = z.extend(BaseMessageOptionsSchema, {
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

export const Body = (options: ImageMessageOptions) => {
  const { image, ...data } = OptionsSchema.parse(options);
  return {
    ...data,
    media: image,
    mediatype: "image",
  };
};

const ResponseSchema = z.object({
  key: KeyResponseSchema,
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
});

export const Response = (response: unknown) => {
  const data = ResponseSchema.parse(response);
  const { imageMessage } = data.message;
  return {
    receiver: ReceiverResponse(data.key.remoteJid),
    media: {
      url: imageMessage.url,
      caption: imageMessage.caption,
      mimetype: imageMessage.mimetype,
      length: imageMessage.fileLength,
      height: imageMessage.height,
      width: imageMessage.width,
      sha256: imageMessage.fileSha256,
      encryptedSha256: imageMessage.fileEncSha256,
      directPath: imageMessage.directPath,
      key: imageMessage.mediaKey,
      keyTimestamp: imageMessage.mediaKeyTimestamp,
    },
    id: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  };
};

export type ImageMessageOptions = z.infer<typeof OptionsSchema>;
export type ImageMessageResponse = ReturnType<typeof Response>;
