import TelegramSession from "./telegram-session";
import {Api} from "telegram";

export default class TelegramService {
  telegramSession: TelegramSession

  constructor() {
    this.telegramSession = new TelegramSession(true)
  }

  sendMessage = async (chatId: string, message: string) => {
    if (!chatId) throw new Error("chatId is required")
    if (!message) throw new Error("message is required")
    const client =  await this.telegramSession.getTelegramClient()
    const result = await client.invoke(
      new Api.messages.SendMessage({
        peer: chatId,
        message: message,
        noWebpage: true,
        noforwards: true
      })
    );
    console.log(result)
  }
}