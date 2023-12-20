import TelegramSession from "./telegram-session";
import {NewMessage} from "telegram/events";
/*
Telegram bot alive to listen command from user
 */
const telegramGoLive = async () => {
  const telegramSession = new TelegramSession(true)
  const client = await telegramSession.getTelegramClient()

  client.addEventHandler(async (event) => {
    // Use the args from event.message.patternMatch.
    const message = event?.message?.message
    if (message) {
      if (message.match(/^\/subscribe ([A-Za-z0-9 ]+)$/)) {
        const splits = message.split("subscribe")
        const content = splits[1].trimStart().trimEnd()
        await handleSubscribe(event!.message!.chatId, content)
      } else if (message.match(/^\/unsubscribe ([A-Za-z0-9 ]+)$/)) {
        const splits = message.split("unsubscribe")
        const content = splits[1].trimStart().trimEnd()
        await handleUnsubscribe(event!.message!.chatId, content)
      } else {
        await client.sendMessage(event?.message.chatId, {message: "Wrong command, please check"})
      }
    }
  }, new NewMessage({}));

  const handleSubscribe = async (chatId: bigInt.BigInteger,content: string) => {

  }

  const handleUnsubscribe = async (chatId: bigInt.BigInteger,content: string) => {

  }
}


telegramGoLive()