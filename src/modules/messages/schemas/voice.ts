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
   * Encode audio into WhatsApp default format (allows audio to be sped up)
   * @default true
   */
  encoding: z._default(z.optional(z.boolean()), true),
});

export const Body = (options: VoiceMessageOptions) => {
  return OptionsSchema.parse(options);
};

const ResponseSchema = z.object({
  key: KeyResponseSchema,
  message: z.object({
    audioMessage: z.object({
      url: z.url(),
      mimetype: z.string(),
      fileSha256: z.base64(),
      fileLength: z.coerce.number(),
      seconds: z.number(),
      ptt: z.optional(z.boolean()),
      mediaKey: z.base64(),
      fileEncSha256: z.base64(),
      directPath: z.string(),
      mediaKeyTimestamp: z.coerce.date(),
      waveform: z.nullish(z.base64()),
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
      /**
       * Indicates whether the audio message is a push-to-talk (PTT) message
       */
      isPtt: data.message.audioMessage.ptt,
      key: data.message.audioMessage.mediaKey,
      keyTimestamp: data.message.audioMessage.mediaKeyTimestamp,
      waveform: data.message.audioMessage.waveform,
    },
    messageId: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  };
};

export type VoiceMessageOptions = z.infer<typeof OptionsSchema>;
export type VoiceMessageResponse = ReturnType<typeof Response>;
