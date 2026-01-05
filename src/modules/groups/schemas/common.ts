import * as z from "zod/mini";

import { GroupJid, Jid } from "@/types/tags";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

export const GroupSchema = z.object({
  id: z.string(),
  subject: z.string(),
  subjectOwner: z.string(),
  subjectTime: z.coerce.date(),
  pictureUrl: z.nullish(z.url()),
  size: z.number(),
  creation: z.coerce.date(),
  owner: z.string(),
  restrict: z.boolean(),
  announce: z.boolean(),
});

export const ParticipantSchema = z.object({
  id: z.string(),
  admin: z.nullish(z.enum(["admin", "superadmin"])),
});

export const GroupWithParticipantsSchema = z.extend(GroupSchema, {
  participants: z.array(ParticipantSchema),
});

export const GroupResponse = (group: GroupResponse) => ({
  jid: GroupJid(group.id),
  name: group.subject,
  pictureUrl: group.pictureUrl || undefined,
  size: group.size,
  subject: {
    owner: Jid(group.subjectOwner),
    time: group.subjectTime,
  },
  owner: {
    jid: Jid(group.owner),
    phoneNumber: phoneNumberFromJid(group.owner),
  },
  createdAt: group.creation,
  restrict: group.restrict,
  announce: group.announce,
});

export const ParticipantResponse = (participant: ParticipantResponse) => ({
  id: participant.id,
  role: participant.admin ?? ("member" as const),
});

export const GroupWithParticipantsResponse = (
  group: GroupWithParticipantsResponse,
) => ({
  ...GroupResponse(group),
  participants: group.participants.map(ParticipantResponse),
});

export type GroupResponse = z.infer<typeof GroupSchema>;
export type ParticipantResponse = z.infer<typeof ParticipantSchema>;
export type GroupWithParticipantsResponse = z.infer<
  typeof GroupWithParticipantsSchema
>;
