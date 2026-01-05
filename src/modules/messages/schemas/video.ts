import * as z from "zod/mini";

import { mediaSchema } from "@/schemas/common";
import { Jid, MessageId } from "@/types/tags";
import { replaceWithGreeting } from "@/utils/greeting";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

import { BaseMessageOptionsSchema } from "./base";

const OptionsSchema = z.extend(BaseMessageOptionsSchema, {
  /**
   * Video URL or file in base64
   */
  video: mediaSchema,
  /**
   * Caption to send with video
   */
  caption: z.string().check(z.overwrite(replaceWithGreeting)),
  /**
   * Video mimetype
   */
  mimetype: z.optional(z.string()),
});

export const Body = (options: VideoMessageOptions) => {
  const { video, ...data } = OptionsSchema.parse(options);
  return {
    ...data,
    media: video,
    mediatype: "video",
  };
};

const ResponseSchema = z.object({
  key: z.object({
    remoteJid: z.string(),
    id: z.string(),
  }),
  message: z.object({
    videoMessage: z.object({
      url: z.url(),
      mimetype: z.optional(z.string()),
      fileSha256: z.base64(),
      fileLength: z.coerce.number(),
      mediaKey: z.base64(),
      caption: z.optional(z.string()),
      gifPlayback: z.boolean(),
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
  };
};

export type VideoMessageOptions = z.infer<typeof OptionsSchema>;
export type VideoMessageResponse = ReturnType<typeof Response>;
