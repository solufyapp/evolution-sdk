import type { ApiService } from "@/api/service";
import { Routes } from "@/api/routes";

import * as Audio from "./schemas/audio";
import * as Contact from "./schemas/contact";
import * as Document from "./schemas/document";
import * as Image from "./schemas/image";
import * as Location from "./schemas/location";
import * as Sticker from "./schemas/sticker";
import * as Text from "./schemas/text";
import * as Video from "./schemas/video";
import * as Voice from "./schemas/voice";

export class MessagesModule {
  constructor(private readonly api: ApiService) {}

  /**
   * Sends a text message
   * @param options - Text message options
   */
  async sendText(
    options: Text.TextMessageOptions,
  ): Promise<Text.TextMessageResponse> {
    const body = Text.Body(options);
    const response = await this.api.post(Routes.Message.SendText, { body });

    return Text.Response(response);
  }

  /**
   * Sends an image
   * @param options - Image message options
   */
  async sendImage(
    options: Image.ImageMessageOptions,
  ): Promise<Image.ImageMessageResponse> {
    const body = Image.Body(options);
    const response = await this.api.post(Routes.Message.SendMedia, { body });

    return Image.Response(response);
  }

  /**
   * Sends a video
   * @param options - Video message options
   */
  async sendVideo(
    options: Video.VideoMessageOptions,
  ): Promise<Video.VideoMessageResponse> {
    const body = Video.Body(options);
    const response = await this.api.post(Routes.Message.SendMedia, { body });

    return Video.Response(response);
  }

  /**
   * Sends a document
   * @param options - Document message options
   */
  async sendDocument(
    options: Document.DocumentMessageOptions,
  ): Promise<Document.DocumentMessageResponse> {
    const body = Document.Body(options);
    const response = await this.api.post(Routes.Message.SendMedia, { body });

    return Document.Response(response);
  }

  /**
   * Sends an audio
   * @param options - Audio message options
   */
  async sendAudio(
    options: Audio.AudioMessageOptions,
  ): Promise<Audio.AudioMessageResponse> {
    const body = Audio.Body(options);
    const response = await this.api.post(Routes.Message.SendMedia, { body });

    return Audio.Response(response);
  }

  /**
   * Sends a voice message
   * @param options - Voice message options
   */
  async sendVoice(
    options: Voice.VoiceMessageOptions,
  ): Promise<Voice.VoiceMessageResponse> {
    const body = Voice.Body(options);
    const response = await this.api.post(Routes.Message.SendVoice, { body });

    return Voice.Response(response);
  }

  /**
   * Sends a sticker
   * @param options - Sticker message options
   */
  async sendSticker(
    options: Sticker.StickerMessageOptions,
  ): Promise<Sticker.StickerMessageResponse> {
    const body = Sticker.Body(options);
    const response = await this.api.post(Routes.Message.SendSticker, { body });

    return Sticker.Response(response);
  }

  /**
   * Sends a location
   * @param options - Location message options
   */
  async sendLocation(
    options: Location.LocationMessageOptions,
  ): Promise<Location.LocationMessageResponse> {
    const body = Location.Body(options);
    const response = await this.api.post(Routes.Message.SendLocation, { body });

    return Location.Response(response);
  }

  /**
   * Sends a contact
   * @param options - Contact message options
   */
  async sendContact(
    options: Contact.ContactMessageOptions,
  ): Promise<Contact.ContactMessageResponse> {
    const body = Contact.Body(options);
    const response = await this.api.post(Routes.Message.SendContact, { body });

    return Contact.Response(response);
  }
}
