import type { ApiService } from "@/api/service";
import { Routes } from "@/api/routes";

import * as Check from "./schemas/check";
import * as FindAll from "./schemas/find-all";
import * as Presence from "./schemas/presence";

export class ChatsModule {
  constructor(private readonly api: ApiService) {}

  /**
   * Checks if a number has WhatsApp
   * @param numbers - Number(s) (with country code) to check
   */
  async check(
    ...numbers: Check.CheckOptions | Check.CheckOptions[]
  ): Promise<Check.CheckResponse> {
    const body = Check.CheckBodySchema.parse(numbers.flat());
    const response = await this.api.post(Routes.Chats.Check, { body });

    return Check.CheckResponseSchema.parse(response);
  }

  /**
   * Gets all chats
   */
  async findAll(): Promise<FindAll.FindAllChatsResponse> {
    const response = await this.api.post(Routes.Chats.FindAll);

    return FindAll.ResponseSchema.parse(response);
  }

  /**
   * Sends a presence to a certain chat
   * @param options - Presence options
   */
  async sendPresence(options: Presence.PresenceOptions) {
    const body = Presence.BodySchema.parse(options);

    if (options.waitUntilFinish) {
      await this.api.post(Routes.Chats.SendPresence, { body });
    } else {
      this.api.post(Routes.Chats.SendPresence, { body });
    }
  }
}
