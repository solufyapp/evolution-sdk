import * as z from "zod/mini";

import { InstanceResponse, InstanceSchema } from "./common";

export const ResponseSchema = z.array(InstanceSchema);

export const Response = (response: unknown) => {
  const data = ResponseSchema.parse(response);
  return data.map(InstanceResponse);
};

export type FindAllInstancesResponse = ReturnType<typeof Response>;
