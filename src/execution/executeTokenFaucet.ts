import {faucetToken} from "../bot/faucetToken"
const cron = require('node-cron');

(() => {
  cron.schedule('25 17 * * *', async () => {
    await faucetToken()
  });
})()