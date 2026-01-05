import { parsePhoneNumberWithError } from "libphonenumber-js/min";
import * as z from "zod/mini";

import { PhoneNumberSchema } from "@/schemas/common";
import { Jid } from "@/types/tags";

const OptionsSchema = z.array(PhoneNumberSchema);

export const Body = (options: CheckOptions) => {
  const data = OptionsSchema.parse(options);
  return { numbers: Array.isArray(data) ? data : [data] };
};

const ResponseSchema = z.array(
  z.object({
    exists: z.boolean(),
    jid: z.string(),
    number: z.string(),
  }),
);

export const Response = (response: unknown) => {
  const data = ResponseSchema.parse(response);
  return data.map((number) => ({
    exists: number.exists,
    jid: Jid(number.jid),
    number: parsePhoneNumberWithError(number.number).number,
  }));
};

export type CheckOptions = z.infer<typeof OptionsSchema>;
export type CheckResponse = ReturnType<typeof Response>;
