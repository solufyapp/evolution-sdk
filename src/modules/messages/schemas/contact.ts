import { parsePhoneNumberWithError } from "libphonenumber-js";
import * as z from "zod/mini";

import { PhoneNumberSchema } from "@/schemas/common";
import { Jid, MessageId } from "@/types/tags";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

import { BaseMessageOptionsSchema } from "./base";

export const ContactMessageOptionsSchema = z.extend(BaseMessageOptionsSchema, {
  /**
   * Contact list
   */
  contacts: z.array(
    z.object({
      /**
       * Contact display name
       */
      fullName: z.string(),
      /**
       * Contact phone number
       */
      phoneNumber: PhoneNumberSchema,
      /**
       * Contact organization
       */
      organization: z.optional(z.string()),
      /**
       * Contact email
       */
      email: z.optional(z.email()),
      /**
       * Contact website url
       */
      url: z.optional(z.url()),
    }),
  ),
});

export const ContactMessageBodySchema = z.pipe(
  ContactMessageOptionsSchema,
  z.transform(({ contacts, ...data }) => ({
    ...data,
    contact: contacts.map((contact) => ({
      ...contact,
      phoneNumber: parsePhoneNumberWithError(
        contact.phoneNumber,
      ).formatInternational(),
      wuid: contact.phoneNumber.replace(/\D/g, ""),
    })),
  })),
);

export const ContactMessageResponseSchema = z.pipe(
  z.object({
    key: z.object({
      remoteJid: z.string(),
      id: z.string(),
    }),
    message: z.union([
      z.object({
        contactMessage: z.object({
          displayName: z.string(),
          vcard: z.string(),
        }),
      }),
      z.object({
        contactsArrayMessage: z.object({
          contacts: z.array(
            z.object({
              displayName: z.string(),
              vcard: z.string(),
            }),
          ),
        }),
      }),
    ]),
    messageTimestamp: z.coerce.date(),
  }),
  z.transform((data) => ({
    receiver: {
      phoneNumber: phoneNumberFromJid(data.key.remoteJid),
      jid: Jid(data.key.remoteJid),
    },
    contacts:
      "contactMessage" in data.message
        ? [data.message.contactMessage]
        : data.message.contactsArrayMessage.contacts,
    id: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  })),
);

export type ContactMessageOptions = z.infer<typeof ContactMessageOptionsSchema>;
export type ContactMessageResponse = z.infer<
  typeof ContactMessageResponseSchema
>;

export {
  ContactMessageBodySchema as BodySchema,
  ContactMessageOptionsSchema as OptionsSchema,
  ContactMessageResponseSchema as ResponseSchema,
};
