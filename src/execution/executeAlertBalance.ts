import {alertBalance} from "../bot/alertBalance"
const cron = require('node-cron');

(() => {
  cron.schedule('*,30 * * * *', async () => {
    await alertBalance()
  });
})()