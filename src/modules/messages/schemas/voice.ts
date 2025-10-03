import * as z from "zod";

import { mediaSchema } from "@/schemas/common";
import { Jid, MessageId } from "@/types/tags";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

import { BaseMessageOptionsSchema } from "./base";

export const VoiceMessageOptionsSchema = BaseMessageOptionsSchema.extend({
  /**
   * Audio URL or file in base64
   */
  audio: mediaSchema,
  /**
   * Encode audio into WhatsApp default format (allows audio to be sped up)
   * @default true
   */
  encoding: z.boolean().optional().default(true),
});

export const VoiceMessageBodySchema = VoiceMessageOptionsSchema;

export const VoiceMessageResponseSchema = z
  .object({
    key: z.object({
      remoteJid: z.string(),
      id: z.string(),
    }),
    message: z.object({
      audioMessage: z.object({
        url: z.url(),
        mimetype: z.string(),
        fileSha256: z.base64(),
        fileLength: z.coerce.number(),
        seconds: z.number(),
        ptt: z.boolean().optional(),
        mediaKey: z.base64(),
        fileEncSha256: z.base64(),
        directPath: z.string(),
        mediaKeyTimestamp: z.coerce.date(),
        waveform: z.base64().nullish(),
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
  }));

export type VoiceMessageOptions = z.infer<typeof VoiceMessageOptionsSchema>;
export type VoiceMessageResponse = z.infer<typeof VoiceMessageResponseSchema>;

export {
  VoiceMessageBodySchema as BodySchema,
  VoiceMessageOptionsSchema as OptionsSchema,
  VoiceMessageResponseSchema as ResponseSchema,
};
