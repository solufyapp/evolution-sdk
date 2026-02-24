import * as z from "zod/mini";

const ResponseSchema = z.object({
  pairingCode: z.nullable(z.string()),
  code: z.nullable(z.string()),
  base64: z.nullable(z.string()),
});

export const Response = (response: unknown) => {
  const { pairingCode, code, base64 } = ResponseSchema.parse(response);
  return {
    pairingCode: pairingCode ?? undefined,
    code: code ?? undefined,
    base64: base64 ?? undefined,
  };
};

export type ConnectInstanceResponse = ReturnType<typeof Response>;
