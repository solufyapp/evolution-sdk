import * as z from "zod/mini";

import { Jid, MessageId } from "@/types/tags";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

import { BaseMessageOptionsSchema } from "./base";

const OptionsSchema = z.extend(BaseMessageOptionsSchema, {
  /**
   * Location name
   */
  name: z.string(),
  /**
   * Location address
   */
  address: z.string(),
  /**
   * Location latitude
   */
  latitude: z.number(),
  /**
   * Location longitude
   */
  longitude: z.number(),
});

export const Body = (options: LocationMessageOptions) => {
  return OptionsSchema.parse(options);
};

const ResponseSchema = z.object({
  key: z.object({
    remoteJid: z.string(),
    id: z.string(),
  }),
  message: z.object({
    locationMessage: z.object({
      degreesLatitude: z.number(),
      degreesLongitude: z.number(),
      name: z.string(),
      address: z.string(),
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
    location: {
      latitude: data.message.locationMessage.degreesLatitude,
      longitude: data.message.locationMessage.degreesLongitude,
      name: data.message.locationMessage.name,
      address: data.message.locationMessage.address,
    },
    id: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  };
};

export type LocationMessageOptions = z.infer<typeof OptionsSchema>;
export type LocationMessageResponse = ReturnType<typeof Response>;
