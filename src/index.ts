import { EvolutionApi } from "./api";
import { InstancesModule } from "./modules/instances";
import { type ClientOptions, ClientOptionsSchema } from "./schemas/client";

export class EvolutionClient {
  /**
   * API service for directly interacting with the Evolution API (no specific typings)
   */
  public readonly api: EvolutionApi;
  /**
   * Find and manage instances
   */
  public readonly instances: InstancesModule;

  /**
   * Evolution Client - API client for interacting with the Evolution API
   * @param options - Client options
   */
  constructor(public readonly options: ClientOptions) {
    ClientOptionsSchema.parse(options);

    this.api = new EvolutionApi(options);
    this.instances = new InstancesModule(this.api);
  }
}

export type * from "./modules/chats/schemas";
export type * from "./modules/groups/schemas";
export type * from "./modules/instances/schemas";
export type * from "./modules/messages/schemas";
export { EvolutionApiError } from "./api/errors";
export { EvolutionInstance } from "./instance";
export { ChatId, GroupJid, Jid, MessageId } from "./types/tags";
export { phoneNumberFromJid } from "./utils/phone-numer-from-jid";
export type { ClientOptions };
