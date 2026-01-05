import { parsePhoneNumberWithError } from "libphonenumber-js/min";
import * as z from "zod/mini";

import { PhoneNumberSchema } from "@/schemas/common";
import { Jid, MessageId } from "@/types/tags";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

import { BaseMessageOptionsSchema } from "./base";

const OptionsSchema = z.extend(BaseMessageOptionsSchema, {
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

export const Body = (options: ContactMessageOptions) => {
  const { contacts, ...data } = OptionsSchema.parse(options);
  return {
    ...data,
    contact: contacts.map((contact) => ({
      ...contact,
      phoneNumber: parsePhoneNumberWithError(
        contact.phoneNumber,
      ).formatInternational(),
      wuid: contact.phoneNumber.replace(/\D/g, ""),
    })),
  };
};

const ResponseSchema = z.object({
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
});

export const Response = (response: unknown) => {
  const data = ResponseSchema.parse(response);
  return {
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
  };
};

export type ContactMessageOptions = z.infer<typeof OptionsSchema>;
export type ContactMessageResponse = ReturnType<typeof Response>;
