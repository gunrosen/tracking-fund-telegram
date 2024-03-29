import TelegramSession from "../telegram/telegram-session";
import {Api} from "telegram";
import {FUND_NOTIFICATION} from "../utils/constants";

const setupTelegramBot = async () => {
  let botTelegramSession = new TelegramSession(true)
  const clientTelegram = await botTelegramSession.getTelegramClient()
  let supportedEnv: string[] = []
  Object.keys(FUND_NOTIFICATION).forEach((k,i) => {supportedEnv.push(FUND_NOTIFICATION[k])})
  await clientTelegram.invoke(
    new Api.bots.SetBotCommands({
      scope: new Api.BotCommandScopeDefault(),
      langCode: "en",
      commands: [
        new Api.BotCommand({
          command: "subscribe",
          description: `env: ${supportedEnv.join(" ")}`,
        }),
        new Api.BotCommand({
          command: "unsubscribe",
          description: `env: ${supportedEnv.join(" ")}`,
        }),
        new Api.BotCommand({
          command: "mute",
          description: `mute alert from bot`,
        }),
        new Api.BotCommand({
          command: "unmute",
          description: `unmute alert`,
        }),
        new Api.BotCommand({
          command: "info",
          description: `your information`,
        }),
        new Api.BotCommand({
          command: "balance",
          description: `inquire balance information`,
        }),
      ],
    })
  )
  console.log("Set up bot completed")
  process.exit()
}

setupTelegramBot()