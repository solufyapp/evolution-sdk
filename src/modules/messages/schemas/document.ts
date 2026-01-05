import * as z from "zod/mini";

import { mediaSchema } from "@/schemas/common";
import { MessageId } from "@/types/tags";
import { replaceWithGreeting } from "@/utils/greeting";

import {
  BaseMessageOptionsSchema,
  KeyResponseSchema,
  ReceiverResponse,
} from "./base";

const OptionsSchema = z
  .extend(BaseMessageOptionsSchema, {
    /**
     * Document URL or file in base64
     */
    document: mediaSchema,
    /**
     * Caption to send with document
     */
    caption: z.optional(z.string().check(z.overwrite(replaceWithGreeting))),
    /**
     * Document mimetype
     */
    mimetype: z.optional(z.string()),
    /**
     * Name of the file
     */
    fileName: z.optional(z.string()),
  })
  .check(
    z.refine(
      (data) => (URL.canParse(data.document) ? true : Boolean(data.fileName)),
      {
        message: "fileName must be provided when document is not an URL",
        path: ["fileName"],
      },
    ),
  );

export const Body = (options: DocumentMessageOptions) => {
  const { document, ...data } = OptionsSchema.parse(options);
  return {
    ...data,
    media: document,
    mediatype: "document",
  };
};

const ResponseSchema = z.object({
  key: KeyResponseSchema,
  message: z.object({
    documentMessage: z.object({
      url: z.url(),
      mimetype: z.optional(z.string()),
      fileSha256: z.base64(),
      fileLength: z.coerce.number(),
      mediaKey: z.base64(),
      caption: z.optional(z.string()),
      fileName: z.string(),
      fileEncSha256: z.base64(),
      directPath: z.string(),
      mediaKeyTimestamp: z.coerce.date(),
    }),
  }),
  messageTimestamp: z.coerce.date(),
});

export const Response = (response: unknown) => {
  const data = ResponseSchema.parse(response);
  const { documentMessage } = data.message;
  return {
    receiver: ReceiverResponse(data.key.remoteJid),
    media: {
      url: documentMessage.url,
      caption: documentMessage.caption,
      mimetype: documentMessage.mimetype,
      length: documentMessage.fileLength,
      sha256: documentMessage.fileSha256,
      fileName: documentMessage.fileName,
      encryptedSha256: documentMessage.fileEncSha256,
      directPath: documentMessage.directPath,
      key: documentMessage.mediaKey,
      keyTimestamp: documentMessage.mediaKeyTimestamp,
    },
    id: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  };
};

export type DocumentMessageOptions = z.infer<typeof OptionsSchema>;
export type DocumentMessageResponse = ReturnType<typeof Response>;
