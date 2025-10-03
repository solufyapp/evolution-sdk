import {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js";
import * as z from "zod";

import type { GroupInviteCode, GroupJid, Jid } from "@/types/tags";

export const PhoneNumberSchema = z
  .string()
  .refine((value) => isValidPhoneNumber(value), "Invalid phone number")
  .overwrite((phoneNumber) => parsePhoneNumberWithError(phoneNumber).number);

export const JidSchema = z
  .string()
  .endsWith(
    "@s.whatsapp.net",
    "Invalid remote JID, should end with @s.whatsapp.net",
  ) as z.ZodType<Jid>;

export const GroupJidSchema = z
  .string()
  .endsWith(
    "@g.us",
    "Invalid group JID, should end with @g.us",
  ) as z.ZodType<GroupJid>;

export const GroupInviteCodeSchema = z
  .string()
  .length(22)
  .regex(
    /^[a-zA-Z0-9]{22}$/,
    "Invalid group invite code",
  ) as unknown as z.ZodType<GroupInviteCode>;

export const ApiNumberSchema = z.union([
  PhoneNumberSchema,
  JidSchema,
  GroupJidSchema,
]);

export const mediaSchema = z.union([z.url(), z.base64()]);
