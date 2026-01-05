import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import * as z from "zod/mini";

import type { GroupInviteCode, GroupJid, Jid } from "@/types/tags";

export const PhoneNumberSchema = z.string().check(
  z.refine((value) => isValidPhoneNumber(value), "Invalid phone number"),
  z.overwrite(
    (phoneNumber) => parsePhoneNumberFromString(phoneNumber)?.number as string,
  ),
);

export const JidSchema = z.pipe(
  z
    .string()
    .check(
      z.endsWith(
        "@s.whatsapp.net",
        "Invalid remote JID, should end with @s.whatsapp.net",
      ),
    ),
  z.custom<Jid>(),
);

export const GroupJidSchema = z.pipe(
  z
    .string()
    .check(z.endsWith("@g.us", "Invalid group JID, should end with @g.us")),
  z.custom<GroupJid>(),
);

export const GroupInviteCodeSchema = z.pipe(
  z
    .string()
    .check(
      z.length(22),
      z.regex(/^[a-zA-Z0-9]{22}$/, "Invalid group invite code"),
    ),
  z.custom<GroupInviteCode>(),
);

export const ApiNumberSchema = z.union([
  PhoneNumberSchema,
  JidSchema,
  GroupJidSchema,
]);

export const mediaSchema = z.union([z.url(), z.base64()]);
