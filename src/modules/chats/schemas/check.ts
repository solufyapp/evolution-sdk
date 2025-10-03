import { parsePhoneNumberWithError } from "libphonenumber-js";
import * as z from "zod";

import { PhoneNumberSchema } from "@/schemas/common";
import { Jid } from "@/types/tags";

export const CheckOptionsSchema = z.array(PhoneNumberSchema);

export const CheckBodySchema = CheckOptionsSchema.transform((data) => ({
  numbers: Array.isArray(data) ? data : [data],
}));

export const CheckResponseSchema = z
  .array(
    z.object({
      exists: z.boolean(),
      jid: z.string(),
      number: z.string(),
    }),
  )
  .transform((numbers) =>
    numbers.map((number) => ({
      exists: number.exists,
      jid: Jid(number.jid),
      number: parsePhoneNumberWithError(number.number).number,
    })),
  );

export type CheckOptions = z.infer<typeof CheckOptionsSchema>;
export type CheckResponse = z.infer<typeof CheckResponseSchema>;

export {
  CheckBodySchema as BodySchema,
  CheckOptionsSchema as OptionsSchema,
  CheckResponseSchema as ResponseSchema,
};
