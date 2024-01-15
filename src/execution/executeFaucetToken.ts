import {faucetToken} from "../bot/faucetToken"
import {getCurrentTimeStr} from "../utils/util";
const cron = require('node-cron');

(() => {
  cron.schedule('0 16 * * *', async () => {
    console.log(`Last Faucet: ${getCurrentTimeStr()}`)
    await faucetToken()
  });
})()