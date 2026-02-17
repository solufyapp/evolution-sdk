import * as z from "zod/mini";

export class EvolutionApiError extends Error {
  public code?: string;
  public instance?: string;

  constructor(
    message: string,
    options?: { cause?: unknown; instance?: string; code?: string },
  ) {
    const error = getError(options?.cause);

    super(message, error ? undefined : { cause: options?.cause });

    this.name = EvolutionApiError.name;
    this.message = error?.message ?? message;
    this.code = error?.code ?? options?.code;
    this.instance = options?.instance;
  }
}

const Errors = [
  defineError(z.literal("Unauthorized"), "unauthorized", "Unauthorized"),
  defineError(
    z.array(
      z.object({
        exists: z.literal(false),
        jid: z.string(),
        number: z.string(),
      }),
    ),
    "invalid_whatsapp_number",
    "Provided number is not a valid WhatsApp number",
  ),
  defineError(
    z.array(z.string().check(z.includes("Media upload failed on all hosts"))),
    "media_upload_failed",
    "Media upload failed on all hosts",
  ),
  defineError(
    z.array(z.string().check(z.includes("AxiosError"))),
    "generic",
    (r) => r.message[0],
  ),
  defineError(
    z.array(z.string().check(z.includes("No session"))),
    "no_session_found",
    "No session found, try restarting your instance",
  ),
  defineError(
    z.array(z.string().check(z.includes("AggregateError"))),
    "aggregate_error",
    "AggregateError",
  ),
  defineError(
    z.array(z.string().check(z.includes("instance does not exist"))),
    "instance_not_found",
    "Instance not found",
  ),
];

// biome-ignore lint/suspicious/noExplicitAny: Response is any
function getError(response: any) {
  const error = Errors.find(
    (message) => message.schema.safeParse(response).success,
  );

  return error
    ? {
        code: error.code,
        message:
          typeof error.message === "string"
            ? error.message
            : error.message(response),
      }
    : undefined;
}

function defineError<T extends z.ZodMiniType>(
  schema: T,
  code: string,
  message:
    | string
    | ((data: z.infer<z.ZodMiniObject<{ message: T }>>) => string),
) {
  return { schema: z.object({ message: schema }), code, message };
}
