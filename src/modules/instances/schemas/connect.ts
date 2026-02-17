import * as z from "zod/mini";

const ResponseSchema = z.object({
  pairingCode: z.nullable(z.string()),
  code: z.string(),
  base64: z.z.string(),
});

export const Response = (response: unknown) => {
  const { pairingCode, ...data } = ResponseSchema.parse(response);
  return {
    ...data,
    pairingCode: pairingCode ?? undefined,
  };
};

export type ConnectInstanceResponse = ReturnType<typeof Response>;
