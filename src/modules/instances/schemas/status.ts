import * as z from "zod/mini";

import { StatusSchema } from "./common";

const ResponseSchema = z.object({
  instance: z.object({
    instanceName: z.string(),
    state: StatusSchema,
  }),
});

export const Response = (response: unknown) => {
  const { instance } = ResponseSchema.parse(response);
  return instance.state;
};

export type InstanceStatusResponse = ReturnType<typeof Response>;
