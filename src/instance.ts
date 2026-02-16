import * as z from "zod/mini";

import { InstanceApi } from "./api/instance";
import { ChatsModule } from "./modules/chats";
import { GroupsModule } from "./modules/groups";
import { MessagesModule } from "./modules/messages";
import { type ClientOptions, ClientOptionsSchema } from "./schemas/client";

export class EvolutionInstance {
  /**
   * API service for directly interacting with the Evolution API
   */
  public readonly api: InstanceApi;
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
   * Evolution Instance - API client for interacting with the Evolution API for instance routes
   * @param instance - Instance name
   * @param options - Client options
   */
  constructor(
    public readonly instance: string,
    public readonly options: ClientOptions,
  ) {
    z.string().parse(instance);
    ClientOptionsSchema.parse(options);

    this.api = new InstanceApi(instance, options);
    this.chats = new ChatsModule(this.api);
    this.groups = new GroupsModule(this.api);
    this.messages = new MessagesModule(this.api);
  }
}
