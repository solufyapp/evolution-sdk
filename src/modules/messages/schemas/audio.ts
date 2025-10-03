import * as z from "zod";

import { mediaSchema } from "@/schemas/common";
import { Jid, MessageId } from "@/types/tags";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

import { BaseMessageOptionsSchema } from "./base";

export const AudioMessageOptionsSchema = BaseMessageOptionsSchema.extend({
  /**
   * Audio URL or file in base64
   */
  audio: mediaSchema,
  /**
   * Audio mimetype
   */
  mimetype: z.string().optional(),
});

export const AudioMessageBodySchema = AudioMessageOptionsSchema.transform(
  ({ audio, ...data }) => ({ ...data, media: audio, mediatype: "audio" }),
);

export const AudioMessageResponseSchema = z
  .object({
    key: z.object({
      remoteJid: z.string(),
      id: z.string(),
    }),
    message: z.object({
      audioMessage: z.object({
        url: z.url(),
        mimetype: z.string().optional(),
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
      key: data.message.audioMessage.mediaKey,
      keyTimestamp: data.message.audioMessage.mediaKeyTimestamp,
    },
    id: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  }));

export type AudioMessageOptions = z.infer<typeof AudioMessageOptionsSchema>;
export type AudioMessageResponse = z.infer<typeof AudioMessageResponseSchema>;

export {
  AudioMessageBodySchema as BodySchema,
  AudioMessageOptionsSchema as OptionsSchema,
  AudioMessageResponseSchema as ResponseSchema,
};
