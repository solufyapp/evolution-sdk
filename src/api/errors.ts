import * as z from "zod";

export class EvolutionApiError extends Error {
  constructor(message: string, cause?: unknown) {
    const error = getErrorMessage(cause);

    super(message, error ? undefined : { cause });

    this.name = EvolutionApiError.name;
    this.message = error ?? message;
  }
}

const ErrorMessages = [
  ErrorMessage(
    z.object({
      message: z.array(
        z.object({
          exists: z.literal(false),
          jid: z.string(),
          number: z.string(),
        }),
      ),
    }),
    "Provided number is not a valid WhatsApp number",
  ),
  ErrorMessage(
    z.object({
      message: z.array(z.string().includes("Media upload failed on all hosts")),
    }),
    "Media upload failed on all hosts",
  ),
  ErrorMessage(
    z.object({
      message: z.array(z.string().includes("AxiosError")),
    }),
    (response) => response.message[0],
  ),
  ErrorMessage(
    z.object({
      message: z.array(z.string().includes("No session")),
    }),
    "No session found, try restarting your instance",
  ),
  ErrorMessage(
    z.object({
      message: z.array(z.string().includes("AggregateError")),
    }),
    "AggregateError",
  ),
];

function getErrorMessage(response: unknown) {
  const error = ErrorMessages.find(
    (message) => message.schema.safeParse(response).success,
  );

  return error
    ? typeof error.message === "string"
      ? error.message
      : // biome-ignore lint/suspicious/noExplicitAny: Generic
        error.message(response as any)
    : undefined;
}

function ErrorMessage<T extends z.ZodType>(
  schema: T,
  message: string | ((data: z.infer<T>) => string),
) {
  return { schema, message };
}
