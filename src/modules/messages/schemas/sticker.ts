import * as z from "zod/mini";

import { mediaSchema } from "@/schemas/common";
import { MessageId } from "@/types/tags";

import {
  BaseMessageOptionsSchema,
  KeyResponseSchema,
  ReceiverResponse,
} from "./base";

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
  key: KeyResponseSchema,
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
  const { stickerMessage } = data.message;
  return {
    receiver: ReceiverResponse(data.key.remoteJid),
    media: {
      url: stickerMessage.url,
      mimetype: stickerMessage.mimetype,
      length: stickerMessage.fileLength,
      sha256: stickerMessage.fileSha256,
      encryptedSha256: stickerMessage.fileEncSha256,
      directPath: stickerMessage.directPath,
      key: stickerMessage.mediaKey,
      keyTimestamp: stickerMessage.mediaKeyTimestamp,
    },
    id: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  };
};

export type StickerMessageOptions = z.infer<typeof OptionsSchema>;
export type StickerMessageResponse = ReturnType<typeof Response>;
