import * as z from "zod";

import { ChatId, GroupJid, Jid } from "@/types/tags";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

export const FindAllChatsResponseSchema = z
  .array(
    z.object({
      id: z.string(),
      remoteJid: z.string(),
      name: z.string().nullish(),
      labels: z.array(z.string()).nullish(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
      pushName: z.string().nullish(),
      profilePicUrl: z.url().nullish(),
    }),
  )
  .transform((chats) =>
    chats.map((chat) => ({
      id: ChatId(chat.id),
      jid: chat.remoteJid.endsWith("@g.us")
        ? GroupJid(chat.remoteJid)
        : Jid(chat.remoteJid),
      phoneNumber: phoneNumberFromJid(chat.remoteJid),
      name: chat.name || undefined,
      labels: chat.labels || undefined,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      pushName: chat.pushName || undefined,
      pictureUrl: chat.profilePicUrl || undefined,
    })),
  );

export type FindAllChatsResponse = z.infer<typeof FindAllChatsResponseSchema>;

export { FindAllChatsResponseSchema as ResponseSchema };
