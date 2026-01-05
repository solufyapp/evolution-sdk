import * as z from "zod/mini";

import { MessageId } from "@/types/tags";

import {
  BaseMessageOptionsSchema,
  KeyResponseSchema,
  ReceiverResponse,
} from "./base";

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
  key: KeyResponseSchema,
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
  const { locationMessage } = data.message;
  return {
    receiver: ReceiverResponse(data.key.remoteJid),
    location: {
      latitude: locationMessage.degreesLatitude,
      longitude: locationMessage.degreesLongitude,
      name: locationMessage.name,
      address: locationMessage.address,
    },
    id: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  };
};

export type LocationMessageOptions = z.infer<typeof OptionsSchema>;
export type LocationMessageResponse = ReturnType<typeof Response>;
