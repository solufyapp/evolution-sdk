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
};
