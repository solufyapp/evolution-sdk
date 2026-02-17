export const Routes = {
  Message: {
    SendText: "message/sendText",
    SendMedia: "message/sendMedia",
    SendVoice: "message/sendWhatsAppAudio",
    SendSticker: "message/sendSticker",
    SendLocation: "message/sendLocation",
    SendContact: "message/sendContact",
    SendPoll: "message/sendPoll",
  },
  Chats: {
    Check: "chat/whatsappNumbers",
    FindAll: "chat/findChats",
    SendPresence: "chat/sendPresence",
  },
  Groups: {
    FindAll: "group/fetchAllGroups",
    FindByJid: "group/findGroupInfos",
    FindByInviteCode: "group/inviteInfo",
  },
  Instances: {
    Create: "instance/create",
    Find: "instance/fetchInstances",
    Connect: (instance: string) => `instance/connect/${instance}`,
    Restart: (instance: string) => `instance/restart/${instance}`,
    Presence: (instance: string) => `instance/setPresence/${instance}`,
    Status: (instance: string) => `instance/connectionState/${instance}`,
    Logout: (instance: string) => `instance/logout/${instance}`,
    Delete: (instance: string) => `instance/delete/${instance}`,
  },
};
