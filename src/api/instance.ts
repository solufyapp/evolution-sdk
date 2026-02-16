import type { ClientOptions } from "@/schemas/client";
import type { APIRequestInit } from "@/types/api";

import { EvolutionApi } from ".";
import { EvolutionApiError } from "./errors";

export class InstanceApi extends EvolutionApi {
  constructor(
    protected readonly instance: string,
    protected readonly options: ClientOptions,
  ) {
    super(options);
  }

  async request<T = unknown>(
    path: string,
    options: APIRequestInit = {},
  ): Promise<T> {
    const { init, params } = this.makeInit(options);
    const url = new URL(
      `/${path}/${this.instance}/?${params}`,
      this.options.serverUrl,
    );

    const response = await fetch(url, init);
    const data = await response.json();

    if (!response.ok || "error" in data) {
      throw new EvolutionApiError(
        `[${this.instance}] ${data.error || "Unknown Error"}`,
        data.response,
      );
    }

    return data;
  }
}
