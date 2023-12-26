import TelegramSession from "./telegram-session";
import {NewMessage} from "telegram/events";
import {FUND_NOTIFICATION, REDIS_PUBSUB_CHANNEL_NAME} from "../utils/constants";
import Redis from 'ioredis'
import {Api} from "telegram";
import {wait} from "../utils/util";

/*
Telegram bot alive to listen command from user
 */

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

export const telegramGoLive = async () => {
    const telegramSession = new TelegramSession(true)
    const client = await telegramSession.getTelegramClient()
    const redis = new Redis(REDIS_URL)
    const normalRedis = new Redis(REDIS_URL)

    const me = await client.getMe(false)
    let meID
    if (me instanceof Api.User) {
        meID = me.id
    }
    client.addEventHandler(async (event) => {
        // Use the args from event.message.patternMatch.
        const message = event?.message?.message
        const chatId = event!.message!.chatId
        const fromId = (event!.message!.sender as Api.User)?.id
        // console.log(`chatId: ${chatId} meId: ${meID}`)
        if (message && fromId && fromId.toString() !== meID.toString()) {
            if (message.includes("/start")) {
                const sender = event!.message!.sender as Api.User
                let content = buildHelloMessage(sender)
                await client.sendMessage(chatId, {message: content})
            } else if (message.includes("/subscribe")) {
                const splits = message.split("subscribe")
                const content = splits[1].trimStart().trimEnd()
                await handleSubscribe(chatId, content)
            } else if (message.includes("/unsubscribe")) {
                const splits = message.split("unsubscribe")
                const content = splits[1].trimStart().trimEnd()
                await handleUnsubscribe(chatId, content)
            } else if (message.includes("/info")) {
                await getYourWatchlist(chatId)
            } else {
                await wait(1000)
                await client.sendMessage(chatId, {message: "Wrong command, please check"})
            }
        }
    }, new NewMessage({}));

    redis.subscribe(REDIS_PUBSUB_CHANNEL_NAME, (err, count) => {
        if (err) {
            console.error("Failed to subscribe: %s", err.message);
        } else {
            console.log(
                `Subscribed successfully! This client is currently subscribed to ${count} channels.`
            );
        }
    })

    redis.on("message", async (channel, message) => {
        console.log(`Received ${message} from ${channel}`);
        const {content, env} = buildMessageContent(message)
        const chatIds = await normalRedis.smembers(`subscribe:${env}`)
        client.setParseMode("html");
        for (const chatId of chatIds) {
            await client.sendMessage(chatId, {message: content, parseMode: 'html'})
        }
    });

    const handleSubscribe = async (chatId: bigInt.BigInteger, content: string) => {
        let splits: string[] = content.split(',').map(item => item.trim().toLowerCase())
        if (splits.includes(FUND_NOTIFICATION.ALL)) {
            splits = [
                FUND_NOTIFICATION.FXB_STAG,
                FUND_NOTIFICATION.FXB_PROD,
                FUND_NOTIFICATION.DEX_STAG,
                FUND_NOTIFICATION.DEX_PROD
            ]
        }
        let successList: string[] = []
        for (const subscribeContent of splits) {
            switch (subscribeContent) {
                case FUND_NOTIFICATION.FXB_STAG:
                case FUND_NOTIFICATION.FXB_PROD:
                case FUND_NOTIFICATION.DEX_STAG:
                case FUND_NOTIFICATION.DEX_PROD: {
                    console.log(`${chatId.toString()}-:-${subscribeContent}`)
                    await normalRedis.sadd(`subscribe:${subscribeContent}`, chatId.toString())
                    await normalRedis.sadd(`user:${chatId.toString()}`, subscribeContent)
                    successList.push(subscribeContent)
                    break
                }
                default: {
                    console.log(`Unsupported: ${subscribeContent}`)
                    break
                }
            }
        }
        if (successList.length > 0) {
            await client.sendMessage(chatId, {message: `Subscribed ${successList.join(",")}`})
        } else {
            await client.sendMessage(chatId, {message: `Please ensure subscription content valid`})
        }
    }

    const handleUnsubscribe = async (chatId: bigInt.BigInteger, content: string) => {
        let splits: string[] = content.split(',').map(item => item.trim().toLowerCase())
        if (splits.includes(FUND_NOTIFICATION.ALL)) {
            splits = [
                FUND_NOTIFICATION.FXB_STAG,
                FUND_NOTIFICATION.FXB_PROD,
                FUND_NOTIFICATION.DEX_STAG,
                FUND_NOTIFICATION.DEX_PROD
            ]
        }
        let successUnList: string[] = []
        for (const subscribeContent of splits) {
            switch (subscribeContent) {
                case FUND_NOTIFICATION.FXB_STAG:
                case FUND_NOTIFICATION.FXB_PROD:
                case FUND_NOTIFICATION.DEX_STAG:
                case FUND_NOTIFICATION.DEX_PROD: {
                    console.log(`${chatId.toString()}-:-${subscribeContent}`)
                    await normalRedis.srem(`subscribe:${subscribeContent}`, chatId.toString())
                    await normalRedis.srem(`user:${chatId.toString()}`, subscribeContent)
                    successUnList.push(subscribeContent)
                    break
                }
                default: {
                    console.log(`Unsupported: ${subscribeContent}`)
                    break
                }
            }
        }
        if (successUnList.length > 0) {
            await client.sendMessage(chatId, {message: `Unsubscribed ${successUnList.join(",")}`})
        } else {
            await client.sendMessage(chatId, {message: `Please ensure unsubscription content valid`})
        }
    }

    const getYourWatchlist = async (chatId: bigInt.BigInteger) => {
        const watchList = await normalRedis.smembers(`user:${chatId.toString()}`)
        if (watchList.length > 0) {
            await client.sendMessage(chatId, {message: `You registered ${watchList.join(",")}`})
        } else {
            await client.sendMessage(chatId, {message: `You are not registered`})
        }
    }

    const buildMessageContent = (message: string): { env: string, content: string } => {
        try {
            const object = JSON.parse(message)
            const env = object?.env
            let content: string = `Env: <b>${env}</b>` + "\n"
            const details = object?.batch
            for (const detail of details) {
                content += detail + "\n"
            }
            return {
                env,
                content
            }
        } catch (e) {
            return {
                env: '',
                content: ''
            }
        }
    }

    const buildHelloMessage = (sender: Api.User) => {
        let content = `Hello ${sender.firstName} ${sender.lastName}!`
        content += "\nPlease check bot commands to subscribe/unsubscribe content"
        return content
    }
}


// telegramGoLive()