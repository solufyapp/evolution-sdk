import * as z from "zod/mini";

import { mediaSchema } from "@/schemas/common";
import { Jid, MessageId } from "@/types/tags";
import { replaceWithGreeting } from "@/utils/greeting";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

import { BaseMessageOptionsSchema } from "./base";

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
  key: z.object({
    remoteJid: z.string(),
    id: z.string(),
  }),
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
  return {
    receiver: {
      phoneNumber: phoneNumberFromJid(data.key.remoteJid),
      jid: Jid(data.key.remoteJid),
    },
    media: {
      url: data.message.documentMessage.url,
      caption: data.message.documentMessage.caption,
      mimetype: data.message.documentMessage.mimetype,
      length: data.message.documentMessage.fileLength,
      sha256: data.message.documentMessage.fileSha256,
      fileName: data.message.documentMessage.fileName,
      encryptedSha256: data.message.documentMessage.fileEncSha256,
      directPath: data.message.documentMessage.directPath,
      key: data.message.documentMessage.mediaKey,
      keyTimestamp: data.message.documentMessage.mediaKeyTimestamp,
    },
    id: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  };
};

export type DocumentMessageOptions = z.infer<typeof OptionsSchema>;
export type DocumentMessageResponse = ReturnType<typeof Response>;
