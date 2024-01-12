import {faucetToken} from "../bot/faucetToken"
import {getCurrentTimeStr} from "../utils/util";
const cron = require('node-cron');

(() => {
  cron.schedule('30 6 * * *', async () => {
    console.log(`Last Faucet: ${getCurrentTimeStr()}`)
    await faucetToken()
  });
})()