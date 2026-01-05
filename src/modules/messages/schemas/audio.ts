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
   * Audio URL or file in base64
   */
  audio: mediaSchema,
  /**
   * Audio mimetype
   */
  mimetype: z.optional(z.string()),
});

export const Body = (options: AudioMessageOptions) => {
  const { audio, ...data } = OptionsSchema.parse(options);
  return {
    ...data,
    media: audio,
    mediatype: "audio",
  };
};

const ResponseSchema = z.object({
  key: KeyResponseSchema,
  message: z.object({
    audioMessage: z.object({
      url: z.url(),
      mimetype: z.optional(z.string()),
      fileSha256: z.base64(),
      fileLength: z.coerce.number(),
      seconds: z.number(),
      mediaKey: z.base64(),
      fileEncSha256: z.base64(),
      directPath: z.string(),
      mediaKeyTimestamp: z.coerce.date(),
    }),
  }),
  messageTimestamp: z.coerce.date(),
});

export const Response = (response: unknown) => {
  const data = ResponseSchema.parse(response);
  return {
    receiver: ReceiverResponse(data.key.remoteJid),
    media: {
      url: data.message.audioMessage.url,
      mimetype: data.message.audioMessage.mimetype,
      length: data.message.audioMessage.fileLength,
      durationInSeconds: data.message.audioMessage.seconds,
      sha256: data.message.audioMessage.fileSha256,
      encryptedSha256: data.message.audioMessage.fileEncSha256,
      directPath: data.message.audioMessage.directPath,
      key: data.message.audioMessage.mediaKey,
      keyTimestamp: data.message.audioMessage.mediaKeyTimestamp,
    },
    id: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  };
};

export type AudioMessageOptions = z.infer<typeof OptionsSchema>;
export type AudioMessageResponse = ReturnType<typeof Response>;
