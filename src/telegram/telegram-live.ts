import TelegramSession from "./telegram-session";
import {Api} from "telegram";

const telegramGoLive = async () => {
  const telegramSession = new TelegramSession(true)
  const client = await telegramSession.getTelegramClient()
}

telegramGoLive()