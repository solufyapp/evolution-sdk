import * as z from "zod/mini";

import { InstanceResponse, InstanceSchema } from "./common";

export const ResponseSchema = z.array(InstanceSchema);

export const Response = (response: unknown) => {
  const data = ResponseSchema.parse(response);
  return InstanceResponse(data[0]);
};

export type FindOneInstanceResponse = ReturnType<typeof Response>;
