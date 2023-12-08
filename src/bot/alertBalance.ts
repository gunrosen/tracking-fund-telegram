import TelegramSession from "../session/TelegramSession";

const alertBalance = async () => {
  let botTelegramSession = new TelegramSession(true)
  const clientTelegram = await botTelegramSession.getTelegramClient()
  clientTelegram.on((event) => {
    console.log(event)
  })

}