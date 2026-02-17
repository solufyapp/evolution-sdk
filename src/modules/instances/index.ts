import type { EvolutionApi } from "@/api";
import { Routes } from "@/api/routes";

import * as Connect from "./schemas/connect";
import * as Create from "./schemas/create";
import * as FindAll from "./schemas/find-all";
import * as FindOne from "./schemas/find-one";
import * as Status from "./schemas/status";

export class InstancesModule {
  constructor(private readonly api: EvolutionApi) {}

  /**
   * Creates an instance
   * @param options - Instance options
   */
  async create(
    options: Create.CreateInstanceOptions,
  ): Promise<Create.CreateInstanceResponse> {
    const body = Create.Body(options);
    const response = await this.api.post(Routes.Instances.Create, { body });

    return Create.Response(response);
  }

  /**
   * Finds all instances
   */
  async findAll(): Promise<FindAll.FindAllInstancesResponse> {
    const response = await this.api.get(Routes.Instances.Find);

    return FindAll.Response(response);
  }

  /**
   * Finds one instance by id
   */
  async findById(id: string): Promise<FindOne.FindOneInstanceResponse> {
    const response = await this.api.get(Routes.Instances.Find, {
      params: { instanceId: id },
    });

    return FindOne.Response(response);
  }

  /**
   * Finds one instance by name
   */
  async findByName(name: string): Promise<FindOne.FindOneInstanceResponse> {
    const response = await this.api.get(Routes.Instances.Find, {
      params: { instanceName: name },
    });

    return FindOne.Response(response);
  }

  /**
   * Returns the QRCode and/or pairing code
   */
  async connect(instance: string): Promise<Connect.ConnectInstanceResponse> {
    const response = await this.api.get(Routes.Instances.Connect(instance));

    return Connect.Response(response);
  }

  /**
   * Restarts the instance and returns the QRCode and/or pairing code
   */
  async restart(instance: string): Promise<Connect.ConnectInstanceResponse> {
    const response = await this.api.post(Routes.Instances.Restart(instance));

    return Connect.Response(response);
  }

  /**
   * Returns the instance connection status
   */
  async status(instance: string): Promise<Status.InstanceStatusResponse> {
    const response = await this.api.get(Routes.Instances.Status(instance));

    return Status.Response(response);
  }

  /**
   * Logs out the instance
   */
  async logout(instance: string): Promise<void> {
    await this.api.delete(Routes.Instances.Logout(instance));
  }

  /**
   * Deletes the instance
   */
  async delete(instance: string): Promise<void> {
    await this.api.delete(Routes.Instances.Delete(instance));
  }
}
