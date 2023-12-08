import * as dotenv from 'dotenv'

dotenv.config()
import {TelegramClient, Api} from "telegram";
import {StringSession} from "telegram/sessions";
import input from 'input'

const apiId = parseInt(process.env.TELEGRAM_API_ID || "0");
const apiHash = process.env.TELEGRAM_API_HASH || "";
const stringSession = new StringSession("");

/**
 * Tool to get User session token
 * Be careful to use because this token will be your representative
 */
export default async function () {
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.password("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  console.log("Please copy following string into TELEGRAM_SESSION .env");
  console.log(client.session.save());
  await client.connect()
  const me = await client.getMe()
  if (me instanceof Api.User) {
    console.log(`You logged in as : ${me.username}`)
  }
  process.exit()
}
