import {TrackingType, Web3SupportNetwork} from "../types";
import {getLotterySignerAddress, getNativeBalance} from "../contracts";
import {getVrf, getVrfSubscriptionInfo} from "../contracts/chainlink/vrf";
import TelegramService from "../telegram/telegram-service";

// env, chain, text, balance, limit
interface TrackingJob {
  text: string,
  chain: Web3SupportNetwork,
  type: TrackingType,
  description: string,
  min: number,
}

const ENVIRONMENT = {
  "fxb_staging": {
    tracking: [
      {
        text: "fxb_stag backend",
        chain: Web3SupportNetwork.BSC_TESTNET,
        type: TrackingType.NATIVE,
        destination: '0xC84F9b16e48649732674F2Af237335CCFB91517f',
        min: 0.1
      },
      {
        text: "fxb_stag LINK fund",
        chain: Web3SupportNetwork.BSC_TESTNET,
        type: TrackingType.LINK,
        destination: '3130',
        min: 100
      }
    ]
  },
  "fxb_prod": {
    tracking: [
      {
        text: "fxb_prod backend",
        chain: Web3SupportNetwork.BSC_MAINNET,
        type: TrackingType.NATIVE,
        destination: '0x96D7D0CB2af031820Bc6D563ecA14FE4044f1C50',
        min: 0.1
      },
      {
        text: "fxb_prod LINK fund",
        chain: Web3SupportNetwork.BSC_MAINNET,
        type: TrackingType.LINK,
        destination: '962',
        min: 100
      }
    ]
  }
}
const alertBalance = async () => {
  // let botTelegramSession = new TelegramSession(true)
  // const clientTelegram = await botTelegramSession.getTelegramClient()
  // clientTelegram.on((event) => {
  //   console.log(event)
  // })
  const fxbStaging = ENVIRONMENT["fxb_prod"]
  for (const tracking of fxbStaging.tracking) {
    const {text, chain, destination, type, min} = tracking
    console.log(`${text} in ${chain}`)
    if (type == TrackingType.NATIVE) {
      const signerAddress = await getLotterySignerAddress(chain, destination)
      const nativeBalance = await getNativeBalance(chain, signerAddress)
      console.log(`signer address = ${signerAddress}`)
      console.log(`native balance = ${nativeBalance}`)
      if (nativeBalance <= min) {
        const message = `${text} in ${chain} running out.`
          + "\n"+`Please send native token to ${signerAddress}`
        const service = new TelegramService()
        await service.sendMessage( "2033157833", message)
      }
    } else if (type == TrackingType.LINK) {
      const subscriptionId = parseInt(destination)
      const subscription = await getVrfSubscriptionInfo(chain, subscriptionId)
      const {balance, owner} = subscription
      if (balance <= min) {
        const vrf = getVrf(chain)
        const message = `${text} in ${chain} running out. (under ${min} LINK)`
          + "\n"+`Fund subscription: ${vrf.subscriptionLink}/${subscriptionId} `
        const service = new TelegramService()
        await service.sendMessage( "2033157833", message)
      }
    }
  }
}


alertBalance()