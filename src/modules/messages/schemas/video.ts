import * as z from "zod";

import { mediaSchema } from "@/schemas/common";
import { Jid, MessageId } from "@/types/tags";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

import { BaseMessageOptionsSchema } from "./base";

export const VideoMessageOptionsSchema = BaseMessageOptionsSchema.extend({
  /**
   * Video URL or file in base64
   */
  video: mediaSchema,
  /**
   * Caption to send with video
   */
  caption: z.string().optional(),
  /**
   * Video mimetype
   */
  mimetype: z.string().optional(),
});

export const VideoMessageBodySchema = VideoMessageOptionsSchema.transform(
  ({ video, ...data }) => ({ ...data, media: video, mediatype: "video" }),
);

export const VideoMessageResponseSchema = z
  .object({
    key: z.object({
      remoteJid: z.string(),
      id: z.string(),
    }),
    message: z.object({
      videoMessage: z.object({
        url: z.url(),
        mimetype: z.string().optional(),
        fileSha256: z.base64(),
        fileLength: z.coerce.number(),
        mediaKey: z.base64(),
        caption: z.string().optional(),
        gifPlayback: z.boolean(),
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
      url: data.message.videoMessage.url,
      caption: data.message.videoMessage.caption,
      mimetype: data.message.videoMessage.mimetype,
      gifPlayback: data.message.videoMessage.gifPlayback,
      length: data.message.videoMessage.fileLength,
      sha256: data.message.videoMessage.fileSha256,
      encryptedSha256: data.message.videoMessage.fileEncSha256,
      directPath: data.message.videoMessage.directPath,
      key: data.message.videoMessage.mediaKey,
      keyTimestamp: data.message.videoMessage.mediaKeyTimestamp,
    },
    id: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  }));

export type VideoMessageOptions = z.infer<typeof VideoMessageOptionsSchema>;
export type VideoMessageResponse = z.infer<typeof VideoMessageResponseSchema>;

export {
  VideoMessageBodySchema as BodySchema,
  VideoMessageOptionsSchema as OptionsSchema,
  VideoMessageResponseSchema as ResponseSchema,
};
