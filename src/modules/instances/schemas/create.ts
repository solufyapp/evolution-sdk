import * as z from "zod/mini";

import { PhoneNumberSchema } from "@/schemas/common";

import { IntegrationMap, IntegrationSchema, StatusSchema } from "./common";

const OptionsSchema = z.object({
  name: z.string(),
  integration: z.optional(IntegrationSchema.Map),
  token: z.optional(z.string()),
  number: z.optional(PhoneNumberSchema),
});

export const Body = (options: CreateInstanceOptions) => {
  const data = OptionsSchema.parse(options);

  return {
    instanceName: data.name,
    integration: IntegrationMap[data.integration ?? "baileys"],
    number: data.number,
    token: data.token,
  };
};

const ResponseSchema = z.object({
  instance: z.object({
    instanceName: z.string(),
    instanceId: z.string(),
    integration: IntegrationSchema.Raw,
    status: StatusSchema,
  }),
  hash: z.string(),
});

export const Response = (response: unknown) => {
  const data = ResponseSchema.parse(response);
  const { instance } = data;
  return {
    id: instance.instanceId,
    name: instance.instanceName,
    integration: IntegrationMap[instance.integration],
    status: instance.status,
    token: data.hash,
  };
};

export type CreateInstanceOptions = z.infer<typeof OptionsSchema>;
export type CreateInstanceResponse = ReturnType<typeof Response>;
