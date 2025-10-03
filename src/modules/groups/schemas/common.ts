import * as z from "zod";

import { GroupJid, Jid } from "@/types/tags";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

export const GroupResponseSchema = z.object({
  id: z.string(),
  subject: z.string(),
  subjectOwner: z.string(),
  subjectTime: z.coerce.date(),
  pictureUrl: z.url().nullish(),
  size: z.number(),
  creation: z.coerce.date(),
  owner: z.string(),
  restrict: z.boolean(),
  announce: z.boolean(),
});

export const ParticipantResponseSchema = z.object({
  id: z.string(),
  admin: z.enum(["admin", "superadmin"]).nullish(),
});

export const GroupWithParticipantsResponseSchema = GroupResponseSchema.extend({
  participants: z.array(ParticipantResponseSchema),
});

export const GroupResponseSchemaTransform = (
  group: z.infer<typeof GroupResponseSchema>,
) => ({
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

export const ParticipantResponseSchemaTransform = (
  participant: z.infer<typeof ParticipantResponseSchema>,
) => ({
  id: participant.id,
  role: participant.admin || ("member" as const),
});

export const GroupWithParticipantsResponseSchemaTransform = (
  group: z.infer<typeof GroupWithParticipantsResponseSchema>,
) => ({
  ...GroupResponseSchemaTransform(group),
  participants: group.participants.map(ParticipantResponseSchemaTransform),
});

export type GroupResponse = z.infer<typeof GroupResponseSchema>;
export type ParticipantResponse = z.infer<typeof ParticipantResponseSchema>;
export type GroupWithParticipantsResponse = z.infer<
  typeof GroupWithParticipantsResponseSchema
>;
