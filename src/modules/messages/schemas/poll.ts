import * as z from "zod/mini";

import { Jid, MessageId } from "@/types/tags";
import { replaceWithGreeting } from "@/utils/greeting";
import { phoneNumberFromJid } from "@/utils/phone-numer-from-jid";

import { BaseMessageOptionsSchema } from "./base";

export const PollMessageOptionsSchema = z.extend(BaseMessageOptionsSchema, {
  /**
   * Name of the poll
   */
  name: z.string().check(z.overwrite(replaceWithGreeting)),
  /**
   * Whether multiple options can be selected
   * @default false
   */
  multiple: z._default(z.optional(z.boolean()), false),
  /**
   * Poll options
   */
  options: z.array(z.string()),
});

export const PollMessageBodySchema = z.pipe(
  PollMessageOptionsSchema,
  z.transform(({ multiple, options, ...data }) => ({
    ...data,
    selectableCount: multiple ? options.length : 1,
    values: options,
  })),
);

export const PollMessageResponseSchema = z.pipe(
  z.object({
    key: z.object({
      remoteJid: z.string(),
      id: z.string(),
    }),
    message: z.object({
      pollCreationMessageV3: z.object({
        name: z.string(),
        options: z.array(z.object({ optionName: z.string() })),
        selectableOptionsCount: z.number(),
      }),
    }),
    messageTimestamp: z.coerce.date(),
  }),
  z.transform((data) => ({
    receiver: {
      phoneNumber: phoneNumberFromJid(data.key.remoteJid),
      jid: Jid(data.key.remoteJid),
    },
    poll: {
      name: data.message.pollCreationMessageV3.name,
      options: data.message.pollCreationMessageV3.options.map(
        (option) => option.optionName,
      ),
      multiple: data.message.pollCreationMessageV3.selectableOptionsCount > 1,
    },
    id: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  })),
);

export type PollMessageOptions = z.infer<typeof PollMessageOptionsSchema>;
export type PollMessageResponse = z.infer<typeof PollMessageResponseSchema>;

export {
  PollMessageBodySchema as BodySchema,
  PollMessageOptionsSchema as OptionsSchema,
  PollMessageResponseSchema as ResponseSchema,
};
