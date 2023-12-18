import TelegramSession from "../telegram/telegram-session";
import {Api} from "telegram";

const setupTelegramBot = async () => {
  let botTelegramSession = new TelegramSession(true)
  const clientTelegram = await botTelegramSession.getTelegramClient()
  const result = await clientTelegram.invoke(
    new Api.bots.SetBotCommands({
      scope: new Api.BotCommandScopeDefault(),
      langCode: "en",
      commands: [
        new Api.BotCommand({
          command: "subscribe",
          description: "Choose env: fxbox_staging, fxbox_prod, dex_staging, dex_prod",
        }),
        new Api.BotCommand({
          command: "unsubscribe",
          description: "Choose env: fxbox_staging, fxbox_prod, dex_staging, dex_prod",
        }),
      ],
    })
  );
}

setupTelegramBot()