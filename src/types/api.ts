export type APIRequestInit = Omit<
  RequestInit,
  "method" | "body" | "headers"
> & {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  body?: object | FormData;
};
