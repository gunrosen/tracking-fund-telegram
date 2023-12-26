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
      if (message.includes("/subscribe")) {
        const splits = message.split("subscribe")
        const content = splits[1].trimStart().trimEnd()
        await handleSubscribe(event!.message!.chatId, content)
      } else if (message.includes("/unsubscribe")) {
        const splits = message.split("unsubscribe")
        const content = splits[1].trimStart().trimEnd()
        await handleUnsubscribe(event!.message!.chatId, content)
      } else if (message.includes("/info")){
        await getYourWatchlist(event!.message!.chatId)
      }else {
        await client.sendMessage(event?.message.chatId, {message: "Wrong command, please check"})
      }
    }
  }, new NewMessage({}));

  const handleSubscribe = async (chatId: bigInt.BigInteger,content: string) => {
    let splits: string[] = content.split(',').map(item => item.trim().toLowerCase())
    if (splits.includes(FUND_NOTIFICATION.ALL)){
      splits = [
        FUND_NOTIFICATION.FXB_STAG,
        FUND_NOTIFICATION.FXB_PROD,
        FUND_NOTIFICATION.DEX_STAG,
        FUND_NOTIFICATION.DEX_PROD
      ]
    }
    let successList: string[] = []
    for (const subscribeContent of splits){
      switch (subscribeContent) {
        case FUND_NOTIFICATION.FXB_STAG:
        case FUND_NOTIFICATION.FXB_PROD:
        case FUND_NOTIFICATION.DEX_STAG:
        case FUND_NOTIFICATION.DEX_PROD:{
          console.log(`${chatId.toString()}-:-${subscribeContent}`)
          await redis.sadd(`subscribe:${subscribeContent}`, chatId.toString())
          await redis.sadd(`user:${chatId.toString()}`, subscribeContent)
          successList.push(subscribeContent)
          break
        }
        default:{
          console.log(`Unsupported: ${subscribeContent}`)
          break
        }
      }
    }
    if (successList.length > 0){
      await client.sendMessage(chatId, {message: `Subscribed ${successList.join(",")}`})
    } else {
      await client.sendMessage(chatId, {message: `Please ensure subscription content valid`})
    }
  }

  const handleUnsubscribe = async (chatId: bigInt.BigInteger,content: string) => {
    let splits: string[] = content.split(',').map(item => item.trim().toLowerCase())
    if (splits.includes(FUND_NOTIFICATION.ALL)){
      splits = [
        FUND_NOTIFICATION.FXB_STAG,
        FUND_NOTIFICATION.FXB_PROD,
        FUND_NOTIFICATION.DEX_STAG,
        FUND_NOTIFICATION.DEX_PROD
      ]
    }
    let successUnList: string[] = []
    for (const subscribeContent of splits){
      switch (subscribeContent) {
        case FUND_NOTIFICATION.FXB_STAG:
        case FUND_NOTIFICATION.FXB_PROD:
        case FUND_NOTIFICATION.DEX_STAG:
        case FUND_NOTIFICATION.DEX_PROD:{
          console.log(`${chatId.toString()}-:-${subscribeContent}`)
          await redis.srem(`subscribe:${subscribeContent}`, chatId.toString())
          await redis.srem(`user:${chatId.toString()}`, subscribeContent)
          successUnList.push(subscribeContent)
          break
        }
        default:{
          console.log(`Unsupported: ${subscribeContent}`)
          break
        }
      }
    }
    if (successUnList.length > 0){
      await client.sendMessage(chatId, {message: `Unsubscribed ${successUnList.join(",")}`})
    } else {
      await client.sendMessage(chatId, {message: `Please ensure unsubscription content valid`})
    }
  }

  const getYourWatchlist = async (chatId: bigInt.BigInteger) => {
    const watchList = await redis.smembers(`user:${chatId.toString()}`)
    if (watchList.length > 0){
      await client.sendMessage(chatId, {message: `You registered ${watchList.join(",")}`})
    } else {
      await client.sendMessage(chatId, {message: `You do not registered`})
    }
  }

}


telegramGoLive()