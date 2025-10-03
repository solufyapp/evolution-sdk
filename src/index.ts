import { ApiService } from "./api/service";
import { ChatsModule } from "./modules/chats";
import { GroupsModule } from "./modules/groups";
import { MessagesModule } from "./modules/messages";
import { type ClientOptions, ClientOptionsSchema } from "./schemas/client";

export class EvolutionClient {
  /**
   * API service for directly interacting with the Evolution API (no specific typings)
   */
  public readonly api: ApiService;

  /**
   * Find and manage chats, send presences and check numbers
   */
  public readonly chats: ChatsModule;
  /**
   * Find and manage groups
   */
  public readonly groups: GroupsModule;
  /**
   * Send messages
   */
  public readonly messages: MessagesModule;

  /**
   * Evolution Client - API client for interacting with the Evolution API
   * @param options - Client options
   */
  constructor(public readonly options: ClientOptions) {
    ClientOptionsSchema.parse(options);

    this.api = new ApiService(options);
    this.chats = new ChatsModule(this.api);
    this.groups = new GroupsModule(this.api);
    this.messages = new MessagesModule(this.api);
  }
}

export type * from "./modules/chats/schemas";
export type * from "./modules/groups/schemas";
export type * from "./modules/messages/schemas";
export { EvolutionApiError } from "./api/errors";
export { ChatId, GroupJid, Jid, MessageId } from "./types/tags";
export { phoneNumberFromJid } from "./utils/phone-numer-from-jid";
export type { ClientOptions };
