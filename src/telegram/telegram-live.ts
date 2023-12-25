import TelegramSession from "./telegram-session";
import {NewMessage} from "telegram/events";
import {FUND_NOTIFICATION} from "../utils/constants";
import Redis from 'ioredis'
import {Api} from "telegram";
/*
Telegram bot alive to listen command from user
 */

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

const telegramGoLive = async () => {
  const telegramSession = new TelegramSession(true)
  const client = await telegramSession.getTelegramClient()
  const redis = new Redis(REDIS_URL)

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
    const splits = content.split(',').map(item => item.trim().toLowerCase())
    for (const subscribeContent of splits){
      switch (subscribeContent) {
        case FUND_NOTIFICATION.FXB_STAG: {
          const result = await client.invoke(
            new Api.help.GetUserInfo({
              userId: chatId,
            })
          );
          await redis.sadd(chatId.toString(), result.toString())
          break
        }
        case FUND_NOTIFICATION.FXB_PROD: {

          break
        }
        case FUND_NOTIFICATION.DEX_STAG: {

          break
        }
        case FUND_NOTIFICATION.DEX_PROD: {

          break
        }
      }
    }
  }

  const handleUnsubscribe = async (chatId: bigInt.BigInteger,content: string) => {

  }
}


telegramGoLive()