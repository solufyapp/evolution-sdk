import * as z from "zod/mini";

import { ChatId, GroupJid, Jid } from "@/types/tags";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

const ResponseSchema = z.array(
  z.object({
    id: z.string(),
    remoteJid: z.string(),
    name: z.nullish(z.string()),
    labels: z.nullish(z.array(z.string())),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    pushName: z.nullish(z.string()),
    profilePicUrl: z.nullish(z.url()),
  }),
);

export const Response = (response: unknown) => {
  const data = ResponseSchema.parse(response);
  return data.map((chat) => ({
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
  }));
};

export type FindAllChatsResponse = ReturnType<typeof Response>;
