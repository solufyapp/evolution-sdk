import * as z from "zod/mini";

import { MessageId } from "@/types/tags";
import { replaceWithGreeting } from "@/utils/greeting";

import {
  BaseMessageOptionsSchema,
  KeyResponseSchema,
  ReceiverResponse,
} from "./base";

const OptionsSchema = z.extend(BaseMessageOptionsSchema, {
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

export const Body = (options: PollMessageOptions) => {
  const {
    multiple,
    options: pollOptions,
    ...data
  } = OptionsSchema.parse(options);
  return {
    ...data,
    selectableCount: multiple ? pollOptions.length : 1,
    values: pollOptions,
  };
};

const ResponseSchema = z.object({
  key: KeyResponseSchema,
  message: z.object({
    pollCreationMessageV3: z.object({
      name: z.string(),
      options: z.array(z.object({ optionName: z.string() })),
      selectableOptionsCount: z.number(),
    }),
  }),
  messageTimestamp: z.coerce.date(),
});

export const Response = (response: unknown) => {
  const data = ResponseSchema.parse(response);
  return {
    receiver: ReceiverResponse(data.key.remoteJid),
    poll: {
      name: data.message.pollCreationMessageV3.name,
      options: data.message.pollCreationMessageV3.options.map(
        (option) => option.optionName,
      ),
      multiple: data.message.pollCreationMessageV3.selectableOptionsCount > 1,
    },
    id: MessageId(data.key.id),
    timestamp: data.messageTimestamp,
  };
};

export type PollMessageOptions = z.infer<typeof OptionsSchema>;
export type PollMessageResponse = ReturnType<typeof Response>;
