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
  key: KeyResponseSchema,
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
  const { videoMessage } = data.message;
  return {
    receiver: ReceiverResponse(data.key.remoteJid),
    media: {
      url: videoMessage.url,
      caption: videoMessage.caption,
      mimetype: videoMessage.mimetype,
      gifPlayback: videoMessage.gifPlayback,
      length: videoMessage.fileLength,
      sha256: videoMessage.fileSha256,
      encryptedSha256: videoMessage.fileEncSha256,
      directPath: videoMessage.directPath,
      key: videoMessage.mediaKey,
      keyTimestamp: videoMessage.mediaKeyTimestamp,
    },
    id: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  };
};

export type VideoMessageOptions = z.infer<typeof OptionsSchema>;
export type VideoMessageResponse = ReturnType<typeof Response>;
