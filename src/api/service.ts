import type { ClientOptions } from "@/schemas/client";
import type { APIRequestInit } from "@/types/api";

import { EvolutionApiError } from "./errors";

export class ApiService {
  constructor(private readonly options: ClientOptions) {}

  async get<T>(path: string, options: Omit<APIRequestInit, "method"> = {}) {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  async post<T>(path: string, options: Omit<APIRequestInit, "method"> = {}) {
    return this.request<T>(path, { ...options, method: "POST" });
  }

  async put<T>(path: string, options: Omit<APIRequestInit, "method"> = {}) {
    return this.request<T>(path, { ...options, method: "PUT" });
  }

  async patch<T>(path: string, options: Omit<APIRequestInit, "method"> = {}) {
    return this.request<T>(path, { ...options, method: "PATCH" });
  }

  async delete<T>(path: string, options: Omit<APIRequestInit, "method"> = {}) {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }

  async request<T = unknown>(
    path: string,
    options: APIRequestInit = {},
  ): Promise<T> {
    const { init, params } = this.makeInit(options);
    const url = new URL(
      `/${path}/${this.options.instance}/?${params}`,
      this.options.serverUrl,
    );

    const response = await fetch(url, init);
    const data = await response.json();

    if (!response.ok || "error" in data) {
      throw new EvolutionApiError(
        `${this.options.instance} ${data.error || "Unknown Error"}`,
        data.response,
      );
    }

    return data;
  }

  private makeInit(options: APIRequestInit) {
    const { params: _, headers, body, ...rest } = options;

    const paramsInit =
      options.params &&
      Object.entries(options.params)
        .filter(([, value]) => Boolean(value))
        .map(([key, value]) => [key, String(value)]);
    const params = new URLSearchParams(paramsInit);

    const init: RequestInit & { headers: Record<string, string> } = {
      ...rest,
      headers: { ...(headers || {}), apikey: this.options.token },
    };

    if (body) {
      init.headers["Content-Type"] =
        body instanceof FormData ? "multipart/form-data" : "application/json";
      init.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    return { init, params };
  }
}
