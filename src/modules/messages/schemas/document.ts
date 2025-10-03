import * as z from "zod";

import { mediaSchema } from "@/schemas/common";
import { Jid, MessageId } from "@/types/tags";
import { replaceWithGreeting } from "@/utils/greeting";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

import { BaseMessageOptionsSchema } from "./base";

export const DocumentMessageOptionsSchema = BaseMessageOptionsSchema.extend({
  /**
   * Document URL or file in base64
   */
  document: mediaSchema,
  /**
   * Caption to send with document
   */
  caption: z.string().optional().overwrite(replaceWithGreeting),
  /**
   * Document mimetype
   */
  mimetype: z.string().optional(),
  /**
   * Name of the file
   */
  fileName: z.string().optional(),
}).refine(
  (data) => (URL.canParse(data.document) ? true : Boolean(data.fileName)),
  {
    message: "fileName must be provided when document is not an URL",
    path: ["fileName"],
  },
);

export const DocumentMessageBodySchema = DocumentMessageOptionsSchema.transform(
  ({ document, ...data }) => ({
    ...data,
    media: document,
    mediatype: "document",
  }),
);

export const DocumentMessageResponseSchema = z
  .object({
    key: z.object({
      remoteJid: z.string(),
      id: z.string(),
    }),
    message: z.object({
      documentMessage: z.object({
        url: z.url(),
        mimetype: z.string().optional(),
        fileSha256: z.base64(),
        fileLength: z.coerce.number(),
        mediaKey: z.base64(),
        caption: z.string().optional(),
        fileName: z.string(),
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
  }));

export type DocumentMessageOptions = z.infer<
  typeof DocumentMessageOptionsSchema
>;
export type DocumentMessageResponse = z.infer<
  typeof DocumentMessageResponseSchema
>;

export {
  DocumentMessageBodySchema as BodySchema,
  DocumentMessageOptionsSchema as OptionsSchema,
  DocumentMessageResponseSchema as ResponseSchema,
};
