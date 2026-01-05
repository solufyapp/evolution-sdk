import * as z from "zod/mini";

export const ClientOptionsSchema = z.object({
  /**
   * Your server URL
   */
  serverUrl: z.url(),
  /**
   * Your instance token or global API key
   */
  token: z.string(),
  /**
   * Your instance name
   */
  instance: z.string(),
});

export type ClientOptions = z.infer<typeof ClientOptionsSchema>;
