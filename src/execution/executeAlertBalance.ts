import {alertBalance} from "../bot/alertBalance"
const cron = require('node-cron');

(() => {
  cron.schedule('*/25 * * * *', async () => {
    await alertBalance()
  });
})()