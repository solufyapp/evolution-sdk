import * as z from "zod/mini";

export const IntegrationMap = {
  baileys: "WHATSAPP-BAILEYS",
  business: "WHATSAPP-BUSINESS",
  evolution: "EVOLUTION",

  "WHATSAPP-BAILEYS": "baileys",
  "WHATSAPP-BUSINESS": "business",
  EVOLUTION: "evolution",
} as const;

export const IntegrationSchema = {
  Raw: z.union([
    z.literal("WHATSAPP-BAILEYS"),
    z.literal("WHATSAPP-BUSINESS"),
    z.literal("EVOLUTION"),
  ]),
  Map: z.union([
    z.literal("baileys"),
    z.literal("business"),
    z.literal("evolution"),
  ]),
};

export const StatusSchema = z.union([
  z.literal("connecting"),
  z.literal("close"),
  z.literal("open"),
]);

export const InstanceSchema = z.object({
  id: z.string(),
  name: z.string(),
  connectionStatus: StatusSchema,
  ownerJid: z.nullable(z.string()),
  profileName: z.nullable(z.string()),
  profilePicUrl: z.nullable(z.string()),
  integration: IntegrationSchema.Raw,
  number: z.nullable(z.string()),
  token: z.string(),
  businessId: z.nullable(z.string()),
  clientName: z.string(),
  disconnectionReasonCode: z.nullable(z.number()),
  disconnectionObject: z.nullable(z.string()),
  disconnectionAt: z.nullable(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  _count: z.object({
    Message: z.number(),
    Contact: z.number(),
    Chat: z.number(),
  }),
});

export const InstanceResponse = (instance: InstanceResponse) => ({
  id: instance.id,
  name: instance.name,
  status: instance.connectionStatus,
  integration: IntegrationMap[instance.integration],
  number: instance.number ?? undefined,
  token: instance.token,
  businessId: instance.businessId ?? undefined,
  clientName: instance.clientName,
  createdAt: new Date(instance.createdAt),
  updatedAt: new Date(instance.updatedAt),

  profile:
    instance.ownerJid && instance.profileName
      ? {
          jid: instance.ownerJid,
          name: instance.profileName,
          pictureUrl: instance.profilePicUrl ?? undefined,
        }
      : undefined,

  disconnection:
    instance.disconnectionAt &&
    instance.disconnectionObject &&
    instance.disconnectionReasonCode
      ? {
          reasonCode: instance.disconnectionReasonCode,
          object: instance.disconnectionObject,
          at: new Date(instance.disconnectionAt),
        }
      : undefined,

  count: {
    messages: instance._count.Message,
    contacts: instance._count.Contact,
    chats: instance._count.Chat,
  },
});

export type InstanceResponse = z.infer<typeof InstanceSchema>;

export type InstanceIntegration = z.infer<typeof IntegrationSchema.Map>;
export type InstanceStatus = z.infer<typeof StatusSchema>;
